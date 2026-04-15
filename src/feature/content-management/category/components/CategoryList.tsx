import React from 'react';
import TableData from '../../../../components/TableData';
import { MockCategories, CategoryItem } from '../data/CategoryMockData';
import { Edit3, Trash2, Settings2 } from 'lucide-react';

const CategoryList: React.FC = () => {
    const columns = [
        {
            header: "Danh mục",
            render: (item: CategoryItem) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 p-2">
                        <img 
                            src={item.iconUrl} 
                            alt={item.name} 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-800 text-base">{item.name}</span>
                        <span className="text-xs text-gray-400 truncate max-w-[250px]">{item.description}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Slug",
            render: (item: CategoryItem) => (
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-mono border border-gray-100">
                    {item.slug}
                </span>
            )
        },
        {
            header: "Sự kiện",
            render: (item: CategoryItem) => (
                <span className="font-bold text-gray-700">{item.eventCount}</span>
            )
        },
        {
            header: "Options",
            render: (item: CategoryItem) => (
                <div className="flex items-center gap-1.5 text-[#0092B8] hover:underline cursor-pointer transition-all">
                    <Settings2 size={14} />
                    <span className="text-xs font-semibold">{item.optionsCount} options</span>
                </div>
            )
        },
        {
            header: "Trạng thái",
            render: (item: CategoryItem) => (
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    item.status === 'Active' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-gray-50 text-gray-400'
                }`}>
                    {item.status === 'Active' ? 'Hoạt động' : 'Tạm dừng'}
                </span>
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
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <TableData 
                data={MockCategories} 
                columns={columns} 
                className="w-full"
                title="Danh sách danh mục"
                totalCount={MockCategories.length}
            />
        </div>
    );
};

export default CategoryList;
