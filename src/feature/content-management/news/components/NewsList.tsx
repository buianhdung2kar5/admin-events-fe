import React from 'react';
import TableData from '../../../../components/TableData';
import { MockNews, NewsItem } from '../data/NewsMockData';
import { Edit3, Trash2, Eye } from 'lucide-react';
import NewsFormModal from './NewsFormModal';
import { useNavigate } from 'react-router-dom';

const NewsList: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingNews, setEditingNews] = React.useState<NewsItem | null>(null);
    const [newsList, setNewsList] = React.useState(MockNews);

    const handleCreate = () => {
        setEditingNews(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: NewsItem) => {
        setEditingNews(item);
        setIsModalOpen(true);
    };

    const handleSave = (data: any) => {
        console.log("Save news:", data);
        setIsModalOpen(false);
    };

    const columns = [
        {
            header: "Tin tức",
            render: (item: NewsItem) => (
                <div className="flex items-center gap-4 py-1">
                    <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={item.banner} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0 max-w-[280px]">
                        <div className="flex items-center gap-2">
                            {item.isFeatured && <span className="text-red-500"></span>}
                            <span className="font-bold text-gray-800 text-sm truncate">{item.title}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 truncate">{item.date} · {item.author}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Thẻ",
            render: (item: NewsItem) => (
                <div className="flex gap-1 flex-wrap max-w-[150px]">
                    {item.tag.split(',').map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded text-[10px] font-medium">
                            {t.trim()}
                        </span>
                    ))}
                </div>
            )
        },
        {
            header: "Phần thưởng",
            render: (item: NewsItem) => (
                <div className="flex flex-col">
                    <span className="text-xs text-amber-600 font-bold">{item.totalRewardCoin > 0 ? `${item.totalRewardCoin.toLocaleString()} xu` : 'Không có'}</span>
                    {item.rewardPerMinute > 0 && <span className="text-[10px] text-gray-400">{item.rewardPerMinute} xu/phút</span>}
                </div>
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
            render: (item: NewsItem) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(`/content-management/news/${item.newsId}`)}
                        className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#0092B8] transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="Xóa">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-[#0092B8] text-white px-5 py-2.5 rounded-xl hover:bg-[#007a99] transition-colors shadow-sm font-semibold"
                >
                    Tạo tin tức
                </button>
            </div>
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <TableData
                    data={newsList}
                    columns={columns}
                    className="w-full"
                    title="Danh sách tin tức"
                    totalCount={newsList.length}
                />
            </div>
            {isModalOpen && (
                <NewsFormModal
                    news={editingNews}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default NewsList;
