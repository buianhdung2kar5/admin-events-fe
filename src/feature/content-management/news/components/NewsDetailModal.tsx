import React from 'react';
import { X, Tag, Calendar, User, Coins } from 'lucide-react';
import { NewsItem } from '../data/NewsMockData';

interface NewsDetailModalProps {
    news: NewsItem;
    onClose: () => void;
}

export default function NewsDetailModal({ news, onClose }: NewsDetailModalProps) {
    const bannerSrc = news.banner || `https://picsum.photos/seed/${news.newsId}/1200/500`;

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center py-10 px-4">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
                    {/* Banner */}
                    <div className="relative w-full h-52 bg-gray-100 flex-shrink-0">
                        <img
                            src={bannerSrc}
                            alt={news.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-2 bg-black/30 hover:bg-black/50 text-white rounded-xl transition-colors backdrop-blur-sm"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-4 p-6">
                        {/* Title */}
                        <h2 className="text-xl font-bold text-gray-900 leading-snug">{news.title}</h2>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <User size={12} />
                                <span>{news.author}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={12} />
                                <span>{news.date}</span>
                            </div>
                            {news.totalRewardCoin > 0 && (
                                <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
                                    <Coins size={12} />
                                    <span>{news.totalRewardCoin.toLocaleString()} xu</span>
                                </div>
                            )}
                            {news.isFeatured && (
                                <span className="text-red-500 font-semibold">📌 Nổi bật</span>
                            )}
                        </div>

                        {/* Tags */}
                        {news.tag && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <Tag size={12} className="text-gray-400" />
                                {news.tag.split(',').map((t, idx) => (
                                    <span key={idx} className="px-2.5 py-1 bg-blue-50 text-[#0092B8] border border-blue-100 rounded-lg text-[11px] font-semibold">
                                        {t.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Divider */}
                        <hr className="border-gray-100" />

                        {/* Body content */}
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                            {news.content}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
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
