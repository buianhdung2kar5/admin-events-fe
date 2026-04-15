import React from 'react';
import TableData from '../../../../components/TableData';
import { MockNotifs, NotifItem, AudienceData } from '../data/NotifMockData';
import { Trash2, Bell, Users, GraduationCap, Building2, ChevronDown } from 'lucide-react';

const NotifList: React.FC = () => {
    const columns = [
        {
            header: "Thông báo",
            render: (item: NotifItem) => (
                <div className="flex flex-col min-w-0 max-w-[300px]">
                    <span className="font-bold text-gray-800 text-sm truncate">{item.title}</span>
                    <span className="text-[10px] text-gray-400 truncate">{item.description}</span>
                </div>
            )
        },
        {
            header: "Loại",
            render: (item: NotifItem) => {
                const styles = {
                    Warning: "bg-amber-50 text-amber-600 border-amber-100",
                    Info: "bg-blue-50 text-blue-600 border-blue-100",
                    Success: "bg-green-50 text-green-600 border-green-100"
                };
                const labels = { Warning: "Cảnh báo", Info: "Thông tin", Success: "Thành công" };
                return (
                    <span className={`px-2 py-1 border rounded-lg text-[10px] font-bold ${styles[item.type]}`}>
                        {labels[item.type]}
                    </span>
                );
            }
        },
        {
            header: "Đối tượng",
            render: (item: NotifItem) => {
                const icons = { All: <Users size={14} />, Student: <GraduationCap size={14} />, Business: <Building2 size={14} /> };
                const labels = { All: "Tất cả", Student: "Sinh viên", Business: "Doanh nghiệp" };
                return (
                    <div className="flex items-center gap-2 text-gray-500 font-medium text-xs">
                        {icons[item.target]}
                        <span>{labels[item.target]}</span>
                    </div>
                );
            }
        },
        {
            header: "Thời gian",
            render: (item: NotifItem) => (
                <span className="text-xs text-gray-400">{item.time}</span>
            )
        },
        {
            header: "Trạng thái",
            render: (item: NotifItem) => {
                const label = item.status === 'Sent' ? "Đã gửi" : "Lên lịch";
                const style = item.status === 'Sent' ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600";
                return (
                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold ${style}`}>
                        {label}
                    </span>
                );
            }
        },
        {
            header: "Tỉ lệ đọc",
            render: (item: NotifItem) => (
                <div className="flex items-center gap-3 w-32 min-w-[120px]">
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="flex justify-between text-[10px] items-center">
                            <span className="text-gray-400 line-clamp-1">{item.readCount}</span>
                            <span className="font-bold text-gray-700">{item.readRate}%</span>
                        </div>
                        {item.status === 'Sent' ? (
                             <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${item.readRate}%` }}></div>
                             </div>
                        ) : (
                            <span className="text-gray-300">——</span>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: "Xóa",
            render: () => (
                <button className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 size={16} />
                </button>
            )
        }
    ];

    const getAudienceIcon = (iconName: string) => {
        switch (iconName) {
            case "Users": return <Users size={20} />;
            case "GraduationCap": return <GraduationCap size={20} />;
            case "Building2": return <Building2 size={20} />;
            default: return <Users size={20} />;
        }
    }

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Audience Summary Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {AudienceData.map((box, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-all group overflow-hidden relative">
                         <div className={`w-14 h-14 rounded-2xl ${box.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                             {getAudienceIcon(box.icon)}
                         </div>
                         <div className="flex flex-col min-w-0">
                             <div className="flex flex-col">
                                 <h3 className="text-sm font-bold text-gray-800">{box.label}</h3>
                                 <p className="text-2xl font-black text-gray-900 leading-tight">{box.count}</p>
                             </div>
                             <p className="text-[10px] text-gray-400 font-medium truncate mt-1">{box.sub}</p>
                         </div>
                         <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-150 transition-all duration-700 ${box.color.split(' ')[1]}`}>
                             {getAudienceIcon(box.icon)}
                         </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between px-4">
                 <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
                    <span className="text-sm font-bold text-gray-600">Tất cả</span>
                    <ChevronDown size={14} className="text-gray-400" />
                 </div>
                 <span className="text-sm font-bold text-gray-400">5 thông báo</span>
            </div>

            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <TableData 
                    data={MockNotifs} 
                    columns={columns} 
                    className="w-full"
                    title="Lịch sử thông báo"
                    totalCount={MockNotifs.length}
                />
            </div>
        </div>
    );
};

export default NotifList;
