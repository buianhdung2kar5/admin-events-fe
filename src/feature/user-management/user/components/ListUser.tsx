import React from 'react';
import { 
    Users, PencilLine, Shield, Trash2
} from 'lucide-react';
import { MockUsers, getRoleDetails } from '../data/UserMockData';
import TableData, { Column } from '../../../../components/TableData';

export default function ListUser() {
    const columns: Column<any>[] = [
        {
            header: "Người dùng",
            render: (user) => (
                <div className="flex items-center gap-3">
                    <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    />
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-800 truncate leading-tight">
                            {user.name}
                        </span>
                        <span className="text-xs text-gray-400 truncate">
                            {user.email}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Vai trò",
            render: (user) => {
                const role = getRoleDetails(user.role);
                return (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap ${role.color}`}>
                        {role.icon}
                        {role.label}
                    </div>
                );
            }
        },
        {
            header: "Trường/Tổ chức",
            render: (user) => (
                <span className="text-sm text-gray-600 font-medium max-w-[200px] truncate block">
                    {user.organization || '-'}
                </span>
            )
        },
        {
            header: "Trạng thái",
            align: "center" as const,
            render: (user) => (
                user.status === "Active" ? (
                    <span className="inline-block px-4 py-1.5 bg-[#4BBDD3] text-white text-[10px] font-bold rounded-xl shadow-sm whitespace-nowrap">
                        Hoạt động
                    </span>
                ) : (
                    <span className="inline-block px-4 py-1.5 bg-red-500 text-white text-[10px] font-bold rounded-xl whitespace-nowrap">
                        Bị khóa
                    </span>
                )
            )
        },
        {
            header: "Sự kiện",
            align: "center" as const,
            render: (user) => (
                <span className="text-sm font-bold text-gray-600">
                    {user.eventCount}
                </span>
            )
        },
        {
            header: "Ngày tham gia",
            render: (user) => (
                <span className="text-sm text-gray-400 font-medium">
                    {new Date(user.joinedDate).toLocaleDateString('vi-VN')}
                </span>
            )
        },
        {
            header: "Hành động",
            align: "center" as const,
            render: () => (
                <div className="flex items-center justify-center gap-3">
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <PencilLine size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-lg transition-all">
                        <Shield size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <TableData
            title="Danh sách người dùng"
            totalCount={MockUsers.length}
            subtitle="Quản lý tất cả người dùng trong hệ thống"
            icon={<Users className="text-blue-500" size={20} />}
            data={MockUsers}
            columns={columns}
            onViewAll={() => console.log("View all users")}
        />
    );
}
