import { useState } from "react";
import { X, Calendar, Hash, Image as ImageIcon } from "lucide-react";
import { FeaturedItem, MockFeatured } from "../data/FeaturedMockData";


interface Props {
    featuredEvent: FeaturedItem | null;
    mode: "create" | "edit";
    onClose: () => void;
}

export default function FeaturedFormModal({ featuredEvent, mode, onClose }: Props) {
    const [selectedEventId, setSelectedEventId] = useState(featuredEvent?.eventId || "");
    const [priority, setPriority] = useState(featuredEvent?.priority || 1);
    const [startDate, setStartDate] = useState(featuredEvent?.startDate ? new Date(featuredEvent.startDate).toISOString().slice(0, 16) : "");
    const [endDate, setEndDate] = useState(featuredEvent?.endDate ? new Date(featuredEvent.endDate).toISOString().slice(0, 16) : "");

    const selectedEventObj: any = ([] as any[]).find((e: any) => e.id === selectedEventId);

    const handleSave = () => {
        // In a real app, we'd validate and save via API
        onClose();
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
                    {/* Event Selection */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Chọn sự kiện <span className="text-red-500">*</span>
                        </label>
                        <select 
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            disabled={mode === "edit"} // Usually you don't change the event once created, just dates
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all bg-white font-medium disabled:bg-gray-50 disabled:text-gray-500"
                        >
                            <option value="" disabled>-- Chọn một sự kiện --</option>
                            {([] as any[]).filter((e: any) => e.status === "PUBLISHED" && (e.id === featuredEvent?.eventId || !MockFeatured.some(f => f.eventId === e.id))).map((event: any) => (
                                <option key={event.id} value={event.id}>{event.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Event Preview */}
                    {selectedEventObj && (
                        <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                            {selectedEventObj.bannerUrl ? (
                                <img src={selectedEventObj.bannerUrl} alt="Banner" className="w-24 h-16 object-cover rounded-lg shadow-sm border border-gray-200" />
                            ) : (
                                <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                    <ImageIcon size={20} />
                                </div>
                            )}
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-gray-800 line-clamp-1">{selectedEventObj.title}</span>
                                <span className="text-xs font-medium text-gray-500">{selectedEventObj.organization}</span>
                                <span className="text-[10px] text-gray-400 mt-1 inline-flex bg-gray-100 px-2 py-0.5 rounded-md w-fit">
                                    ID: {selectedEventObj.id}
                                </span>
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
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200/50 border border-transparent transition-colors">
                        Hủy
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={!selectedEventId || !startDate || !endDate}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mode === "create" ? "Thêm nổi bật" : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
}
