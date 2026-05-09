import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit3, Trash2, Clock, Plus, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FeaturedEventData } from "../data/FeaturedMockData";
import FeaturedFormModal from "./FeaturedFormModal";
import Toast from "../../../../components/common/Toast";
import { FeaturedApi } from "../../../../services/events-management/FeaturedEventsApi";

export default function FeaturedList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedFeatured, setSelectedFeatured] = useState<FeaturedEventData | null>(null);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const { data: eventData, isLoading, isError } = useQuery({
        queryKey: ["featuredEvents", currentPage],
        queryFn: async () => {
            const response = await FeaturedApi.getAllFeaturedEvents(currentPage - 1, itemsPerPage);
            return response;
        },
    });

    const paginatedItems: FeaturedEventData[] = eventData?.object?.content || [];
    const totalPages = eventData?.object?.totalPages || 1;
    const totalElements = eventData?.object?.totalElements || 0;

    const getStatus = (startDate: string, endDate: string) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) return "PENDING";
        if (now > end) return "CLOSED";
        return "ACTIVE";
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-blue-50 text-blue-600 border-blue-200";
            case "ACTIVE": return "bg-green-50 text-green-600 border-green-200";
            case "CLOSED": return "bg-gray-100 text-gray-500 border-gray-200";
            default: return "bg-gray-50 text-gray-500";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDING": return "Sắp tới";
            case "ACTIVE": return "Đang ghim";
            case "CLOSED": return "Hết hạn";
            default: return status;
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedItems.length && paginatedItems.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedItems.map(item => item.featuredEventId));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleEdit = (item: FeaturedEventData) => {
        setSelectedFeatured(item);
        setFormMode("edit");
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedFeatured(null);
        setFormMode("create");
        setIsFormOpen(true);
    };

    const handleViewDetail = (item: FeaturedEventData) => {
        navigate(`/content-management/events/${item.eventId}`);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sự kiện nổi bật này?")) return;
        try {
            const res = await FeaturedApi.deleteFeaturedEvent([id]);
            if (res.statusCode === 200 || res.statusCode === 204) {
                setToast({ msg: "Xóa sự kiện nổi bật thành công", ok: true });
                queryClient.invalidateQueries({ queryKey: ["featuredEvents"] });
                setSelectedIds(prev => prev.filter(i => i !== id));
            } else {
                setToast({ msg: res.message || "Xóa thất bại", ok: false });
            }
        } catch (error: any) {
            setToast({ msg: error.message || "Có lỗi xảy ra", ok: false });
        }
        setTimeout(() => setToast(null), 3000);
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} sự kiện nổi bật?`)) return;
        try {
            const res = await FeaturedApi.deleteFeaturedEvent(selectedIds);
            if (res.statusCode === 200 || res.statusCode === 204) {
                setToast({ msg: "Xóa hàng loạt sự kiện nổi bật thành công", ok: true });
                queryClient.invalidateQueries({ queryKey: ["featuredEvents"] });
                setSelectedIds([]);
            } else {
                setToast({ msg: res.message || "Xóa thất bại", ok: false });
            }
        } catch (error: any) {
            setToast({ msg: error.message || "Có lỗi xảy ra", ok: false });
        }
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="flex flex-col gap-6">
            <Toast toast={toast} onClose={() => setToast(null)} />
            
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
            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-4">
                        <div className="w-10 h-10 border-4 border-[#0092B8]/30 border-t-[#0092B8] rounded-full animate-spin" />
                        <p className="text-gray-500 font-medium text-sm animate-pulse">Đang tải dữ liệu...</p>
                    </div>
                )}
                
                {isError && !isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 gap-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                            <X size={32} />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-gray-800 text-lg">Lỗi tải dữ liệu</h3>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto flex-1">
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
                                <th className="px-5 py-4">Tên sự kiện</th>
                                <th className="px-5 py-4">Thời gian hiển thị</th>
                                <th className="px-5 py-4 text-center">Trạng thái</th>
                                <th className="px-5 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedItems.map((item) => {
                                const isSelected = selectedIds.includes(item.featuredEventId);

                                return (
                                    <tr key={item.featuredEventId} className={`hover:bg-blue-50/30 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
                                        <td className="p-5">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded-md border-gray-300 text-[#0092B8] focus:ring-[#0092B8]/20 cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(item.featuredEventId)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="font-bold text-[#0092B8] text-lg">{item.priority}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1 max-w-[300px]">
                                                <span className="font-bold text-gray-800 truncate" title={item.eventTitle}>{item.eventTitle}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">ID: {item.eventId}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1 text-xs text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={13} className="text-gray-400" />
                                                    <span className="font-semibold">{new Date(item.startDate).toLocaleString("vi-VN")}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-[13px] flex justify-center"><div className="w-0.5 h-3 bg-gray-200"></div></div>
                                                    <span className="text-gray-400">đến</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={13} className="text-gray-400" />
                                                    <span className="font-semibold text-gray-500">{new Date(item.endDate).toLocaleString("vi-VN")}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-[11px] font-bold tracking-wide uppercase ${getStatusStyle(getStatus(item.startDate, item.endDate))}`}>
                                                {getStatusLabel(getStatus(item.startDate, item.endDate))}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleViewDetail(item)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Xem chi tiết sự kiện">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all" title="Chỉnh sửa">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.featuredEventId)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Xóa">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {!isLoading && paginatedItems.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 mt-auto">
                    <span className="text-sm text-gray-500 font-medium">
                        Hiển thị <span className="font-bold text-gray-800">{paginatedItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> đến <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, totalElements)}</span> trong <span className="font-bold text-gray-800">{totalElements}</span> mục
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || totalPages === 0}
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

            {/* Modals */}
            {isFormOpen && (
                <FeaturedFormModal 
                    featuredEvent={selectedFeatured} 
                    mode={formMode} 
                    onClose={() => setIsFormOpen(false)} 
                    onSuccess={() => {
                        setIsFormOpen(false);
                        setToast({ msg: formMode === "create" ? "Thêm mới thành công" : "Cập nhật thành công", ok: true });
                        setTimeout(() => setToast(null), 3000);
                        queryClient.invalidateQueries({ queryKey: ["featuredEvents"] });
                    }}
                />
            )}
        </div>
    );
}
