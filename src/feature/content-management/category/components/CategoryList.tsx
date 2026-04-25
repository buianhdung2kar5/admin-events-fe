import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit3, Trash2, Settings2, Plus, X, AlertTriangle } from "lucide-react";
import { MockCategories, CategoryItem } from "../data/CategoryMockData";
import CategoryFormModal from "./CategoryFormModal";
import CategoryOptionsPanel from "./CategoryOptionsPanel";

export default function CategoryList() {
    const [categories, setCategories] = useState<CategoryItem[]>(MockCategories);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // UI State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const paginatedItems = categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedItems.length && paginatedItems.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedItems.map(c => c.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setFormMode("create");
        setIsFormOpen(true);
    };

    const handleEdit = (cat: CategoryItem) => {
        setSelectedCategory(cat);
        setFormMode("edit");
        setIsFormOpen(true);
    };

    const handleOpenOptions = (cat: CategoryItem) => {
        setSelectedCategory(cat);
        setIsOptionsOpen(true);
    };

    const handleUpdateCategory = (updated: CategoryItem) => {
        setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
        if (selectedCategory?.id === updated.id) setSelectedCategory(updated);
    };

    const handleDeleteClick = (cat: CategoryItem) => {
        if (cat.options.length > 0) {
            setDeleteError(`Không thể xóa danh mục "${cat.name}" vì còn ${cat.options.length} options liên kết. Hãy xóa hết options trước.`);
            setIsDeleteConfirmOpen(true);
            setSelectedCategory(null);
        } else {
            setSelectedCategory(cat);
            setDeleteError(null);
            setIsDeleteConfirmOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (!selectedCategory) return;
        setCategories(prev => prev.filter(c => c.id !== selectedCategory.id));
        setSelectedIds(prev => prev.filter(i => i !== selectedCategory.id));
        setIsDeleteConfirmOpen(false);
        setSelectedCategory(null);
    };

    const handleBulkDelete = () => {
        const blocked = categories.filter(c => selectedIds.includes(c.id) && c.options.length > 0);
        if (blocked.length > 0) {
            const names = blocked.map(c => `"${c.name}"`).join(", ");
            setDeleteError(`Không thể xóa các danh mục: ${names} vì còn options liên kết.`);
            setSelectedCategory(null);
            setIsDeleteConfirmOpen(true);
            return;
        }
        setCategories(prev => prev.filter(c => !selectedIds.includes(c.id)));
        setSelectedIds([]);
    };

    return (
        <div className="flex flex-col gap-6">
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
                <button onClick={handleCreate} className="px-4 py-2 bg-[#0092B8] text-white text-sm font-semibold rounded-xl hover:bg-[#007a99] transition-colors shadow-sm flex items-center gap-2">
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
                                <th className="px-5 py-4">Danh mục</th>
                                <th className="px-5 py-4">Slug</th>
                                <th className="px-5 py-4 text-center">Sự kiện</th>
                                <th className="px-5 py-4 text-center">Options</th>
                                <th className="px-5 py-4 text-center">Trạng thái</th>
                                <th className="px-5 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedItems.map((cat) => {
                                const isSelected = selectedIds.includes(cat.id);
                                return (
                                    <tr key={cat.id} className={`hover:bg-blue-50/30 transition-colors ${isSelected ? "bg-blue-50/50" : ""}`}>
                                        <td className="p-5">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded-md border-gray-300 text-[#0092B8] cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(cat.id)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-0.5 max-w-[260px]">
                                                <span className="font-bold text-gray-800">{cat.name}</span>
                                                <span className="text-xs text-gray-400 truncate">{cat.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-mono border border-gray-100">
                                                {cat.slug}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="font-bold text-gray-700">{cat.eventCount}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <button
                                                onClick={() => handleOpenOptions(cat)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all text-[#0092B8] bg-blue-50 border-blue-100 hover:bg-blue-100"
                                            >
                                                <Settings2 size={13} />
                                                {cat.options.length} options
                                            </button>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-[11px] font-bold tracking-wide uppercase ${
                                                cat.status === "Active"
                                                    ? "bg-green-50 text-green-600 border-green-200"
                                                    : "bg-gray-100 text-gray-400 border-gray-200"
                                            }`}>
                                                {cat.status === "Active" ? "Hoạt động" : "Tạm dừng"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all" title="Chỉnh sửa">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(cat)}
                                                    className={`p-2 rounded-xl transition-all ${cat.options.length > 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
                                                    title={cat.options.length > 0 ? "Không thể xóa: còn options liên kết" : "Xóa"}
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
                        Hiển thị <span className="font-bold text-gray-800">{paginatedItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> đến <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, categories.length)}</span> trong <span className="font-bold text-gray-800">{categories.length}</span> danh mục
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
                />
            )}

            {/* Options Panel */}
            {isOptionsOpen && selectedCategory && (
                <CategoryOptionsPanel
                    category={selectedCategory}
                    onClose={() => setIsOptionsOpen(false)}
                    onUpdate={handleUpdateCategory}
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
                                <button onClick={handleConfirmDelete} className="px-5 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm">
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
