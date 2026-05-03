import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Eye, AlertTriangle, Loader2, Mail, Phone, User } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReportsManagement } from "../../../../services/system-management/ReportsManagement";
import { ReportItem, ReportStatus } from "../DTO/ReportsInterface";
import ReportDetailModal from "./ReportDetailModal";
import Toast from "../../../../components/common/Toast";

const PAGE_SIZE = 10;

export default function ReportList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<ReportStatus | "ALL">("ALL");
    const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const queryClient = useQueryClient();

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['reports', currentPage],
        queryFn: async () => {
            const res = await ReportsManagement.getAllReports(currentPage - 1, PAGE_SIZE, ['createdTime,desc']);
            return res.object;
        }
    });

    const reports = response?.content || [];
    const totalElements = response?.totalElements || 0;
    const totalPages = response?.totalPages || 1;

    const filtered = useMemo(() => {
        return reports.filter((r: ReportItem) => {
            const searchLower = search.toLowerCase();
            const matchSearch = (r.name || "").toLowerCase().includes(searchLower) ||
                                (r.email || "").toLowerCase().includes(searchLower) ||
                                (r.title || "").toLowerCase().includes(searchLower) ||
                                (r.phoneNumber || "").includes(search) ||
                                String(r.reportId).includes(search);
            
            const matchStatus = filterStatus === "ALL" || (r.status || "PENDING") === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [reports, search, filterStatus]);

    useEffect(() => { setCurrentPage(1); }, [search, filterStatus]);

    const handleResolve = async (id: number) => {
        try {
            await ReportsManagement.resolveReport(id);
            setToast({ msg: "Đã xử lý báo cáo thành công!", ok: true });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            setSelectedReport(null);
        } catch (error: any) {
            setToast({ msg: error.message || "Lỗi khi xử lý báo cáo", ok: false });
        }
    };

    if (isError) return <div className="p-12 text-center text-red-500 bg-white rounded-3xl border border-red-100 font-medium">Lỗi khi tải danh sách báo cáo!</div>;

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease] relative">
            <Toast toast={toast} onClose={() => setToast(null)} />
            
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#0092B8] transition-all flex-1 w-full">
                    <Search size={18} className="text-gray-400 shrink-0" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, email, tiêu đề hoặc mã báo cáo..." className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400" />
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
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[300px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <Loader2 className="animate-spin text-[#0092B8]" size={32} />
                    </div>
                )}
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Thời gian</th>
                                <th className="px-6 py-4">Người gửi</th>
                                <th className="px-6 py-4">Nội dung báo cáo</th>
                                <th className="px-6 py-4">Thông tin liên hệ</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 && !isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                                        Không tìm thấy khiếu nại/báo cáo nào
                                    </td>
                                </tr>
                            ) : filtered.map((report: ReportItem) => (
                                <tr key={report.reportId} className={`hover:bg-gray-50/80 transition-colors ${!report.status || report.status === 'PENDING' ? 'bg-red-50/10' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {(!report.status || report.status === 'PENDING') && <AlertTriangle size={14} className="text-red-500" />}
                                            <span className="text-gray-600 font-medium">{new Date(report.createdTime).toLocaleString("vi-VN")}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col min-w-[150px]">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-[#0092B8]/10 flex items-center justify-center text-[#0092B8]">
                                                    <User size={14} />
                                                </div>
                                                <span className="font-bold text-gray-800">{report.name}</span>
                                            </div>
                                            <span className="text-xs text-gray-400 mt-1 pl-9">UID: {report.reporter?.userId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col max-w-[250px]">
                                            <span className="font-bold text-gray-800 truncate">{report.title}</span>
                                            <span className="text-xs text-gray-500 line-clamp-1 mt-1">{report.description}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-[11px]">
                                            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                                                <Mail size={12} className="text-[#0092B8]" />
                                                {report.email}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                                                <Phone size={12} className="text-[#0092B8]" />
                                                {report.phoneNumber}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black border tracking-widest uppercase transition-all shadow-sm ${
                                            report.status === 'RESOLVED' 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-100/50' 
                                            : 'bg-amber-50 text-amber-600 border-amber-200 shadow-amber-100/50 animate-pulse'
                                        }`}>
                                            {report.status || "PENDING"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setSelectedReport(report)} className={`p-2 rounded-xl transition-all ${!report.status || report.status === 'PENDING' ? 'text-red-500 hover:bg-red-100 bg-red-50' : 'text-gray-400 hover:text-[#0092B8] hover:bg-blue-50'}`} title="Xem chi tiết & Xử lý">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium bg-gray-50/30">
                        <span>Hiển thị <span className="text-gray-700 font-bold">{filtered.length}</span> / <span className="text-gray-700 font-bold">{totalElements}</span> báo cáo</span>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40">Trước</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setCurrentPage(p)}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${p === currentPage ? "bg-[#0092B8] text-white border border-[#0092B8]" : "border border-gray-200 hover:bg-white"}`}>{p}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40">Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {selectedReport && (
                <ReportDetailModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    onResolve={handleResolve}
                />
            )}
        </div>
    );
}
