import React from 'react';
import { 
    FileText, Eye, PencilLine, Trash2, FileCheck2, FileClock, ShieldAlert
} from 'lucide-react';
import { MockDocuments, getDocTypeStyles } from '../data/DocMockData';
import TableData, { Column } from '../../../../components/TableData';

export default function DocList() {
    const columns: Column<any>[] = [
        {
            header: "Hồ sơ",
            render: (doc) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50/50 flex items-center justify-center rounded-lg border border-blue-100/50">
                        <FileText size={20} className="text-blue-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-800 truncate leading-tight max-w-[200px] block">
                            {doc.profileName}
                        </span>
                        <span className="text-xs text-gray-400 truncate max-w-[200px] block">
                            {doc.organization}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Loại hồ sơ",
            render: (doc) => {
                const typeStyle = getDocTypeStyles(doc.docType);
                return (
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap ${typeStyle.color}`}>
                        {typeStyle.label}
                    </div>
                );
            }
        },
        {
            header: "Người gửi",
            render: (doc) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-gray-700 truncate leading-tight">
                        {doc.senderName}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                        {doc.senderEmail}
                    </span>
                </div>
            )
        },
        {
            header: "Ngày gửi",
            render: (doc) => (
                <span className="text-sm text-gray-400 font-medium">
                    {new Date(doc.sentDate).toLocaleDateString('vi-VN')}
                </span>
            )
        },
        {
            header: "Trạng thái",
            align: "center" as const,
            render: (doc) => (
                doc.status === "Verified" ? (
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded-xl whitespace-nowrap">
                        <FileCheck2 size={12} />
                        Đã xác thực
                    </div>
                ) : doc.status === "Pending" ? (
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-xl whitespace-nowrap">
                        <FileClock size={12} />
                        Chờ xác thực
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-500 text-[10px] font-bold rounded-xl whitespace-nowrap">
                        <ShieldAlert size={12} />
                        Từ chối
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
            title="Duyệt hồ sơ"
            totalCount={MockDocuments.length}
            icon={<FileText className="text-blue-500" size={20} />}
            data={MockDocuments}
            columns={columns}
            onViewAll={() => console.log("View all documents")}
        />
    );
}
