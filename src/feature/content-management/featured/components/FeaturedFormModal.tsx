import { useState } from "react";
import { X, Calendar, Hash, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { FeaturedEventData } from "../data/FeaturedMockData";
import { EventsApi } from "../../../../services/events-management/EventsApi";
import { FeaturedApi } from "../../../../services/events-management/FeaturedEventsApi";

interface Props {
    featuredEvent: FeaturedEventData | null;
    mode: "create" | "edit";
    onClose: () => void;
    onSuccess: () => void;
}

export default function FeaturedFormModal({ featuredEvent, mode, onClose, onSuccess }: Props) {
    const [selectedEventId, setSelectedEventId] = useState<number | "">(featuredEvent?.eventId || "");
    const [priority, setPriority] = useState(featuredEvent?.priority || 1);
    const [startDate, setStartDate] = useState(featuredEvent?.startDate ? new Date(featuredEvent.startDate).toISOString().slice(0, 16) : "");
    const [endDate, setEndDate] = useState(featuredEvent?.endDate ? new Date(featuredEvent.endDate).toISOString().slice(0, 16) : "");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Only load events if we are creating
    const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
        queryKey: ["allEventsForSelect"],
        queryFn: async () => {
            const res = await EventsApi.getAll(0, 100);
            return res.object?.content || [];
        },
        enabled: mode === "create"
    });

    const eventsList = eventsData || [];

    const handleSave = async () => {
        try {
            setErrorMsg("");
            setIsSaving(true);
            
            if (!startDate || !endDate) {
                setErrorMsg("Vui lòng chọn thời gian bắt đầu và kết thúc.");
                setIsSaving(false);
                return;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start >= end) {
                setErrorMsg("Thời gian bắt đầu phải trước thời gian kết thúc.");
                setIsSaving(false);
                return;
            }

            if (mode === "create") {
                if (!selectedEventId) {
                    setErrorMsg("Vui lòng chọn một sự kiện.");
                    setIsSaving(false);
                    return;
                }
                const res = await FeaturedApi.createFeaturedEvent(Number(selectedEventId), priority, start, end);
                if (res.statusCode === 200 || res.statusCode === 201) {
                    onSuccess();
                } else {
                    setErrorMsg(res.message || "Tạo sự kiện nổi bật thất bại.");
                }
            } else if (mode === "edit" && featuredEvent) {
                const res = await FeaturedApi.updateFeaturedEvent(featuredEvent.featuredEventId, priority, start, end);
                if (res.statusCode === 200 || res.statusCode === 201) {
                    onSuccess();
                } else {
                    setErrorMsg(res.message || "Cập nhật sự kiện nổi bật thất bại.");
                }
            }
        } catch (error: any) {
            setErrorMsg(error.message || "Đã xảy ra lỗi hệ thống.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-bold text-gray-800">
                            {mode === "create" ? "Thêm Sự kiện nổi bật" : "Cập nhật Sự kiện nổi bật"}
                        </h2>
                        <p className="text-xs text-gray-500">
                            Cấu hình thời gian hiển thị và thứ tự ưu tiên trên trang chủ
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 custom-scrollbar">
                    
                    {errorMsg && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
                            <AlertCircle size={16} />
                            {errorMsg}
                        </div>
                    )}

                    {/* Event Selection */}
                    {mode === "create" ? (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                Chọn sự kiện <span className="text-red-500">*</span>
                            </label>
                            <select 
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all bg-white font-medium"
                            >
                                <option value="" disabled>
                                    {isLoadingEvents ? "Đang tải danh sách sự kiện..." : "-- Chọn một sự kiện --"}
                                </option>
                                {eventsList.map((event: any) => (
                                    <option key={event.eventId} value={event.eventId}>{event.title}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                Sự kiện đang chọn
                            </label>
                            <div className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-700">
                                {featuredEvent?.eventTitle || `ID Sự kiện: ${featuredEvent?.eventId}`}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1.5"><Calendar size={14}/> Bắt đầu hiển thị <span className="text-red-500">*</span></label>
                            <input 
                                type="datetime-local" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all text-gray-700" 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1.5"><Calendar size={14}/> Kết thúc hiển thị <span className="text-red-500">*</span></label>
                            <input 
                                type="datetime-local" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all text-gray-700" 
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1.5"><Hash size={14}/> Thứ tự ưu tiên (Priority) <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="number" 
                                min={1}
                                value={priority}
                                onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                                className="w-24 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all text-center font-bold" 
                            />
                            <span className="text-xs text-gray-500">Số nhỏ hơn sẽ hiển thị trước. Ví dụ: Priority 1 sẽ nằm vị trí đầu tiên.</span>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button onClick={onClose} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200/50 border border-transparent transition-colors disabled:opacity-50">
                        Hủy
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving || (mode === "create" && !selectedEventId) || !startDate || !endDate}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {mode === "create" ? "Thêm nổi bật" : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
}
