import React from 'react';
import { 
    Building2, Eye, PencilLine, Trash2, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { MockOrganizations, getOrgTypeStyles } from '../data/OrgMockData';
import TableData, { Column } from '../../../../components/TableData';

export default function OrgList() {
    const columns: Column<any>[] = [
        {
            header: "Tổ chức",
            render: (org) => (
                <div className="flex items-center gap-3">
                    <img 
                        src={org.logoUrl} 
                        alt={org.name} 
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                    />
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-gray-800 truncate leading-tight max-w-[150px] block">
                                {org.name}
                            </span>
                            {org.isVerified && <CheckCircle2 size={14} className="text-blue-400 fill-blue-50" />}
                        </div>
                        <span className="text-xs text-gray-400 truncate">
                            {org.email}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Loại",
            render: (org) => {
                const typeStyle = getOrgTypeStyles(org.type);
                return (
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap ${typeStyle.color}`}>
                        {typeStyle.label}
                    </div>
                );
            }
        },
        {
            header: "Trường / Đơn vị",
            render: (org) => (
                <span className="text-sm text-gray-500 font-medium truncate max-w-[200px] block">
                    {org.unit}
                </span>
            )
        },
        {
            header: "Sự kiện",
            align: "center" as const,
            render: (org) => (
                <span className="text-sm font-bold text-gray-600">
                    {org.eventCount}
                </span>
            )
        },
        {
            header: "Thành viên",
            align: "center" as const,
            render: (org) => (
                <span className="text-sm font-bold text-gray-600">
                    {org.memberCount}
                </span>
            )
        },
        {
            header: "Trạng thái",
            align: "center" as const,
            render: (org) => (
                org.status === "Active" ? (
                    <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-xl whitespace-nowrap">
                        Hoạt động
                    </span>
                ) : (
                    <span className="inline-block px-4 py-1.5 bg-red-50 text-red-500 text-[10px] font-bold rounded-xl whitespace-nowrap">
                        Đã khóa
                    </span>
                )
            )
        },
        {
            header: "Xác thực",
            align: "center" as const,
            render: (org) => (
                org.verificationStatus === "Verified" ? (
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded-xl whitespace-nowrap">
                        <ShieldAlert size={12} />
                        Đã xác thực
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-xl whitespace-nowrap">
                        <ShieldAlert size={12} />
                        Chưa xác thực
                    </div>
                )
            )
        },
        {
            header: "Hành động",
            align: "center" as const,
            render: () => (
                <div className="flex items-center justify-center gap-3">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                        <Eye size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <PencilLine size={18} />
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
            title="Danh sách tổ chức"
            totalCount={MockOrganizations.length}
            icon={<Building2 className="text-blue-500" size={20} />}
            data={MockOrganizations}
            columns={columns}
            onViewAll={() => console.log("View all organizations")}
        />
    );
}
