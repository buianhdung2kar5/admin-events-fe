import React, { useState, useEffect } from 'react';
import TableData from '../../../../components/TableData';
import { NewsItem } from '../data/NewsMockData';
import { Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import NewsFormModal from './NewsFormModal';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NewApi } from '../../../../services/news-management/NewApi';
import Toast from '../../../../components/common/Toast';

interface NewsListProps {
    filter?: { search?: string; filter1?: string; };
    onTagsLoaded?: (tags: { label: string; value: string }[]) => void;
}

const NewsList: React.FC<NewsListProps> = ({ filter, onTagsLoaded }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 6;

    // Reset page on filter change
    useEffect(() => { setCurrentPage(0); }, [filter?.search, filter?.filter1]);

    const { data: newsResponse, isLoading } = useQuery({
        queryKey: ['news'],
        queryFn: () => NewApi.getAllNews(0, 200, ["createdTime,desc"]),
    });

    const allNews: NewsItem[] = newsResponse?.object?.content || [];

    // Expose unique tags to parent for dynamic dropdown
    useEffect(() => {
        if (!onTagsLoaded || allNews.length === 0) return;
        const tagSet = new Set<string>();
        allNews.forEach(item => {
            if (item.tag) item.tag.split(',').forEach(t => tagSet.add(t.trim()));
        });
        const tagOptions = [
            { label: "Tất cả thẻ", value: "" },
            ...Array.from(tagSet).sort().map(t => ({ label: t, value: t }))
        ];
        onTagsLoaded(tagOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allNews.length]);

    // Client-side filtering
    const filteredNews = allNews.filter((item) => {
        const matchKeyword = !filter?.search || item.title.toLowerCase().includes(filter.search.toLowerCase());
        const matchTag = !filter?.filter1 || (item.tag && item.tag.split(',').map(t => t.trim()).includes(filter.filter1));
        return matchKeyword && matchTag;
    });

    const totalElements = filteredNews.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const newsList = filteredNews.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const handleCreate = () => {
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        setToast({ msg: "Tính năng xóa đang được cập nhật", ok: true });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveSuccess = () => {
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['news'] });
    };

    const columns = [
        {
            header: "Tin tức",
            render: (item: NewsItem) => (
                <div className="flex items-center gap-4 py-1">
                    <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                        <img src={item.banner} alt={item.title} className="w-full h-full object-cover" onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                        }} />
                    </div>
                    <div className="flex flex-col min-w-0 max-w-[350px]">
                        <span className="font-bold text-gray-800 text-sm truncate" title={item.title}>{item.title}</span>
                        <span className="text-[10px] text-gray-400 font-medium">ID: {item.newsId}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Thẻ",
            render: (item: NewsItem) => (
                <div className="flex gap-1 flex-wrap max-w-[150px]">
                    {item.tag ? item.tag.split(',').map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-50 text-[#0092B8] border border-blue-100 rounded text-[10px] font-bold uppercase tracking-wider">
                            {t.trim()}
                        </span>
                    )) : <span className="text-gray-300 text-[10px]">Trống</span>}
                </div>
            )
        },
        {
            header: "Phần thưởng",
            render: (item: NewsItem) => (
                <div className="flex flex-col">
                    <span className="text-xs text-amber-600 font-bold">{item.totalRewardCoin > 0 ? `${item.totalRewardCoin.toLocaleString()} xu` : '0 xu'}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{item.rewardPerMinute} xu/phút</span>
                </div>
            )
        },
        {
            header: "Ngày tạo",
            render: (item: NewsItem) => (
                <span className="text-xs text-gray-500 font-medium">
                    {new Date(item.createdTime).toLocaleDateString('vi-VN')}
                </span>
            )
        },
        {
            header: "Lượt xem",
            render: (item: NewsItem) => (
                <span className="font-bold text-gray-700 text-sm">{item.viewCount.toLocaleString()}</span>
            )
        },
        {
            header: "Hành động",
            align: 'right' as const,
            render: (item: NewsItem) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => navigate(`/content-management/news/${item.newsId}`)}
                        className="p-2 hover:bg-gray-100 text-gray-400 hover:text-blue-500 rounded-lg transition-all"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                        title="Xóa"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Danh sách Tin tức</h2>
                    <p className="text-xs text-gray-400 font-medium">Xem danh sách các bài viết</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-[#0092B8] text-white px-6 py-2.5 rounded-lg hover:bg-[#007a99] transition-all font-bold text-sm"
                >
                    Tạo tin tức mới
                </button>
            </div>

            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                        <div className="w-8 h-8 border-4 border-blue-100 border-t-[#0092B8] rounded-full animate-spin" />
                    </div>
                )}

                <TableData
                    data={newsList}
                    columns={columns}
                    className="w-full border-none shadow-none"
                    title="Tổng số bài viết"
                    totalCount={totalElements}
                />

                {totalPages > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
                        <span className="text-sm text-gray-500 font-medium">
                            Hiển thị{' '}
                            <span className="font-semibold text-gray-800">
                                {newsList.length > 0 ? currentPage * pageSize + 1 : 0}
                            </span>{' '}
                            đến{' '}
                            <span className="font-semibold text-gray-800">
                                {Math.min((currentPage + 1) * pageSize, totalElements)}
                            </span>{' '}
                            trong{' '}
                            <span className="font-semibold text-gray-800">{totalElements}</span>{' '}
                            bài viết
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={currentPage === 0 || totalPages === 0}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                                            currentPage === i
                                            ? 'bg-[#0092B8] text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={currentPage >= totalPages - 1 || totalPages === 0}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <NewsFormModal
                    onClose={() => setIsModalOpen(false)}
                    onSaveSuccess={handleSaveSuccess}
                />
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
    );
};

export default NewsList;
