import { useMemo, useState } from "react";
import { AlertTriangle, ChevronsDownUp, ChevronsUpDown, FolderTree, Loader2, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CategoryApi, CATEGORIES_QUERY_KEY } from "../../../../services/events-management/CategoryApi";
import { ApiError, getErrorMessage } from "../../../../services/apiError";
import Toast from "../../../../components/common/Toast";
import type { CategoryTreeNode, CategoryUpsertRequest } from "../data/category.types";
import {
    collectExpandableIds,
    collectSubtreeIds,
    computeStats,
    filterTree,
    findNode,
    flattenTree,
} from "../data/categoryTree";
import type { CategoryFormValues } from "../categoryForm.schema";
import CategoryFormModal from "./CategoryFormModal";
import CategoryTreeRow from "./CategoryTreeRow";

const TOAST_DURATION_MS = 3000;
const HTTP_CONFLICT = 409;
const CATEGORY_IN_USE_HINT = "Danh mục đang được gán cho sự kiện — tổ chức cần gỡ danh mục khỏi các sự kiện đó trước khi xóa.";

/** 409 = danh mục đang gán cho sự kiện: thử lại cũng không qua → khóa nút Xóa và giải thích. */
function toDeleteError(err: unknown): { message: string; isBlocked: boolean } {
    if (err instanceof ApiError && err.status === HTTP_CONFLICT) {
        return { message: `${err.message.replace(/\.$/, "")}. ${CATEGORY_IN_USE_HINT}`, isBlocked: true };
    }
    return { message: getErrorMessage(err, "Có lỗi xảy ra khi xóa danh mục"), isBlocked: false };
}

interface CategoryListProps {
    filter?: { search?: string };
}

type FormState =
    | { mode: "create"; initialValues: CategoryFormValues }
    | { mode: "edit"; categoryId: string; initialValues: CategoryFormValues };

