import { ChevronRight, Edit3, FolderTree, Plus, Trash2 } from "lucide-react";

import type { CategoryTreeNode } from "../data/category.types";

/** Lề trái của nhóm con so với cha — lồng nhau nên tự cộng dồn theo tầng. */
const CHILD_GROUP_INDENT_PX = 28;
/** UUID backend sinh theo thời gian (8 ký tự đầu thường trùng) → hiển thị phần cuối. */
const ID_SUFFIX_LENGTH = 8;

interface Props {
    node: CategoryTreeNode;
    depth: number;
    expandedIds: Set<string>;
    /** Số con thật của từng nút — khi đang lọc, `node.children` chỉ còn các con khớp từ khóa. */
    childCounts: Map<string, number>;
    keyword: string;
    onToggle: (id: string) => void;
    onAddChild: (node: CategoryTreeNode) => void;
    onEdit: (node: CategoryTreeNode) => void;
    onDelete: (node: CategoryTreeNode) => void;
}

function HighlightedName({ name, keyword }: { name: string; keyword: string }) {
    const query = keyword.trim().toLowerCase();
    const index = query ? name.toLowerCase().indexOf(query) : -1;
    if (index < 0) return <>{name}</>;
    return (
        <>
            {name.slice(0, index)}
            <mark className="bg-amber-100 text-gray-900 rounded px-0.5">{name.slice(index, index + query.length)}</mark>
            {name.slice(index + query.length)}
        </>
    );
}

/** Một dòng trong cây danh mục, tự render đệ quy các con khi được mở. */
export default function CategoryTreeRow({ node, depth, expandedIds, childCounts, keyword, onToggle, onAddChild, onEdit, onDelete }: Props) {
    const hasChildren = node.children.length > 0;
    const childCount = childCounts.get(node.categoryId) ?? node.children.length;
    const isExpanded = hasChildren && expandedIds.has(node.categoryId);
    const isRoot = depth === 0;
    const deleteTitle = hasChildren ? "Không thể xóa: còn danh mục con, hãy xóa các danh mục con trước" : "Xóa";

    return (
        <li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={false}>
            <div
                className="group flex items-center gap-3 pl-4 pr-4 py-3 hover:bg-blue-50/40 transition-colors">
                <button
                    type="button"
                    onClick={() => onToggle(node.categoryId)}
                    disabled={!hasChildren}
                    aria-label={isExpanded ? `Thu gọn ${node.name}` : `Mở ${node.name}`}
                    className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:invisible"
                >
                    <ChevronRight size={16} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </button>

                <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${isRoot ? "bg-[#0092B8]/10 text-[#0092B8]" : "bg-gray-100 text-gray-400"}`}>
                    <FolderTree size={15} />
                </span>

                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                    <span className={`truncate ${isRoot ? "font-bold text-gray-800" : "font-semibold text-gray-700"}`}>
                        <HighlightedName name={node.name} keyword={keyword} />
                    </span>
                    {hasChildren && (
                        <span className="text-[11px] font-semibold text-[#0092B8] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg">
                            {childCount} con
                        </span>
                    )}
                    <span className="text-[11px] font-mono text-gray-400" title={node.categoryId}>
                        #{node.categoryId.slice(-ID_SUFFIX_LENGTH)}
                    </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={() => onAddChild(node)}
                        className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-xl transition-all"
                        title="Thêm danh mục con"
                        aria-label={`Thêm danh mục con cho ${node.name}`}
                    >
                        <Plus size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(node)}
                        className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                        title="Chỉnh sửa"
                        aria-label={`Chỉnh sửa ${node.name}`}
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(node)}
                        disabled={hasChildren}
                        className="p-2 rounded-xl transition-all text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:text-gray-200 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                        title={deleteTitle}
                        aria-label={`Xóa ${node.name}`}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <ul role="group" className="border-l border-dashed border-gray-200" style={{ marginLeft: CHILD_GROUP_INDENT_PX }}>
                    {node.children.map((child) => (
                        <CategoryTreeRow
                            key={child.categoryId}
                            node={child}
                            depth={depth + 1}
                            expandedIds={expandedIds}
                            childCounts={childCounts}
                            keyword={keyword}
                            onToggle={onToggle}
                            onAddChild={onAddChild}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}
