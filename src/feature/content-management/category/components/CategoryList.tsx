import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit3, Trash2, Settings2, Plus, X, AlertTriangle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryApi } from "../../../../services/events-management/CategoryApi";
import { CategoryInterface } from "../data/CategoryMockData";
import CategoryFormModal from "./CategoryFormModal";
import CategoryOptionsPanel from "./CategoryOptionsPanel";
import Toast from "../../../../components/common/Toast";

export default function CategoryList() {
    const queryClient = useQueryClient();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [toastState, setToastState] = useState<{ msg: string; ok: boolean } | null>(null);

    const showToast = (msg: string, ok = true) => {
        setToastState({ msg, ok });
        setTimeout(() => setToastState(null), 3000);
    };

    const { data: queryData, isLoading, isError } = useQuery({
        queryKey: ['categories', currentPage, itemsPerPage],
        queryFn: async () => {
            const res = await CategoryApi.getAllCategory(currentPage - 1, itemsPerPage);
            return res;
        }
    });
    const paginatedItems = queryData?.object?.content || [];
    const totalPages = queryData?.object?.totalPages || 1;
    const totalRecords = queryData?.object?.totalElements || 0;
    
    const selectedCategory = paginatedItems.find((c: CategoryInterface) => c.categoryId === selectedCategoryId) || null;

    const deleteMutation = useMutation({
        mutationFn: async (ids: number[]) => {
            await CategoryApi.deleteCategory(ids);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setSelectedIds([]);
            setIsDeleteConfirmOpen(false);
            setSelectedCategoryId(null);
            showToast("Xóa thành công", true);
        },
        onError: (err: any) => {
            setDeleteError(err.response?.data?.message || "Đã xảy ra lỗi khi xóa");
            showToast("Lỗi khi xóa", false);
        }
    });

    const saveCategoryMutation = useMutation({
        mutationFn: async (data: Pick<CategoryInterface, "name" | "type">) => {
            if (formMode === "edit" && selectedCategoryId) {
                return await CategoryApi.updateCategory(selectedCategoryId, data as any);
            }
            return await CategoryApi.createCategory(data as any);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsFormOpen(false);
            setSelectedCategoryId(null);
            showToast(formMode === "create" ? "Tạo danh mục thành công" : "Cập nhật danh mục thành công", true);
        },
        onError: () => {
            showToast("Có lỗi xảy ra khi lưu danh mục", false);
        }
    });

    if (queryData && queryData?.statusCode != 200) {
        console.error(queryData?.message);
        return null;
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedItems.length && paginatedItems.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedItems.map((c: CategoryInterface) => c.categoryId));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleFormModal = (mode: "create" | "edit", cat: CategoryInterface | null = null) => {
        setSelectedCategoryId(cat ? cat.categoryId : null);
        setFormMode(mode);
        setIsFormOpen(true);
    };

    const handleOpenOptions = (cat: CategoryInterface) => {
        setSelectedCategoryId(cat.categoryId);
        setIsOptionsOpen(true);
    };



    const handleSaveCategory = (data: Pick<CategoryInterface, "name" | "type">) => {
        saveCategoryMutation.mutate(data);
    };

    const handleDeleteClick = (cat: CategoryInterface) => {
        if (cat.options && cat.options.length > 0) {
            setDeleteError(`Không thể xóa danh mục "${cat.name}" vì còn ${cat.options.length} options liên kết. Hãy xóa hết options trước.`);
            setIsDeleteConfirmOpen(true);
            setSelectedCategoryId(null);
        } else {
            setSelectedCategoryId(cat.categoryId);
            setDeleteError(null);
            setIsDeleteConfirmOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (!selectedCategoryId) return;
        deleteMutation.mutate([selectedCategoryId]);
    };

    const handleBulkDelete = () => {
        const blocked = paginatedItems.filter((c: CategoryInterface) => selectedIds.includes(c.categoryId) && c.options && c.options.length > 0);
        if (blocked.length > 0) {
            const names = blocked.map((c: CategoryInterface) => `"${c.name}"`).join(", ");
            setDeleteError(`Không thể xóa các danh mục: ${names} vì còn options liên kết.`);
            setSelectedCategoryId(null);
            setIsDeleteConfirmOpen(true);
            return;
        }
        setDeleteError(null);
        deleteMutation.mutate(selectedIds);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-3xl border border-gray-100">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Loader2 size={24} className="animate-spin text-[#0092B8]" />
                    <p className="text-sm">Đang tải danh sách danh mục...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Toast toast={toastState} onClose={() => setToastState(null)} />
            
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-[#0092B8] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                                Đã chọn {selectedIds.length}
                            </span>
                            <button onClick={handleBulkDelete} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors">
                                <Trash2 size={14} /> Xóa hàng loạt
                            </button>
                            <button onClick={() => setSelectedIds([])} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">Danh sách danh mục</h2>
                    )}
                </div>
                <button onClick={() => handleFormModal("create")} className="px-4 py-2 bg-[#0092B8] text-white text-sm font-semibold rounded-xl hover:bg-[#007a99] transition-colors shadow-sm flex items-center gap-2">
                    <Plus size={18} /> Tạo danh mục
                </button>
            </div>

            {/* Table */}
            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 font-semibold tracking-wider">
                            <tr>
                                <th className="p-5 w-12">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded-md border-gray-300 text-[#0092B8] cursor-pointer"
                                            checked={selectedIds.length === paginatedItems.length && paginatedItems.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </div>
                                </th>
                                <th className="px-5 py-4">ID</th>
                                <th className="px-5 py-4">Tên danh mục</th>
                                <th className="px-5 py-4">Type</th>
                                <th className="px-5 py-4 text-center">Options</th>
                                <th className="px-5 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedItems.map((cat: CategoryInterface) => {
                                const isSelected = selectedIds.includes(cat.categoryId);
                                return (
                                    <tr key={cat.categoryId} className={`hover:bg-blue-50/30 transition-colors ${isSelected ? "bg-blue-50/50" : ""}`}>
                                        <td className="p-5">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded-md border-gray-300 text-[#0092B8] cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(cat.categoryId)}
                                                />
                                            </div>
                                        </td>
                                        {/* ID */}
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-mono text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                                                #{cat.categoryId}
                                            </span>
                                        </td>
                                        {/* Name */}
                                        <td className="px-5 py-4">
                                            <span className="font-bold text-gray-800">{cat.name}</span>
                                        </td>
                                        {/* Type */}
                                        <td className="px-5 py-4">
                                            <span className="px-3 py-1 bg-blue-50 text-[#0092B8] rounded-lg text-xs font-bold border border-blue-100 font-mono">
                                                {cat.type}
                                            </span>
                                        </td>
                                        {/* Options count */}
                                        <td className="px-5 py-4 text-center">
                                            <button
                                                onClick={() => handleOpenOptions(cat)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all text-[#0092B8] bg-blue-50 border-blue-100 hover:bg-blue-100"
                                            >
                                                <Settings2 size={13} />
                                                {cat.options?.length || 0} options
                                            </button>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleFormModal("edit", cat)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all" title="Chỉnh sửa">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(cat)}
                                                    className={`p-2 rounded-xl transition-all ${cat.options?.length > 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
                                                    title={cat.options?.length > 0 ? "Không thể xóa: còn options liên kết" : "Xóa"}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">
                        Hiển thị <span className="font-bold text-gray-800">{paginatedItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> đến <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, totalRecords)}</span> trong <span className="font-bold text-gray-800">{totalRecords}</span> danh mục
                    </span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600">
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? "bg-[#0092B8] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Form Modal */}
            {isFormOpen && (
                <CategoryFormModal
                    category={selectedCategory}
                    mode={formMode}
                    onClose={() => setIsFormOpen(false)}
                    onConfirm={handleSaveCategory}
                />
            )}

            {/* Options Panel */}
            {isOptionsOpen && selectedCategory && (
                <CategoryOptionsPanel
                    category={selectedCategory}
                    onClose={() => setIsOptionsOpen(false)}
                    onUpdate={() => {
                        setIsOptionsOpen(false);
                        queryClient.invalidateQueries({ queryKey: ['categories'] })
                    }}
                    onToast={showToast}
                />
            )}

            {/* Delete Confirm / Error Dialog */}
            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4 animate-[zoomIn_0.2s_ease]">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${deleteError ? "bg-amber-50" : "bg-red-50"}`}>
                            <AlertTriangle size={24} className={deleteError ? "text-amber-500" : "text-red-500"} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-base font-bold text-gray-800">
                                {deleteError ? "Không thể xóa" : "Xác nhận xóa danh mục"}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {deleteError || `Bạn có chắc muốn xóa danh mục "${selectedCategory?.name}"? Hành động này không thể hoàn tác.`}
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-2">
                            <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                {deleteError ? "Đóng" : "Hủy"}
                            </button>
                            {!deleteError && (
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={deleteMutation.isPending}
                                    className="px-5 py-2 flex items-center gap-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm disabled:opacity-50">
                                    {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                                    Xóa
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
