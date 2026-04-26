import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Trash2, Eye, Calendar, MapPin, Users, Lock, Unlock, X, MessageSquare, ClipboardList } from "lucide-react";
import { MockEvents, EventItem, getEventStatusStyles } from "../data/EventMockData";
import EventDetailPanel from "./EventDetailPanel";
import EventFormModal from "./EventFormModal";
import FeedbackPanel from "./FeedbackPanel";

export default function EventList() {
    const [events, setEvents] = useState<EventItem[]>(MockEvents);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const navigate = useNavigate();
    
    // UI State
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [feedbackEvent, setFeedbackEvent] = useState<EventItem | null>(null);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [lockTargetId, setLockTargetId] = useState<string | null>(null);
    const [lockReason, setLockReason] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(events.length / itemsPerPage);
    const paginatedEvents = events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedEvents.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedEvents.map(e => e.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleViewDetail = (event: EventItem) => {
        setSelectedEvent(event);
        setIsDetailOpen(true);
    };

    const handleDelete = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
        setSelectedIds(prev => prev.filter(i => i !== id));
    };

    const handleBulkDelete = () => {
        setEvents(prev => prev.filter(e => !selectedIds.includes(e.id)));
        setSelectedIds([]);
    };

    const handleAttendance = (eventId: string) => {
        navigate(`/content-management/attendance?eventId=${eventId}`);
    };

    const handleLockToggle = (event: EventItem) => {
        if (event.status !== "LOCKED") {
            setLockTargetId(event.id);
            setLockReason("");
            setIsLockModalOpen(true);
        } else {
            setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: "PUBLISHED" } : e));
        }
    };

    const confirmLockEvent = () => {
        if (!lockTargetId || !lockReason.trim()) return;

        setEvents(prev => prev.map(e => {
            if (e.id === lockTargetId) {
                // TODO: call POST /admin/bulk-suspend
                // body: {
                //   "entityType": "EVENT",
                //   "entityIds": [lockTargetId],
                //   "reason": lockReason
                // }
                // Effect: event.status = LOCKED. Sự kiện vẫn hiển thị trong danh sách.
                return { ...e, status: "LOCKED" };
            }
            return e;
        }));
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
                                            checked={selectedIds.length === paginatedEvents.length && paginatedEvents.length > 0}
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
                            {paginatedEvents.map((event) => {
                                const statusStyle = getEventStatusStyles(event.status);
                                const isSelected = selectedIds.includes(event.id);

                                return (
                                    <tr key={event.id} className={`hover:bg-blue-50/30 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
                                        <td className="p-5">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded-md border-gray-300 text-[#0092B8] focus:ring-[#0092B8]/20 cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(event.id)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={event.bannerUrl} alt="" className="w-20 h-12 object-cover rounded-xl shadow-sm" />
                                                <div className="flex flex-col gap-1 max-w-[250px]">
                                                    <span className="font-bold text-gray-800 truncate" title={event.title}>{event.title}</span>
                                                    <span className="text-xs text-gray-500 font-medium truncate">{event.organization}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={13} className="text-gray-400" />
                                                    <span className="font-medium">{new Date(event.startTime).toLocaleDateString("vi-VN")}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={13} className="text-gray-400" />
                                                    <span className="truncate max-w-[150px]" title={event.venue}>{event.venue}</span>
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
                                                {event.statistics.totalRegistered} / {event.capacity}
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
                                                <button onClick={() => handleAttendance(event.id)} className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all" title="Điểm danh">
                                                    <ClipboardList size={16} />
                                                </button>
                                                <button onClick={() => handleViewDetail(event)} className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-xl transition-all" title="Chi tiết">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(event.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Xóa">
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
                        Hiển thị <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, events.length)}</span> trong <span className="font-bold text-gray-800">{events.length}</span> sự kiện
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
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals & Panels */}
            {isDetailOpen && selectedEvent && (
                <EventDetailPanel event={selectedEvent} onClose={() => setIsDetailOpen(false)} />
            )}

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
