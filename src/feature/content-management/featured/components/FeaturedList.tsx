import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit3, Trash2, Clock, Plus, X } from "lucide-react";
import { MockFeatured, FeaturedItem } from "../data/FeaturedMockData";
import FeaturedFormModal from "./FeaturedFormModal";

export default function FeaturedList() {
    const [featured, setFeatured] = useState<FeaturedItem[]>(MockFeatured);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    // UI State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedFeatured, setSelectedFeatured] = useState<FeaturedItem | null>(null);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const sortedFeatured = [...featured].sort((a, b) => a.order - b.order);
    const totalPages = Math.ceil(sortedFeatured.length / itemsPerPage);
    const paginatedItems = sortedFeatured.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedItems.length && paginatedItems.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedItems.map(item => item.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleEdit = (item: FeaturedItem) => {
        setSelectedFeatured(item);
        setFormMode("edit");
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedFeatured(null);
        setFormMode("create");
        setIsFormOpen(true);
    };

    const resequenceOrder = (items: FeaturedItem[]) => {
        return items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => ({ ...item, order: index + 1 }));
    };

    const handleDelete = (id: string) => {
        setFeatured(prev => resequenceOrder(prev.filter(item => item.id !== id)));
        setSelectedIds(prev => prev.filter(i => i !== id));
    };

    const handleBulkDelete = () => {
        setFeatured(prev => resequenceOrder(prev.filter(item => !selectedIds.includes(item.id))));
        setSelectedIds([]);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Displaying": return "bg-green-50 text-green-600 border-green-200";
            case "Scheduled": return "bg-blue-50 text-blue-600 border-blue-200";
            case "Expired": return "bg-gray-100 text-gray-500 border-gray-200";
            default: return "bg-gray-50 text-gray-500";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "Displaying": return "Đang hiển thị";
            case "Scheduled": return "Lên lịch";
            case "Expired": return "Hết hạn";
            default: return status;
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 ? (
                        <div className="flex items-center gap-3 animate-[fade-in_0.2s_ease]">
                            <span className="text-sm font-semibold text-[#0092B8] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                                Đã chọn {selectedIds.length} mục
                            </span>
                            <button onClick={handleBulkDelete} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors">
                                <Trash2 size={14} /> Xóa hàng loạt
                            </button>
                            <button onClick={() => setSelectedIds([])} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">Sự kiện nổi bật</h2>
                    )}
                </div>
                <button onClick={handleCreate} className="px-4 py-2 bg-[#0092B8] text-white text-sm font-semibold rounded-xl hover:bg-[#007a99] transition-colors shadow-sm flex items-center gap-2">
                    <Plus size={18} /> Thêm nổi bật
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
                                            className="w-4 h-4 rounded-md border-gray-300 text-[#0092B8] focus:ring-[#0092B8]/20 cursor-pointer"
                                            checked={selectedIds.length === paginatedItems.length && paginatedItems.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </div>
                                </th>
                                <th className="px-5 py-4 w-24 text-center">Thứ tự</th>
                                <th className="px-5 py-4">Sự kiện</th>
                                <th className="px-5 py-4">Thời gian hiển thị</th>
                                <th className="px-5 py-4 text-center">Trạng thái</th>
                                <th className="px-5 py-4 text-center">Lượt Click</th>
                                <th className="px-5 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedItems.map((item, index) => {
                                const isSelected = selectedIds.includes(item.id);

                                return (
                                    <tr key={item.id} className={`hover:bg-blue-50/30 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
                                        <td className="p-5">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded-md border-gray-300 text-[#0092B8] focus:ring-[#0092B8]/20 cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(item.id)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="font-bold text-[#0092B8] text-lg">{item.order}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={item.thumbnailUrl} alt="" className="w-20 h-12 object-cover rounded-xl shadow-sm border border-gray-100" />
                                                <div className="flex flex-col gap-1 max-w-[250px]">
                                                    <span className="font-bold text-gray-800 truncate" title={item.title}>{item.title}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium truncate">{item.organization}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1 text-xs text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={13} className="text-gray-400" />
                                                    <span className="font-semibold">{new Date(item.startTime).toLocaleString("vi-VN")}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-[13px] flex justify-center"><div className="w-0.5 h-3 bg-gray-200"></div></div>
                                                    <span className="text-gray-400">đến</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={13} className="text-gray-400" />
                                                    <span className="font-semibold text-gray-500">{new Date(item.endTime).toLocaleString("vi-VN")}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-[11px] font-bold tracking-wide uppercase ${getStatusStyle(item.status)}`}>
                                                {getStatusLabel(item.status)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="font-bold text-gray-700 text-sm">{item.clicks.toLocaleString()}</span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all" title="Chỉnh sửa">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Xóa">
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
                        Hiển thị <span className="font-bold text-gray-800">{paginatedItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> đến <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, featured.length)}</span> trong <span className="font-bold text-gray-800">{featured.length}</span> mục
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-[#0092B8] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isFormOpen && (
                <FeaturedFormModal 
                    featuredEvent={selectedFeatured} 
                    mode={formMode} 
                    onClose={() => setIsFormOpen(false)} 
                />
            )}
        </div>
    );
}
