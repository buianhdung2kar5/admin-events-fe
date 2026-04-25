import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Users, Search, X, Plus, Trash2 } from "lucide-react";
import { MockRecruitments, Recruitment, RecruitmentStatus } from "../data/RecruitmentMockData";
import RecruitmentDetailPanel from "./RecruitmentDetailPanel";
import ApplicantList from "./ApplicantList";

export default function RecruitmentList() {
    const [recruitments, setRecruitments] = useState<Recruitment[]>(MockRecruitments);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<RecruitmentStatus | "ALL">("ALL");
    const [detailItem, setDetailItem] = useState<Recruitment | null>(null);
    const [applicantView, setApplicantView] = useState<Recruitment | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // If viewing applicants for a recruitment, show that view instead
    if (applicantView) {
        return <ApplicantList recruitment={applicantView} onBack={() => setApplicantView(null)} />;
    }

    const filtered = recruitments.filter(r => {
        const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
        const matchSearch = r.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
            r.role.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const toggleSelectAll = () => {
        if (selectedIds.length === paginated.length && paginated.length > 0) setSelectedIds([]);
        else setSelectedIds(paginated.map(r => r.id));
    };

    const handleStatusChange = (id: string, status: RecruitmentStatus) => {
        setRecruitments(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        if (detailItem?.id === id) setDetailItem(prev => prev ? { ...prev, status } : null);
    };

    const handleBulkDelete = () => {
        setRecruitments(prev => prev.filter(r => !selectedIds.includes(r.id)));
        setSelectedIds([]);
    };

    const statusStyle = (s: RecruitmentStatus) => s === "OPEN"
        ? "bg-green-50 text-green-600 border-green-200"
        : "bg-gray-100 text-gray-500 border-gray-200";

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-[#0092B8] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">Đã chọn {selectedIds.length}</span>
                            <button onClick={handleBulkDelete} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors">
                                <Trash2 size={14} /> Xóa hàng loạt
                            </button>
                            <button onClick={() => setSelectedIds([])} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><X size={16} /></button>
                        </div>
                    ) : (
                        <h2 className="text-lg font-bold text-gray-800">Danh sách đợt tuyển CTV</h2>
                    )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Status Filter */}
                    <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1">
                        {(["ALL", "OPEN", "CLOSED"] as const).map(s => (
                            <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterStatus === s ? "bg-[#0092B8] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                                {s === "ALL" ? "Tất cả" : s === "OPEN" ? "Đang mở" : "Đã đóng"}
                            </button>
                        ))}
                    </div>
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#0092B8] transition-all">
                        <Search size={15} className="text-gray-400" />
                        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Tìm đợt tuyển..." className="text-sm outline-none bg-transparent w-40 placeholder:text-gray-400" />
                        {search && <button onClick={() => setSearch("")}><X size={14} className="text-gray-400" /></button>}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 font-semibold tracking-wider">
                            <tr>
                                <th className="p-5 w-12">
                                    <div className="flex justify-center">
                                        <input type="checkbox" className="w-4 h-4 rounded-md border-gray-300 cursor-pointer"
                                            checked={selectedIds.length === paginated.length && paginated.length > 0} onChange={toggleSelectAll} />
                                    </div>
                                </th>
                                <th className="px-5 py-4">Sự kiện / Vai trò</th>
                                <th className="px-5 py-4 text-center">Chỉ tiêu</th>
                                <th className="px-5 py-4 text-center">Đơn nộp</th>
                                <th className="px-5 py-4 text-center">Đã duyệt</th>
                                <th className="px-5 py-4 text-center">Trạng thái</th>
                                <th className="px-5 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginated.length === 0 ? (
                                <tr><td colSpan={7} className="py-16 text-center text-sm text-gray-400 font-medium">Không tìm thấy đợt tuyển dụng nào</td></tr>
                            ) : paginated.map(r => (
                                <tr key={r.id} className={`hover:bg-blue-50/20 transition-colors ${selectedIds.includes(r.id) ? "bg-blue-50/40" : ""}`}>
                                    <td className="p-5">
                                        <div className="flex justify-center">
                                            <input type="checkbox" className="w-4 h-4 rounded-md border-gray-300 cursor-pointer"
                                                checked={selectedIds.includes(r.id)} onChange={() => toggleSelect(r.id)} />
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col gap-1 max-w-[300px]">
                                            <span className="font-bold text-gray-800 truncate">{r.eventTitle}</span>
                                            <span className="text-xs text-[#0092B8] font-semibold bg-blue-50 px-2 py-0.5 rounded-lg w-fit">{r.role}</span>
                                            <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="font-bold text-gray-700">{r.quantity}</span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <button onClick={() => setApplicantView(r)} className="inline-flex items-center gap-1.5 font-bold text-[#0092B8] hover:underline">
                                            <Users size={14} /> {r.appliedCount}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-bold text-green-600">{r.approvedCount}</span>
                                            <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min((r.approvedCount / Math.max(r.quantity, 1)) * 100, 100)}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`inline-flex px-3 py-1.5 rounded-xl border text-[11px] font-bold uppercase tracking-wide ${statusStyle(r.status)}`}>
                                            {r.status === "OPEN" ? "Đang mở" : "Đã đóng"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button onClick={() => setDetailItem(r)} className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-xl transition-all" title="Chi tiết">
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">
                        Hiển thị <span className="font-bold text-gray-800">{paginated.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span>–<span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> / <span className="font-bold text-gray-800">{filtered.length}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600"><ChevronLeft size={18} /></button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? "bg-[#0092B8] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>{i + 1}</button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors text-gray-600"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Detail Panel */}
            {detailItem && (
                <RecruitmentDetailPanel
                    recruitment={detailItem}
                    onClose={() => setDetailItem(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}
