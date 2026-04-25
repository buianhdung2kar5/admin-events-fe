import { useState } from "react";
import { X, Upload, Calendar, MapPin, Users, DollarSign, Award, Trophy, Briefcase, FileText, Layout } from "lucide-react";
import { EventItem, MockCategories } from "../data/EventMockData";

interface Props {
    event: EventItem | null;
    mode: "create" | "edit";
    onClose: () => void;
}

export default function EventFormModal({ event, mode, onClose }: Props) {
    const [activeTab, setActiveTab] = useState<"basic" | "time-venue" | "benefits">("basic");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        event?.categories.map(c => c.id) || []
    );

    const toggleCategory = (id: string) => {
        setSelectedCategories(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-bold text-gray-800">
                            {mode === "create" ? "Tạo sự kiện mới" : "Chỉnh sửa sự kiện"}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {mode === "create" ? "Điền đầy đủ thông tin để tạo sự kiện mới trên hệ thống" : "Cập nhật thông tin cho sự kiện đã chọn"}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-56 bg-gray-50 border-r border-gray-100 flex flex-col p-4 gap-2">
                        <button
                            onClick={() => setActiveTab("basic")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                activeTab === "basic" ? 'bg-[#0092B8] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'
                            }`}
                        >
                            <FileText size={16} /> Thông tin cơ bản
                        </button>
                        <button
                            onClick={() => setActiveTab("time-venue")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                activeTab === "time-venue" ? 'bg-[#0092B8] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'
                            }`}
                        >
                            <MapPin size={16} /> Thời gian & Địa điểm
                        </button>
                        <button
                            onClick={() => setActiveTab("benefits")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                activeTab === "benefits" ? 'bg-[#0092B8] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'
                            }`}
                        >
                            <Award size={16} /> Quyền lợi & Yêu cầu
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                        <div className="max-w-2xl mx-auto flex flex-col gap-6">
                            
                            {activeTab === "basic" && (
                                <div className="flex flex-col gap-5 animate-[fadeIn_0.3s_ease]">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Tên sự kiện <span className="text-red-500">*</span></label>
                                        <input type="text" defaultValue={event?.title} placeholder="Nhập tên sự kiện..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all" />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Banner sự kiện <span className="text-red-500">*</span></label>
                                        <div className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden group">
                                            {event?.bannerUrl ? (
                                                <>
                                                    <img src={event.bannerUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white font-semibold flex items-center gap-2"><Upload size={16}/> Thay đổi ảnh</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={24} className="text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-500">Kéo thả hoặc click để tải ảnh lên</span>
                                                    <span className="text-xs text-gray-400">Tỉ lệ khuyến nghị 16:9 (1920x1080px)</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Mô tả sự kiện <span className="text-red-500">*</span></label>
                                        <textarea rows={5} defaultValue={event?.description} placeholder="Nhập mô tả chi tiết..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all resize-none" />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2"><Layout size={14}/> Danh mục (Thể loại) <span className="text-red-500">*</span></label>
                                        <div className="flex flex-wrap gap-2">
                                            {MockCategories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => toggleCategory(cat.id)}
                                                    className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${
                                                        selectedCategories.includes(cat.id)
                                                        ? 'bg-blue-50 border-blue-200 text-[#0092B8]'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "time-venue" && (
                                <div className="flex flex-col gap-5 animate-[fadeIn_0.3s_ease]">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2"><MapPin size={14} /> Địa điểm tổ chức <span className="text-red-500">*</span></label>
                                        <input type="text" defaultValue={event?.venue} placeholder="Nhập địa điểm..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all" />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2"><Users size={14} /> Sức chứa (Số lượng tối đa) <span className="text-red-500">*</span></label>
                                        <input type="number" defaultValue={event?.capacity} placeholder="VD: 500" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2"><Calendar size={14} /> Mở form đăng ký <span className="text-red-500">*</span></label>
                                            <input type="datetime-local" defaultValue={event?.registerOpenTime ? new Date(event.registerOpenTime).toISOString().slice(0,16) : ''} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all text-gray-600" />
                                        </div>
                                        <div></div> {/* Empty column for alignment */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2"><Calendar size={14} /> Bắt đầu sự kiện <span className="text-red-500">*</span></label>
                                            <input type="datetime-local" defaultValue={event?.startTime ? new Date(event.startTime).toISOString().slice(0,16) : ''} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all text-gray-600" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2"><Calendar size={14} /> Kết thúc sự kiện <span className="text-red-500">*</span></label>
                                            <input type="datetime-local" defaultValue={event?.endTime ? new Date(event.endTime).toISOString().slice(0,16) : ''} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all text-gray-600" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "benefits" && (
                                <div className="flex flex-col gap-5 animate-[fadeIn_0.3s_ease]">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2"><DollarSign size={14} /> Giá vé (VNĐ) <span className="text-red-500">*</span></label>
                                            <input type="number" defaultValue={event?.price} placeholder="0 cho miễn phí" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2"><Briefcase size={14} /> Tuyển dụng</label>
                                            <select defaultValue={event?.recruitmentType || "None"} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all bg-white text-gray-600">
                                                <option value="None">Không có</option>
                                                <option value="CTV">Cộng tác viên (CTV)</option>
                                                <option value="Volunteer">Tình nguyện viên</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2"><Award size={14} /> Reward Coin</label>
                                            <input type="number" defaultValue={event?.rewardCoin} placeholder="Số Coin nhận được..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2"><Trophy size={14} /> Điểm rèn luyện</label>
                                            <input type="number" defaultValue={event?.youthUnionPoint} placeholder="Số ĐRL nhận được..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 mt-2 pt-5 border-t border-gray-100">
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2"><FileText size={14} /> Tên chứng nhận tham gia (Nếu có)</label>
                                        <input type="text" defaultValue={event?.certificateName} placeholder="VD: Chứng nhận tham gia NEU Business Summit..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all" />
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200/50 border border-transparent transition-colors">
                        Hủy
                    </button>
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] transition-colors shadow-sm">
                        {mode === "create" ? "Lưu sự kiện" : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
}
