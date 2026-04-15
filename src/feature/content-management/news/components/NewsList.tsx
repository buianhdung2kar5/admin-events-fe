import React from 'react';
import TableData from '../../../../components/TableData';
import { MockNews, NewsItem } from '../data/NewsMockData';
import { Edit3, Trash2, Eye, FileText, CheckCircle2, Clock } from 'lucide-react';

const NewsList: React.FC = () => {
    const columns = [
        {
            header: "Tin tức",
            render: (item: NewsItem) => (
                <div className="flex items-center gap-4 py-1">
                    <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 relative">
                        <img 
                            src={item.thumbnailUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col min-w-0 max-w-[300px]">
                        <div className="flex items-center gap-2">
                           {item.isFeatured && <span className="text-red-500">📌</span>}
                           <span className="font-bold text-gray-800 text-sm truncate">{item.title}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 truncate">{item.description}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Danh mục",
            render: (item: NewsItem) => (
                <span className="px-3 py-1 bg-white text-gray-400 border border-gray-100 rounded-lg text-xs font-semibold">
                    {item.category}
                </span>
            )
        },
        {
            header: "Tác giả",
            render: (item: NewsItem) => (
                <span className="text-xs text-gray-700 font-medium">{item.author}</span>
            )
        },
        {
            header: "Ngày",
            render: (item: NewsItem) => (
                <span className="text-xs text-gray-400">{item.date}</span>
            )
        },
        {
            header: "Trạng thái",
            render: (item: NewsItem) => {
                const styles = {
                    Published: "bg-green-50 text-green-600",
                    Pending: "bg-amber-50 text-amber-600"
                };
                const labels = { Published: "Đã đăng", Pending: "Chờ duyệt" };
                return (
                    <div className="flex items-center gap-2">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-bold ${styles[item.status]}`}>
                            {labels[item.status]}
                        </span>
                    </div>
                );
            }
        },
        {
            header: "Lượt xem",
            render: (item: NewsItem) => (
                <span className="font-bold text-gray-700 text-sm">{item.views.toLocaleString()}</span>
            )
        },
        {
            header: "Hành động",
            render: (item: NewsItem) => (
                <div className="flex items-center gap-2">
                     <button className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                        <Eye size={16} />
                    </button>
                    {item.status === 'Pending' && (
                        <button className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition-colors">
                            <CheckCircle2 size={16} />
                        </button>
                    )}
                    <button className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-[#0092B8] rounded-lg transition-colors">
                        <Edit3 size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <TableData 
                data={MockNews} 
                columns={columns} 
                className="w-full"
                title="Danh sách tin tức"
                totalCount={MockNews.length}
            />
        </div>
    );
};

export default NewsList;