export default function CategoryList({ filter }: CategoryListProps) {
    const queryClient = useQueryClient();
    const keyword = filter?.search ?? "";

    // Mặc định mở toàn bộ cây; chỉ lưu những nhánh người dùng thu gọn.
    const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
    const [formState, setFormState] = useState<FormState | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CategoryTreeNode | null>(null);
    const [deleteError, setDeleteError] = useState<{ message: string; isBlocked: boolean } | null>(null);
    const [toastState, setToastState] = useState<{ msg: string; ok: boolean } | null>(null);

    const showToast = (msg: string, ok = true) => {
        setToastState({ msg, ok });
        setTimeout(() => setToastState(null), TOAST_DURATION_MS);
    };

    const { data: tree = [], isLoading, isError } = useQuery({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: CategoryApi.getTree,
    });

    const stats = useMemo(() => computeStats(tree), [tree]);
    const flatAll = useMemo(() => flattenTree(tree), [tree]);
    const childCounts = useMemo(() => new Map(flatAll.map((item) => [item.categoryId, item.childCount])), [flatAll]);
    const { nodes: visibleTree, expandIds: searchExpandIds } = useMemo(() => filterTree(tree, keyword), [tree, keyword]);

    const expandedIds = useMemo(() => {
        const ids = new Set(collectExpandableIds(tree).filter((id) => !collapsedIds.has(id)));
        searchExpandIds.forEach((id) => ids.add(id));
        return ids;
    }, [tree, collapsedIds, searchExpandIds]);

    const parentOptions = useMemo(() => {
        if (formState?.mode !== "edit") return flatAll;
        const editing = findNode(tree, formState.categoryId);
        const excluded = editing ? collectSubtreeIds(editing) : new Set<string>();
        return flatAll.filter((item) => !excluded.has(item.categoryId));
    }, [formState, flatAll, tree]);

    const invalidateTree = () => queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });

    const saveMutation = useMutation({
        mutationFn: ({ state, payload }: { state: FormState; payload: CategoryUpsertRequest }) =>
            state.mode === "edit" ? CategoryApi.update(state.categoryId, payload) : CategoryApi.create(payload),
        onSuccess: (_data, { state, payload }) => {
            invalidateTree();
            // Mở nhánh cha để thấy ngay danh mục vừa tạo / vừa chuyển.
            if (payload.parentCategoryId) {
                const parentId = payload.parentCategoryId;
                setCollapsedIds((prev) => new Set(Array.from(prev).filter((id) => id !== parentId)));
            }
            setFormState(null);
            showToast(state.mode === "create" ? "Tạo danh mục thành công" : "Cập nhật danh mục thành công");
        },
        onError: (err: unknown) => setFormError(getErrorMessage(err, "Có lỗi xảy ra khi lưu danh mục")),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => CategoryApi.remove(id),
        onSuccess: () => {
            invalidateTree();
            setDeleteTarget(null);
            showToast("Xóa danh mục thành công");
        },
        onError: (err: unknown) => {
            setDeleteError(toDeleteError(err));
            // Cây có thể đã cũ (vd. vừa có người thêm danh mục con) → tải lại
            invalidateTree();
        },
    });

    const openForm = (state: FormState) => {
        setFormError(null);
        setFormState(state);
    };

    const handleToggle = (id: string) => {
        setCollapsedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleCreateRoot = () => openForm({ mode: "create", initialValues: { name: "", parentCategoryId: "" } });

    const handleAddChild = (node: CategoryTreeNode) =>
        openForm({ mode: "create", initialValues: { name: "", parentCategoryId: node.categoryId } });

    const handleEdit = (node: CategoryTreeNode) =>
        openForm({
            mode: "edit",
            categoryId: node.categoryId,
            initialValues: { name: node.name, parentCategoryId: node.parentCategoryId ?? "" },
        });

    const handleDelete = (node: CategoryTreeNode) => {
        setDeleteError(null);
        setDeleteTarget(node);
    };

    const handleSubmit = (payload: CategoryUpsertRequest) => {
        if (!formState) return;
        setFormError(null);
        saveMutation.mutate({ state: formState, payload });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-3xl border border-gray-100">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Loader2 size={24} className="animate-spin text-[#0092B8]" />
                    <p className="text-sm">Đang tải cây danh mục...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return <div role="alert" className="p-12 text-center text-red-500 bg-white rounded-3xl border border-red-100 font-medium">Không tải được danh sách danh mục!</div>;
    }

    const statCards = [
        { title: "Tổng danh mục", value: stats.total, color: "text-gray-800" },
        { title: "Danh mục gốc", value: stats.roots, color: "text-[#0092B8]" },
        { title: "Danh mục con", value: stats.children, color: "text-green-500" },
        { title: "Số tầng", value: stats.maxDepth, color: "text-amber-500" },
    ];

    return (
        <div className="flex flex-col gap-6">
            <Toast toast={toastState} onClose={() => setToastState(null)} />

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <div key={card.title} className="flex flex-col gap-2 items-center justify-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                        <h3 className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-wider">{card.title}</h3>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-lg font-bold text-gray-800 tracking-tight">Cây danh mục</h2>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setCollapsedIds(new Set())}
                        className="px-3 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                    >
                        <ChevronsUpDown size={15} /> Mở tất cả
                    </button>
                    <button
                        type="button"
                        onClick={() => setCollapsedIds(new Set(collectExpandableIds(tree)))}
                        className="px-3 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                    >
                        <ChevronsDownUp size={15} /> Thu gọn
                    </button>
                    <button
                        type="button"
                        onClick={handleCreateRoot}
                        className="px-4 py-2 bg-[#0092B8] text-white text-sm font-semibold rounded-xl hover:bg-[#007a99] transition-colors shadow-sm flex items-center gap-2"
                    >
                        <Plus size={18} /> Tạo danh mục gốc
                    </button>
                </div>
            </div>

            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {visibleTree.length === 0 ? (
                    <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                        <FolderTree size={32} className="opacity-30" />
                        <p className="text-sm font-medium">
                            {keyword.trim() ? `Không có danh mục nào khớp "${keyword.trim()}"` : "Chưa có danh mục nào"}
                        </p>
                    </div>
                ) : (
                    <ul role="tree" aria-label="Cây danh mục sự kiện" className="divide-y divide-gray-50 py-2">
                        {visibleTree.map((node) => (
                            <CategoryTreeRow
                                key={node.categoryId}
                                node={node}
                                depth={0}
                                expandedIds={expandedIds}
                                childCounts={childCounts}
                                keyword={keyword}
                                onToggle={handleToggle}
                                onAddChild={handleAddChild}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </ul>
                )}
            </div>

            {formState && (
                <CategoryFormModal
                    key={formState.mode === "edit" ? formState.categoryId : `new-${formState.initialValues.parentCategoryId}`}
                    mode={formState.mode}
                    initialValues={formState.initialValues}
                    parentOptions={parentOptions}
                    isSaving={saveMutation.isPending}
                    serverError={formError}
                    onClose={() => setFormState(null)}
                    onSubmit={handleSubmit}
                />
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                    <div role="alertdialog" aria-labelledby="category-delete-title" className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4 animate-[zoomIn_0.2s_ease]">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50">
                            <AlertTriangle size={24} className="text-red-500" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 id="category-delete-title" className="text-base font-bold text-gray-800">Xác nhận xóa danh mục</h3>
                            <p className="text-sm text-gray-500">
                                Bạn có chắc muốn xóa danh mục <strong className="text-gray-700">"{deleteTarget.name}"</strong>? Hành động này không thể hoàn tác.
                            </p>
                            {deleteError && <p role="alert" className="text-sm text-red-600 font-medium mt-2">{deleteError.message}</p>}
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-2">
                            <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={() => deleteMutation.mutate(deleteTarget.categoryId)}
                                disabled={deleteMutation.isPending || deleteError?.isBlocked === true}
                                className="px-5 py-2 flex items-center gap-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                            >
                                {deleteMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
