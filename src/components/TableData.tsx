import React, { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export interface Column<T> {
    header: string;
    render: (item: T) => ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
    headerClassName?: string;
}

interface TableDataProps<T> {
    title: string;
    totalCount: number;
    icon?: ReactNode;
    subtitle?: string;
    data: T[];
    columns: Column<T>[];
    onViewAll?: () => void;
    className?: string;
}

export default function TableData<T>({ 
    title, 
    totalCount, 
    icon, 
    subtitle,
    data, 
    columns, 
    onViewAll,
    className = ""
}: TableDataProps<T>) {
    return (
        <div className={`w-full bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden font-sans ${className}`}>
            <div className="p-6 pb-2 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="p-2.5 bg-blue-50/50 rounded-xl">
                            {icon}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                            {title} ({totalCount})
                        </h3>
                        {subtitle && (
                            <p className="text-sm text-gray-400 font-medium">{subtitle}</p>
                        )}
                    </div>
                </div>
                {onViewAll && (
                    <button 
                        onClick={onViewAll}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-all hover:translate-x-0.5"
                    >
                        Xem tất cả <ArrowRight size={14} strokeWidth={2.5} />
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-50">
                            {columns.map((col, idx) => (
                                <th 
                                    key={idx} 
                                    className={`px-6 py-5 text-sm font-bold text-gray-400 
                                        ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                                        ${col.headerClassName || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, rowIdx) => (
                                <tr 
                                    key={rowIdx} 
                                    className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-b-0"
                                >
                                    {columns.map((col, colIdx) => (
                                        <td 
                                            key={colIdx} 
                                            className={`px-6 py-4 
                                                ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                                                ${col.className || ''}`}
                                        >
                                            {col.render(item)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium">
                                    Không có dữ liệu hiển thị
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-6 border-t border-gray-50 bg-gray-50/10">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span>Hiển thị <span className="text-gray-700 font-bold">{data.length}</span> bản ghi</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50" disabled>Trước</button>
                        <button className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg font-bold shadow-sm">1</button>
                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors">2</button>
                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors">Sau</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
