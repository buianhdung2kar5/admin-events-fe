import React, { useState } from 'react';
import { FileText, X, ChevronRight, Search, UploadCloud, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { EventsApi } from '../../../../services/events-management/EventsApi';
import { UploadService } from '../../../../services/UploadService';
import { NewApi } from '../../../../services/news-management/NewApi';
import Toast from '../../../../components/common/Toast';

interface NewsFormModalProps {
    onClose: () => void;
    onSaveSuccess: () => void;
}

export default function NewsFormModal({ onClose, onSaveSuccess }: NewsFormModalProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [bannerFileId, setBannerFileId] = useState<number | null>(null);
    const [tag, setTag] = useState("");
    const [targetType, setTargetType] = useState<string>("NONE");
    const [targetId, setTargetId] = useState<number | null>(null);
    const [totalRewardCoin, setTotalRewardCoin] = useState<string>("");
    const [rewardPerMinute, setRewardPerMinute] = useState<string>("");

    const [isUploading, setIsUploading] = useState(false);
    const [showEventPicker, setShowEventPicker] = useState(false);
    const [eventSearch, setEventSearch] = useState("");
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    // Load events for picker
    const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
        queryKey: ["eventsForPicker", eventSearch],
        queryFn: () => EventsApi.getAll(0, 50),
        enabled: showEventPicker
    });

    const events = eventsData?.object?.content || [];

    const createMutation = useMutation({
        mutationFn: (data: any) => NewApi.createNews(data),
        onSuccess: (res) => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                onSaveSuccess();
            } else {
                setToast({ msg: res.message || "Đã có lỗi xảy ra", ok: false });
            }
        },
        onError: (err: any) => {
            setToast({ msg: err.message || "Lỗi kết nối server", ok: false });
        }
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setBannerPreview(URL.createObjectURL(file));

        try {
            const res = await UploadService.uploadImage(file, "NEWS_BANNER");
            if (res.statusCode === 200 && res.object) {
                setBannerFileId(res.object.fileId);
            } else {
                setToast({ msg: "Upload ảnh thất bại", ok: false });
            }
        } catch (error) {
            setToast({ msg: "Lỗi khi upload ảnh", ok: false });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) {
            setToast({ msg: "Vui lòng điền đầy đủ tiêu đề và nội dung", ok: false });
            return;
        }
        if (!bannerFileId) {
            setToast({ msg: "Vui lòng tải lên ảnh banner", ok: false });
            return;
        }

        createMutation.mutate({
            title: title.trim(),
            content: content.trim(),
            bannerId: bannerFileId,
            tag: tag.trim(),
            targetType,
            targetId: targetType === "EVENT" ? targetId : null,
            totalRewardCoin: Number(totalRewardCoin) || 0,
            rewardPerMinute: Number(rewardPerMinute) || 0
        });
    };

    const isPending = createMutation.isPending || isUploading;

    const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all disabled:bg-gray-50";
    const labelCls = "text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block";

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center py-10 px-4">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-lg w-full max-w-3xl p-8 flex flex-col gap-6 border border-gray-100">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <FileText size={24} className="text-[#0092B8]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Tạo bài viết mới</h2>
                                <p className="text-xs text-gray-400 font-medium">Đăng nội dung mới lên ứng dụng</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className={labelCls}>Tiêu đề bài viết *</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề hấp dẫn..."
                                    className={inputCls}
                                    disabled={isPending}
                                />
                            </div>

                            <div>
                                <label className={labelCls}>Nội dung chi tiết *</label>
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    rows={8}
                                    placeholder="Nội dung chính của bài viết..."
                                    className={`${inputCls} resize-none`}
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className={labelCls}>Ảnh Banner *</label>
                                <div className="relative w-full h-44 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-all cursor-pointer group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={handleImageUpload}
                                        disabled={isPending}
                                    />
                                    {bannerPreview ? (
                                        <>
                                            <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <Loader2 size={24} className="text-white animate-spin" />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400 gap-2">
                                            <div className="p-3 bg-white rounded-lg group-hover:scale-110 transition-transform">
                                                <UploadCloud size={24} className="text-[#0092B8]" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Tải lên ảnh 16:9</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Loại đính kèm</label>
                                    <select
                                        value={targetType}
                                        onChange={e => setTargetType(e.target.value)}
                                        className={inputCls}
                                        disabled={isPending}
                                    >
                                        <option value="NONE">Không có</option>
                                        <option value="EVENT">Sự kiện</option>
                                        <option value="PACKAGE">Gói quà</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Gắn Thẻ (Tags)</label>
                                    <input
                                        type="text"
                                        value={tag}
                                        onChange={e => setTag(e.target.value)}
                                        placeholder="Tag1, Tag2..."
                                        className={inputCls}
                                        disabled={isPending}
                                    />
                                </div>
                            </div>

                            {targetType === "EVENT" && (
                                <div>
                                    <label className={labelCls}>Chọn Sự kiện đính kèm *</label>
                                    <button
                                        onClick={() => setShowEventPicker(true)}
                                        disabled={isPending}
                                        className={`${inputCls} flex items-center justify-between text-left ${!targetId ? 'text-gray-400' : 'text-gray-800'}`}
                                    >
                                        <span className="truncate font-medium">
                                            {targetId
                                                ? (events.find((e: any) => e.eventId === targetId)?.eventTitle || `ID: ${targetId}`)
                                                : "Tìm và chọn sự kiện..."}
                                        </span>
                                        <ChevronRight size={16} className="flex-shrink-0" />
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Tổng xu thưởng</label>
                                    <input
                                        type="number"
                                        value={totalRewardCoin}
                                        onChange={e => setTotalRewardCoin(e.target.value)}
                                        placeholder="0"
                                        className={inputCls}
                                        disabled={isPending}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Xu / phút đọc</label>
                                    <input
                                        type="number"
                                        value={rewardPerMinute}
                                        onChange={e => setRewardPerMinute(e.target.value)}
                                        placeholder="0"
                                        className={inputCls}
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 py-3.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isPending || !bannerFileId}
                            className="flex-1 py-3.5 rounded-lg text-sm font-bold text-white bg-[#0092B8] hover:bg-[#007a99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isPending && <Loader2 size={18} className="animate-spin" />}
                            Đăng bài ngay
                        </button>
                    </div>
                </div>

                {/* Event Picker Modal */}
                {showEventPicker && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEventPicker(false)} />
                        <div className="relative bg-white rounded-lg w-full max-w-lg flex flex-col max-h-[70vh] border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                <h3 className="font-black text-gray-800 tracking-tight">Chọn sự kiện đính kèm</h3>
                                <button onClick={() => setShowEventPicker(false)} className="p-1.5 hover:bg-white rounded-lg transition-all">
                                    <X size={16} className="text-gray-400" />
                                </button>
                            </div>
                            <div className="p-4 border-b border-gray-50">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={eventSearch}
                                        onChange={e => setEventSearch(e.target.value)}
                                        placeholder="Tìm tên hoặc ID sự kiện..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-[#0092B8] rounded-lg text-sm outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="overflow-y-auto p-2 flex-1 scrollbar-hide">
                                {isLoadingEvents ? (
                                    <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
                                        <Loader2 size={32} className="animate-spin" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Đang tìm kiếm...</span>
                                    </div>
                                ) : (
                                    <>
                                        {events.map((event: any) => (
                                            <button
                                                key={event.eventId}
                                                onClick={() => {
                                                    setTargetId(event.eventId);
                                                    setShowEventPicker(false);
                                                }}
                                                className="w-full text-left p-3 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-4 group"
                                            >
                                                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100 group-hover:scale-105 transition-transform">
                                                    <img src={event.bannerUrl} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                    <span className="font-bold text-gray-800 text-sm truncate">{event.eventTitle}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID: {event.eventId}</span>
                                                </div>
                                            </button>
                                        ))}
                                        {events.length === 0 && (
                                            <div className="py-20 text-center text-sm text-gray-400 font-medium">Không tìm thấy sự kiện nào</div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {toast && (
                    <Toast
                        toast={{
                            msg: toast.msg,
                            ok: toast.ok
                        }}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </div>
    );
}
