import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Coins, Eye, Target, Clock, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { NewApi, NewsItem } from '../../../services/news-management/NewApi';
import { EventsApi } from '../../../services/events-management/EventsApi';

export default function NewsDetailPage() {
    const { newsId } = useParams<{ newsId: string }>();
    const navigate = useNavigate();

    const { data: newsRes, isLoading, isError } = useQuery({
        queryKey: ['newsDetail', newsId],
        queryFn: () => NewApi.getNewsDetail(Number(newsId)),
        enabled: !!newsId
    });

    const news = newsRes?.object as NewsItem | undefined;

    // Fetch linked event if exists
    const { data: eventRes } = useQuery({
        queryKey: ['eventDetail', news?.targetId],
        queryFn: () => EventsApi.getById(String(news?.targetId)),
        enabled: !!(news?.targetType === 'EVENT' && news?.targetId)
    });

    const linkedEvent = eventRes?.object;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 size={40} className="text-[#0092B8] animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải chi tiết bài viết...</p>
            </div>
        );
    }

    if (isError || !news) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="p-4 bg-red-50 rounded-full">
                    <Eye size={40} className="text-red-400" />
                </div>
                <p className="text-gray-400 text-lg font-bold">Không tìm thấy tin tức hoặc lỗi kết nối</p>
                <button onClick={() => navigate(-1)} className="bg-[#0092B8] text-white px-6 py-2 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <ArrowLeft size={16} /> Quay lại
                </button>
            </div>
        );
    }

    const createdDate = new Date(news.createdTime).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto px-4">
            {/* Header / Back button */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0092B8] font-medium transition-all group"
                >
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-blue-50">
                        <ArrowLeft size={16} />
                    </div>
                    Quay lại danh sách
                </button>
                <div className="flex items-center gap-2 text-[10px] font-medium text-gray-300 uppercase tracking-widest">
                    ID Bài viết: {news.newsId}
                </div>
            </div>

            {/* Banner Section */}
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-gray-100">
                <img src={news.banner} alt={news.title} className="w-full h-full object-cover" onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/1200x800?text=News+Banner';
                }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 text-white flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                         <span className="bg-[#0092B8] text-white text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                            Tin tức hệ thống
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-semibold leading-tight">{news.title}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white rounded-lg p-8 border border-gray-100">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock size={16} />
                                    <span className="text-xs font-medium text-gray-400">{createdDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#0092B8] bg-blue-50 px-4 py-1.5 rounded-full">
                                    <Eye size={16} />
                                    <span className="text-sm font-medium">{news.viewCount.toLocaleString()} lượt xem</span>
                                </div>
                            </div>
                            
                            <div className="prose prose-blue max-w-none">
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap font-normal text-base">
                                    {news.content}
                                </p>
                            </div>

                            {news.tag && (
                                <div className="flex items-center gap-2 flex-wrap mt-6 pt-6 border-t border-gray-50">
                                    <Tag size={16} className="text-gray-400" />
                                    {news.tag.split(',').map((t, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg text-xs font-medium">
                                            #{t.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="flex flex-col gap-6">
                    {/* Rewards Card */}
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg p-6 text-white flex flex-col gap-4">
                        <div className="flex items-center gap-2 opacity-80">
                            <Coins size={20} />
                            <span className="text-[10px] font-medium uppercase tracking-[0.15em] opacity-80">Hệ thống phần thưởng</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-semibold">{news.totalRewardCoin.toLocaleString()}</span>
                            <span className="text-xs font-normal opacity-80">Tổng xu chiến dịch</span>
                        </div>
                        <div className="h-px bg-white/20 w-full" />
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">{news.remainingRewardCoin.toLocaleString()}</span>
                                <span className="text-[10px] font-normal opacity-70 uppercase">Còn lại</span>
                            </div>
                            <div className="bg-white/20 px-3 py-2 rounded-lg text-center">
                                <span className="text-sm font-semibold block">{news.rewardPerMinute}</span>
                                <span className="text-[8px] font-medium uppercase">Xu / phút</span>
                            </div>
                        </div>
                    </div>

                    {/* Linked Event Card */}
                    {news.targetType === 'EVENT' && (
                        <div className="bg-white rounded-lg p-6 border border-gray-100 flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Target size={18} />
                                <span className="text-[10px] font-medium uppercase tracking-wider">Sự kiện đính kèm</span>
                            </div>
                            
                            {linkedEvent ? (
                                <div className="flex flex-col gap-4">
                                    <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-50">
                                        <img src={linkedEvent.bannerUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-medium text-gray-800 text-sm leading-snug line-clamp-2">{linkedEvent.eventTitle}</h3>
                                        <p className="text-[10px] text-gray-400 font-normal">{linkedEvent.organizationName || 'Ban tổ chức'}</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/content-management/events/${news.targetId}`)}
                                        className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg text-xs font-medium transition-all"
                                    >
                                        Xem chi tiết sự kiện
                                    </button>
                                </div>
                            ) : (
                                <div className="py-4 text-center">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                        {news.targetId ? 'Đang tải sự kiện...' : 'Không có sự kiện'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
