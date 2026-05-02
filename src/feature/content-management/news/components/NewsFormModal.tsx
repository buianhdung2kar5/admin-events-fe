import React, { useState } from 'react';
import { FileText, X, ChevronRight, Search, UploadCloud } from 'lucide-react';
import { NewsItem } from '../data/NewsMockData';


interface NewsFormModalProps {
    news?: NewsItem | null;
    onClose: () => void;
    onSave: (data: any) => void;
}

export default function NewsFormModal({ news, onClose, onSave }: NewsFormModalProps) {
    const isEdit = !!news;
    
    const [title, setTitle] = useState(news?.title ?? "");
    const [content, setContent] = useState(news?.content ?? "");
    const [bannerFileId, setBannerFileId] = useState<string>("");
    const [tag, setTag] = useState(news?.tag ?? "");
    const [targetType, setTargetType] = useState<"NONE" | "EVENT">(news?.targetType ?? "NONE");
    const [targetId, setTargetId] = useState<string>(news?.targetId ? String(news?.targetId) : "");
    const [totalRewardCoin, setTotalRewardCoin] = useState<string>(String(news?.totalRewardCoin ?? ""));
    const [rewardPerMinute, setRewardPerMinute] = useState<string>(String(news?.rewardPerMinute ?? ""));
    const [showEventPicker, setShowEventPicker] = useState(false);
    const [eventSearch, setEventSearch] = useState("");
    const [bannerPreview, setBannerPreview] = useState<string | null>(
        news?.banner ? news.banner : null
    );

    const canSubmit = title.trim() && content.trim() && bannerFileId.trim();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Mock upload API: random ID
        const mockNewId = Math.floor(Math.random() * 1000).toString();
        setBannerFileId(mockNewId);
        
        // Local preview
        setBannerPreview(URL.createObjectURL(file));
    };

    const handleSubmit = () => {
        if (!canSubmit) return;
        
        onSave({
            title,
            content,
            bannerFileId: Number(bannerFileId),
            tag,
            targetType,
            targetId: targetType === "EVENT" && targetId ? targetId : null,
            totalRewardCoin: Number(totalRewardCoin) || 0,
            rewardPerMinute: Number(rewardPerMinute) || 0
        });
    };

    const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all";
    const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wide";

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center py-10 px-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <FileText size={20} className="text-[#0092B8]" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-800">{isEdit ? "Chỉnh sửa tin tức" : "Tạo tin tức mới"}</h2>
                            <p className="text-xs text-gray-400">{isEdit ? news.title : "Thêm bài viết mới vào hệ thống"}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Tiêu đề *</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="VD: Công bố kết quả cuộc thi..." className={inputCls} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Nội dung chi tiết *</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} rows={5}
                            placeholder="Nội dung chi tiết..." className={inputCls} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Ảnh Banner *</label>
                        <div className="relative w-full h-40 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors cursor-pointer group">
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageUpload} />
                            {bannerPreview ? (
                                <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400 gap-2">
                                    <UploadCloud size={24} />
                                    <span className="text-xs font-semibold">Nhấn để tải lên ảnh banner</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Tags</label>
                        <input type="text" value={tag} onChange={e => setTag(e.target.value)}
                            placeholder="VD: competition, results" className={inputCls} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Loại đối tượng đính kèm</label>
                            <select value={targetType} onChange={e => setTargetType(e.target.value as "NONE" | "EVENT")} className={inputCls}>
                                <option value="NONE">Không đính kèm (NONE)</option>
                                <option value="EVENT">Sự kiện (EVENT)</option>
                            </select>
                        </div>
                        {targetType === "EVENT" && (
                            <div className="flex flex-col gap-1.5">
                                <label className={labelCls}>Sự kiện đính kèm *</label>
                                <button 
                                    onClick={() => setShowEventPicker(true)}
                                    className={`${inputCls} flex items-center justify-between text-left ${!targetId ? 'text-gray-400' : 'text-gray-800'}`}
                                >
                                    <span className="truncate">
                                        {targetId 
                                            ? (((([] as any[]).find((e: any) => e.id === String(targetId))) as any)?.title || `ID: ${targetId}`)
                                            : "Chọn sự kiện..."}
                                    </span>
                                    <ChevronRight size={16} className="flex-shrink-0" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Tổng số Xu thưởng</label>
                            <input type="number" min={0} value={totalRewardCoin} onChange={e => setTotalRewardCoin(e.target.value)}
                                placeholder="VD: 100000" className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Xu thưởng / phút đọc</label>
                            <input type="number" min={0} value={rewardPerMinute} onChange={e => setRewardPerMinute(e.target.value)}
                                placeholder="VD: 100" className={inputCls} />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-2 mt-2">
                    <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Hủy</button>
                    <button onClick={handleSubmit} disabled={!canSubmit}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        {isEdit ? "Lưu thay đổi" : "Tạo tin tức"}
                    </button>
                </div>
            </div>

            {/* Event Picker Modal */}
            {showEventPicker && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEventPicker(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">Chọn sự kiện</h3>
                            <button onClick={() => setShowEventPicker(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                <X size={16} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={eventSearch}
                                    onChange={e => setEventSearch(e.target.value)}
                                    placeholder="Tìm kiếm sự kiện..." 
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-[#0092B8] rounded-lg text-sm outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto p-2 flex-1">
                            {([] as any[]).filter((e: any) => e.title.toLowerCase().includes(eventSearch.toLowerCase())).map((event: any) => (
                                <button
                                    key={event.id}
                                    onClick={() => {
                                        setTargetId(event.id);
                                        setShowEventPicker(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                        <img src={event.bannerUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="font-semibold text-gray-800 text-sm truncate">{event.title}</span>
                                        <span className="text-xs text-gray-400 truncate">{event.organization}</span>
                                    </div>
                                </button>
                            ))}
                            {([] as any[]).filter((e: any) => e.title.toLowerCase().includes(eventSearch.toLowerCase())).length === 0 && (
                                <div className="p-4 text-center text-sm text-gray-400">Không tìm thấy sự kiện nào</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}
