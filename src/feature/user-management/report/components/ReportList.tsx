import { useState, useMemo } from "react";
import { Search, Filter, Eye, AlertTriangle } from "lucide-react";
import { MockReports, ReportItem, ReportStatus, ReportCategory } from "../data/ReportMockData";
import ReportDetailModal from "./ReportDetailModal";

export default function ReportList() {
    const [reports, setReports] = useState<ReportItem[]>(MockReports);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<ReportStatus | "ALL">("ALL");
    const [filterCategory, setFilterCategory] = useState<ReportCategory | "ALL">("ALL");
    const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

    const filtered = useMemo(() => {
        return reports.filter(r => {
            const matchSearch = r.reporterName.toLowerCase().includes(search.toLowerCase()) ||
                                r.targetName.toLowerCase().includes(search.toLowerCase()) ||
                                r.reporterId.toLowerCase().includes(search.toLowerCase()) ||
                                r.targetId.toLowerCase().includes(search.toLowerCase());
            const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
            const matchCat = filterCategory === "ALL" || r.reportCategory === filterCategory;
            return matchSearch && matchStatus && matchCat;
        });
    }, [reports, search, filterStatus, filterCategory]);

    const getCategoryStyles = (cat: string) => {
        switch (cat) {
            case "HARASSMENT": return "bg-purple-50 text-purple-600 border-purple-200";
            case "SPAM": return "bg-amber-50 text-amber-600 border-amber-200";
            case "ILLEGAL": return "bg-red-50 text-red-600 border-red-200";
            case "FAKE": return "bg-orange-50 text-orange-600 border-orange-200";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    const handleResolve = (id: string) => {
        setReports(prev => prev.map(r => r.id === id ? { 
            ...r, 
            status: "RESOLVED", 
            resolvedAt: new Date().toISOString(),
            resolvedBy: "admin-01" 
        } : r));
    };

    const handleSuspendTarget = (id: string, targetType: string, reason: string, duration: number) => {
        // TODO: Call POST /admin/bulk-suspend
        alert(`Đã gửi lệnh khóa ${targetType} (ID: ${id}) trong ${duration} ngày.\nLý do: ${reason}`);
    };

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#0092B8] transition-all flex-1 w-full">
                    <Search size={18} className="text-gray-400 shrink-0" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên/ID người báo cáo hoặc đối tượng..." className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400" />
                </div>
                
                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 outline-none focus:border-[#0092B8] bg-white cursor-pointer">
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PENDING">Chờ xử lý (PENDING)</option>
                            <option value="RESOLVED">Đã xử lý (RESOLVED)</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as any)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 outline-none focus:border-[#0092B8] bg-white cursor-pointer">
                            <option value="ALL">Tất cả loại vi phạm</option>
                            <option value="HARASSMENT">Quấy rối (HARASSMENT)</option>
                            <option value="SPAM">Spam (SPAM)</option>
                            <option value="ILLEGAL">Phạm pháp (ILLEGAL)</option>
                            <option value="FAKE">Giả mạo (FAKE)</option>
                            <option value="INAPPROPRIATE">Không phù hợp</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Thời gian</th>
                                <th className="px-6 py-4">Người báo cáo</th>
                                <th className="px-6 py-4">Đối tượng bị báo cáo</th>
                                <th className="px-6 py-4">Phân loại</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                                        Không tìm thấy khiếu nại/báo cáo nào
                                    </td>
                                </tr>
                            ) : filtered.map(report => (
                                <tr key={report.id} className={`hover:bg-gray-50/80 transition-colors ${report.status === 'PENDING' ? 'bg-red-50/10' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {report.status === 'PENDING' && <AlertTriangle size={14} className="text-red-500" />}
                                            <span className="text-gray-600">{new Date(report.createdAt).toLocaleString("vi-VN")}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{report.reporterName}</span>
                                            <span className="text-xs text-gray-500">{report.reporterId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{report.targetName}</span>
                                            <span className="text-xs font-semibold text-red-500">{report.targetType}: {report.targetId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded-lg text-[11px] font-bold border tracking-wide ${getCategoryStyles(report.reportCategory)}`}>
                                            {report.reportCategory}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border tracking-wide uppercase ${report.status === 'RESOLVED' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setSelectedReport(report)} className={`p-2 rounded-xl transition-all ${report.status === 'PENDING' ? 'text-red-500 hover:bg-red-100 bg-red-50' : 'text-gray-400 hover:text-[#0092B8] hover:bg-blue-50'}`} title="Xem chi tiết & Xử lý">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedReport && (
                <ReportDetailModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    onResolve={handleResolve}
                    onSuspendTarget={handleSuspendTarget}
                />
            )}
        </div>
    );
}
