import React from 'react';
import TableData from '../../../../components/TableData';
import { MockFeatured, FeaturedItem } from '../data/FeaturedMockData';
import { Edit3, Trash2, ChevronUp, ChevronDown, Clock, Star } from 'lucide-react';

const FeaturedList: React.FC = () => {
    const columns = [
        {
            header: "Thứ tự",
            render: (item: FeaturedItem) => (
                <div className="flex flex-col items-center gap-1">
                    <button className="text-gray-300 hover:text-[#0092B8] transition-colors">
                        <ChevronUp size={16} />
                    </button>
                    <span className="font-bold text-[#0092B8] text-lg leading-none">{item.order}</span>
                    <button className="text-gray-300 hover:text-[#0092B8] transition-colors">
                        <ChevronDown size={16} />
                    </button>
                </div>
            )
        },
        {
            header: "Sự kiện",
            render: (item: FeaturedItem) => (
                <div className="flex items-center gap-4 py-1">
                    <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <img 
                            src={item.thumbnailUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-800 text-sm">{item.title}</span>
                        <span className="text-[10px] text-gray-400 truncate">{item.organization}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Thời gian hiển thị",
            render: (item: FeaturedItem) => (
                <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={14} />
                    <span className="text-[11px] font-medium">{item.startTime} → {item.endTime}</span>
                </div>
            )
        },
        {
            header: "Trạng thái",
            render: (item: FeaturedItem) => {
                const styles = {
                    Displaying: "bg-green-50 text-green-600",
                    Scheduled: "bg-blue-50 text-blue-600",
                    Expired: "bg-gray-50 text-gray-400"
                };
                const labels = { Displaying: "Đang hiển thị", Scheduled: "Lên lịch", Expired: "Hết hạn" };
                return (
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${styles[item.status]}`}>
                        {labels[item.status]}
                    </span>
                );
            }
        },
        {
            header: "Lượt click",
            render: (item: FeaturedItem) => (
                <span className="font-bold text-gray-700 text-sm">{item.clicks.toLocaleString()}</span>
            )
        },
        {
            header: "Hành động",
            render: () => (
                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-[#0092B8] rounded-lg transition-colors">
                        <Edit3 size={18} />
                    </button>
                    <button className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <TableData 
                data={MockFeatured} 
                columns={columns} 
                className="w-full"
                title="Danh sách sự kiện nổi bật"
                totalCount={MockFeatured.length}
            />
        </div>
    );
};

export default FeaturedList;
