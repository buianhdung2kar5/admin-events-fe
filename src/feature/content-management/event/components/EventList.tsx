import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Trash2, Eye, Calendar, MapPin, Users, Lock, Unlock, X, MessageSquare, ClipboardList } from "lucide-react";
import { getEventStatusStyles } from "../data/EventMockData";
import FeedbackPanel from "./FeedbackPanel";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EventsApi } from "../../../../services/events-management/EventsApi";

export default function EventList() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const navigate = useNavigate();
    
    const [feedbackEvent, setFeedbackEvent] = useState<any | null>(null);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [lockTargetId, setLockTargetId] = useState<string | null>(null);
    const [lockReason, setLockReason] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    
    const { data: eventData, isLoading, isError } = useQuery({
        queryKey: ["events", currentPage],
        queryFn: async () => {
            const response = await EventsApi.getAll(currentPage - 1, itemsPerPage);
            return response;
        },
    });

    const eventsList = eventData?.object?.content || [];
    const totalPages = eventData?.object?.totalPages || 1;
    const totalElements = eventData?.object?.totalElements || 0;

    const toggleSelectAll = () => {
        if (selectedIds.length === eventsList.length && eventsList.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(eventsList.map((e: any) => e.eventId.toString()));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleViewDetail = (event: any) => {
        navigate(`/content-management/events/${event.eventId}`);
    };

    const handleDelete = (id: string) => {
        // TODO: Call Delete API
    };

    const handleBulkDelete = () => {
        // TODO: Call Bulk Delete API
    };

    const handleAttendance = (eventId: string) => {
        navigate(`/content-management/attendance?eventId=${eventId}`);
    };

    const handleLockToggle = (event: any) => {
        if (event.status !== "LOCKED") {
            setLockTargetId(event.eventId.toString());
            setLockReason("");
            setIsLockModalOpen(true);
        } else {
            // TODO: Call Unlock API
            console.log("Unlock event", event.eventId);
        }
    };

    const confirmLockEvent = () => {
        if (!lockTargetId || !lockReason.trim()) return;

        // TODO: call POST /admin/bulk-suspend
        console.log("Lock event", lockTargetId, lockReason);
        setIsLockModalOpen(false);
        setLockTargetId(null);
    };

    if (feedbackEvent) {
        return <FeedbackPanel event={feedbackEvent} onBack={() => setFeedbackEvent(null)} />;
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 ? (
                        <div className="flex items-center gap-3 animate-[fade-in_0.2s_ease]">
                            <span className="text-sm font-semibold text-[#0092B8] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                                Đã chọn {selectedIds.length} sự kiện
                            </span>
                            <button onClick={handleBulkDelete} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors">
                                <Trash2 size={14} /> Xóa hàng loạt
                            </button>
                            <button onClick={() => setSelectedIds([])} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">Danh sách sự kiện</h2>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-4">
                        <div className="w-10 h-10 border-4 border-[#0092B8]/30 border-t-[#0092B8] rounded-full animate-spin" />
                        <p className="text-gray-500 font-medium text-sm animate-pulse">Đang tải dữ liệu sự kiện...</p>
                    </div>
                )}
                
                {isError && !isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 gap-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                            <X size={32} />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-gray-800 text-lg">Lỗi tải dữ liệu</h3>
                            <p className="text-gray-500 text-sm mt-1">Không thể kết nối đến máy chủ. Vui lòng thử lại sau.</p>
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
                                            checked={selectedIds.length === eventsList.length && eventsList.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </div>
                                </th>
                                <th className="px-5 py-4">Sự kiện</th>
                                <th className="px-5 py-4">Thời gian & Địa điểm</th>
                                <th className="px-5 py-4 text-center">Trạng thái</th>
                                <th className="px-5 py-4 text-center">Số lượng</th>
                                <th className="px-5 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {!isLoading && !isError && eventsList.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center text-gray-500 font-medium">
                                        Chưa có sự kiện nào
                                    </td>
                                </tr>
                            )}
                            {eventsList.map((event: any) => {
                                const statusStyle = getEventStatusStyles(event.status);
                                const isSelected = selectedIds.includes(event.eventId.toString());
                                const locationCategory = event.categories?.find((c: any) => c.type === "LOCATION");
                                const venue = locationCategory?.options?.[0]?.value || "Chưa cập nhật";

                                return (
                                    <tr key={event.eventId} className={`hover:bg-blue-50/30 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
                                        <td className="p-5">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded-md border-gray-300 text-[#0092B8] focus:ring-[#0092B8]/20 cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(event.eventId.toString())}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={event.banner || "https://placehold.co/100x60/f3f4f6/a1a1aa?text=No+Image"} alt="" className="w-20 h-12 object-cover rounded-xl shadow-sm" />
                                                <div className="flex flex-col gap-1 max-w-[250px]">
                                                    <span className="font-bold text-gray-800 truncate" title={event.title}>{event.title}</span>
                                                    {event.categories?.find((c: any) => c.type === "STYLE") && (
                                                        <span className="text-xs text-gray-500 font-medium truncate">
                                                            {event.categories.find((c: any) => c.type === "STYLE")?.options?.[0]?.value}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={13} className="text-gray-400" />
                                                    <span className="font-medium">
                                                        {event.startTime ? new Date(event.startTime).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={13} className="text-gray-400" />
                                                    <span className="truncate max-w-[150px]" title={venue}>{venue}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-[11px] font-bold tracking-wide uppercase ${statusStyle.color}`}>
                                                {statusStyle.label}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 font-semibold text-xs">
                                                <Users size={14} className="text-[#0092B8]" />
                                                {event.totalParticipants} / {event.capacity}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleLockToggle(event)}
                                                    className={`p-2 rounded-xl transition-all ${
                                                        event.status === "LOCKED"
                                                            ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                                                            : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                                                    }`}
                                                    title={event.status === "LOCKED" ? "Mở khóa bài đăng" : "Khóa bài đăng"}
                                                >
                                                    {event.status === "LOCKED" ? <Unlock size={16} /> : <Lock size={16} />}
                                                </button>
                                                <button onClick={() => setFeedbackEvent(event)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all" title="Khảo sát / Phản hồi">
                                                    <MessageSquare size={16} />
                                                </button>
                                                <button onClick={() => handleAttendance(event.eventId.toString())} className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all" title="Điểm danh">
                                                    <ClipboardList size={16} />
                                                </button>
                                                <button onClick={() => handleViewDetail(event)} className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-xl transition-all" title="Chi tiết">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(event.eventId.toString())} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Xóa">
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
                        Hiển thị <span className="font-bold text-gray-800">{eventsList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> đến <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, totalElements)}</span> trong <span className="font-bold text-gray-800">{totalElements}</span> sự kiện
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


            {/* Lock Event Modal */}
            {isLockModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsLockModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                        <div className="flex flex-col gap-4 bg-amber-50 p-6">
                            <h4 className="font-bold text-amber-600 text-lg flex items-center gap-2">
                                <Lock size={20} /> Xác nhận khóa sự kiện
                            </h4>
                            <p className="text-sm text-amber-600/80">
                                Sự kiện này sẽ bị khóa. Người dùng sẽ không thể đăng ký mới hoặc điểm danh. Những người đã đăng ký vẫn giữ nguyên trạng thái.
                            </p>
                        </div>
                        <div className="p-6 flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Lý do khóa <span className="text-red-500">*</span></label>
                                <textarea rows={3} value={lockReason} onChange={e => setLockReason(e.target.value)} placeholder="Nhập lý do khóa sự kiện (vd: Chứa nội dung không phù hợp)..." className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500 resize-none" />
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                                <button onClick={() => setIsLockModalOpen(false)} className="flex-1 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                    Hủy
                                </button>
                                <button 
                                    onClick={confirmLockEvent} 
                                    disabled={!lockReason.trim()}
                                    className="flex-1 py-3 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                    Xác nhận Khóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
