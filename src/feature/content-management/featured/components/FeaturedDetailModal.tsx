import React from 'react';
import { X, Calendar, Hash, Target, Clock, ExternalLink } from 'lucide-react';
import { FeaturedItem } from '../data/FeaturedMockData';

interface FeaturedDetailModalProps {
    featuredEvent: FeaturedItem;
    onClose: () => void;
}

export default function FeaturedDetailModal({ featuredEvent, onClose }: FeaturedDetailModalProps) {
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
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center py-10 px-4">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                    {/* Banner */}
                    <div className="relative w-full h-52 bg-gray-100 flex-shrink-0">
                        <img
                            src={featuredEvent.thumbnailUrl}
                            alt={featuredEvent.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-2 bg-black/30 hover:bg-black/50 text-white rounded-xl transition-colors backdrop-blur-sm"
                        >
                            <X size={18} />
                        </button>
                        
                        {/* Status badge overlaid on image */}
                        <div className={`absolute bottom-4 left-6 px-3 py-1.5 rounded-full border text-[11px] font-bold tracking-wide uppercase shadow-sm ${getStatusStyle(featuredEvent.status)} bg-white/90 backdrop-blur-md`}>
                            {getStatusLabel(featuredEvent.status)}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-6 p-6">
                        {/* Title and Organization */}
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold text-gray-900 leading-snug">{featuredEvent.title}</h2>
                            <span className="text-sm font-semibold text-gray-500">{featuredEvent.organization}</span>
                        </div>

                        {/* Event Link info */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                            <Target size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">ID Sự kiện gốc:</span>
                            <span className="text-sm font-bold text-[#0092B8] bg-blue-50 px-2 py-0.5 rounded-md">{featuredEvent.eventId}</span>
                        </div>

                        {/* Meta Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                                    <Hash size={14} /> Thứ tự ưu tiên
                                </span>
                                <span className="text-2xl font-bold text-[#0092B8]">#{featuredEvent.priority}</span>
                            </div>
                            
                            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                                    <ExternalLink size={14} /> Lượt tương tác
                                </span>
                                <div className="flex items-end gap-1">
                                    <span className="text-2xl font-bold text-gray-800">{featuredEvent.clicks.toLocaleString()}</span>
                                    <span className="text-sm font-medium text-gray-500 mb-1">clicks</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl col-span-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                                    <Clock size={14} /> Lịch hiển thị
                                </span>
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                        <span className="w-16 font-semibold text-gray-500">Bắt đầu:</span>
                                        <span className="font-bold text-gray-800">{new Date(featuredEvent.startDate).toLocaleString("vi-VN")}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                        <span className="w-16 font-semibold text-gray-500">Kết thúc:</span>
                                        <span className="font-bold text-gray-800">{new Date(featuredEvent.endDate).toLocaleString("vi-VN")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
