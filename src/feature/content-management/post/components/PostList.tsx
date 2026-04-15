import React, { useState } from 'react';
import TableData from '../../../../components/TableData';
import { MockPosts, PostItem } from '../data/PostMockData';
import { Eye, Trash2, CheckCircle2, XCircle, AlertCircle, Info, Filter } from 'lucide-react';

const PostList: React.FC = () => {
    const [activeTab, setActiveTab] = useState("all");

    const tabs = [
        { id: "all", label: "Tất cả", count: 30 },
        { id: "event", label: "Sự kiện", count: 19 },
        { id: "job", label: "Việc làm", count: 6 },
        { id: "news", label: "Tin tức", count: 5 }
    ];

    const columns = [
        {
            header: "Bài đăng",
            className: "min-w-[400px]",
            render: (item: PostItem) => (
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <img 
                            src={item.thumbnailUrl} 
                            alt="thumb" 
                            className="w-20 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-800 text-sm hover:text-[#0092B8] cursor-pointer transition-colors leading-snug mb-0.5">{item.title}</span>
                        <span className="text-[11px] text-gray-400 line-clamp-1 italic">{item.description}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Loại",
            className: "w-[120px]",
            render: (item: PostItem) => {
                const styles = {
                    Event: "bg-blue-50 text-blue-500 border-blue-100",
                    Job: "bg-purple-50 text-purple-600 border-purple-100",
                    News: "bg-green-50 text-green-600 border-green-100"
                };
                const labels = { Event: "Sự kiện", Job: "Việc làm", News: "Tin tức" };
                return (
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border uppercase tracking-wider whitespace-nowrap ${styles[item.type]}`}>
                        {labels[item.type]}
                    </span>
                );
            }
        },
        {
            header: "Đăng bởi",
            className: "w-[140px]",
            render: (item: PostItem) => (
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border uppercase tracking-wider whitespace-nowrap ${
                    item.authorType === 'Business' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                }`}>
                    {item.authorType === 'Business' ? 'Doanh nghiệp' : 'Sinh viên'}
                </span>
            )
        },
        {
            header: "Tác giả",
            className: "min-w-[180px]",
            render: (item: PostItem) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700">{item.authorName}</span>
                    <span className="text-[11px] text-gray-400 font-medium">{item.authorOrg}</span>
                </div>
            )
        },
        {
            header: "Ngày đăng",
            className: "w-[120px]",
            render: (item: PostItem) => <span className="text-sm text-gray-500 font-medium">{item.date}</span>
        },
        {
            header: "Trạng thái",
            className: "w-[140px]",
            render: (item: PostItem) => {
                const styles = {
                    Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
                    Pending: "bg-amber-50 text-amber-600 border-amber-100",
                    Rejected: "bg-rose-50 text-rose-600 border-rose-100"
                };
                const labels = { Approved: "Đã duyệt", Pending: "Chờ duyệt", Rejected: "Từ chối" };
                return (
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wide whitespace-nowrap ${styles[item.status]}`}>
                        {labels[item.status]}
                    </span>
                );
            }
        },
        {
            header: "Hành động",
            align: 'right' as const,
            className: "w-[150px]",
            render: (item: PostItem) => (
                <div className="flex items-center justify-end gap-1">
                    <button className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-xl transition-all" title="Xem chi tiết">
                        <Eye size={18} />
                    </button>
                    {item.status === 'Pending' && (
                        <>
                            <button className="p-2 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 rounded-xl transition-all" title="Duyệt bài">
                                <CheckCircle2 size={18} />
                            </button>
                            <button className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-xl transition-all" title="Từ chối">
                                <XCircle size={18} />
                            </button>
                        </>
                    )}
                    <button className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-xl transition-all" title="Xóa">
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
         <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

                    <TableData 
                        data={MockPosts} 
                        columns={columns} 
                    className="w-full"
                    title="Danh sách bài đăng"
                        totalCount={MockPosts.length}
                    />
        </div>
    );
};

export default PostList;

