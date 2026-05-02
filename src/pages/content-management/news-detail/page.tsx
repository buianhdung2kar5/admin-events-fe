import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, User, Coins, Eye, Target, Clock } from 'lucide-react';
import { MockNews, NewsItem } from '../../../feature/content-management/news/data/NewsMockData';


export default function NewsDetailPage() {
    const { newsId } = useParams<{ newsId: string }>();
    const navigate = useNavigate();

    const news = MockNews.find(n => String(n.newsId) === newsId);

    if (!news) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-gray-400 text-lg font-semibold">Không tìm thấy tin tức</p>
                <button onClick={() => navigate(-1)} className="text-[#0092B8] font-semibold flex items-center gap-2">
                    <ArrowLeft size={16} /> Quay lại
                </button>
            </div>
        );
    }

    const linkedEvent: any | undefined = news.targetType === 'EVENT' && news.targetId
        ? ([] as any[]).find((e: any) => String(e.id) === String(news.targetId))
        : undefined;

    const createdDate = new Date(news.createdTime).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-semibold w-fit transition-colors"
            >
                <ArrowLeft size={16} />
                Quay lại danh sách tin tức
            </button>

            {/* Banner */}
            <div className="w-full h-72 rounded-2xl overflow-hidden relative shadow-md">
                <img src={news.banner} alt={news.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {news.isFeatured && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                        📌 Tin nổi bật
                    </span>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-6">
                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 leading-snug">{news.title}</h1>

                {/* Meta grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1 bg-gray-50 rounded-xl p-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><User size={11} />Tác giả</span>
                        <span className="text-sm font-semibold text-gray-700">{news.author}</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-gray-50 rounded-xl p-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Clock size={11} />Ngày đăng</span>
                        <span className="text-sm font-semibold text-gray-700">{createdDate}</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-gray-50 rounded-xl p-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Eye size={11} />Lượt xem</span>
                        <span className="text-sm font-bold text-[#0092B8]">{news.viewCount.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-amber-50 rounded-xl p-4">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1"><Coins size={11} />Tổng xu thưởng</span>
                        <span className="text-sm font-bold text-amber-600">{news.totalRewardCoin > 0 ? `${news.totalRewardCoin.toLocaleString()} xu` : 'Không có'}</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-amber-50 rounded-xl p-4">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1"><Coins size={11} />Xu còn lại</span>
                        <span className="text-sm font-bold text-amber-600">{news.remainingRewardCoin.toLocaleString()} xu</span>
                    </div>
                    <div className="flex flex-col gap-1 bg-amber-50 rounded-xl p-4">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1"><Coins size={11} />Xu / phút đọc</span>
                        <span className="text-sm font-bold text-amber-600">{news.rewardPerMinute > 0 ? `${news.rewardPerMinute} xu/phút` : '—'}</span>
                    </div>
                </div>

                {/* Tags */}
                {news.tag && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <Tag size={13} className="text-gray-400" />
                        {news.tag.split(',').map((t: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-[#0092B8] border border-blue-100 rounded-lg text-xs font-semibold">
                                {t.trim()}
                            </span>
                        ))}
                    </div>
                )}

                {/* Linked event */}
                {linkedEvent && (
                    <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-xl p-4">
                        <Target size={16} className="text-purple-500 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">Sự kiện đính kèm</span>
                            <span className="text-sm font-semibold text-purple-700 truncate">{linkedEvent.title}</span>
                            <span className="text-[11px] text-purple-400">{linkedEvent.organization}</span>
                        </div>
                        <img src={linkedEvent.bannerUrl} alt="" className="w-16 h-12 rounded-lg object-cover ml-auto flex-shrink-0" />
                    </div>
                )}

                {/* Divider */}
                <hr className="border-gray-100" />

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Nội dung</span>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{news.content}</p>
                </div>
            </div>
        </div>
    );
}
