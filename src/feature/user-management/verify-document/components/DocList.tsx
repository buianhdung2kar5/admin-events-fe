import { useState, useMemo, useEffect } from 'react';
import { 
    FileText, Eye, CheckCircle2, ShieldAlert, FileClock, 
    CheckSquare2, Trash2, X, Download
} from 'lucide-react';
import { 
    MockDocuments, DocumentItem, DocStatus, 
    getDocTypeStyles 
} from '../data/DocMockData';
import DocDetailModal from './DocDetailModal';

const PAGE_SIZE = 6;

interface DocListProps {
    filter?: {
        search?: string;
        filter1?: string;
        filter2?: string;
        date?: string;
    };
}

export default function DocList({ filter }: DocListProps) {
    const [data, setData] = useState<DocumentItem[]>(MockDocuments);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [detailDoc, setDetailDoc] = useState<DocumentItem | null>(null);

    // ── Filtered data ───────────────────────────────────────────────
    const filtered = useMemo(() => {
        return data.filter(doc => {
            const search = filter?.search?.toLowerCase() || "";
            const matchSearch = !search 
                || doc.profileName.toLowerCase().includes(search)
                || doc.organization.toLowerCase().includes(search)
                || doc.senderName.toLowerCase().includes(search)
                || doc.senderEmail.toLowerCase().includes(search);

            const statusFilter = filter?.filter1 || "";
            const matchStatus = !statusFilter || doc.status === statusFilter;

            // Notice we re-purposed filter2 as senderRole for Document List (Student vs Organization)
            const roleFilter = filter?.filter2 || "";
            const matchRole = !roleFilter || doc.senderRole === roleFilter;

            const dateFilter = filter?.date || "";
            const matchDate = !dateFilter || doc.sentDate.startsWith(dateFilter);

            return matchSearch && matchStatus && matchRole && matchDate;
        });
    }, [data, filter]);

    useEffect(() => { setCurrentPage(1); }, [filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // ── Actions ─────────────────────────────────────────────────────
    const handleDelete = (id: string) => {
        // TODO: call DELETE /api/verification-documents/{id}
        setData(prev => prev.filter(d => d.id !== id));
        setSelectedIds(prev => prev.filter(i => i !== id));
    };

    const handleBulkDelete = () => {
        setData(prev => prev.filter(d => !selectedIds.includes(d.id)));
        setSelectedIds([]);
    };

    const handleApprove = (id: string) => {
        // TODO: call PUT /api/verification-documents/{id}/approve
        const now = new Date().toISOString();
        const updateDoc = (d: DocumentItem) => 
            d.id === id 
                ? { ...d, status: "Approved" as DocStatus, reviewedBy: "Admin Hệ thống", reviewedAt: now } 
                : d;
        
        setData(prev => prev.map(updateDoc));
        if (detailDoc?.id === id) {
            setDetailDoc(updateDoc(detailDoc));
        }
    };

    const handleReject = (id: string, reason: string) => {
        // TODO: call PUT /api/verification-documents/{id}/reject
        const now = new Date().toISOString();
        const updateDoc = (d: DocumentItem) => 
            d.id === id 
                ? { ...d, status: "Rejected" as DocStatus, rejectionReason: reason, reviewedBy: "Admin Hệ thống", reviewedAt: now } 
                : d;
        
        setData(prev => prev.map(updateDoc));
        if (detailDoc?.id === id) {
            setDetailDoc(updateDoc(detailDoc));
        }
    };

    const toggleSelect = (id: string) => 
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        
    const toggleSelectAll = () => 
        setSelectedIds(selectedIds.length === paginated.length ? [] : paginated.map(d => d.id));

    return (
        <div className="flex flex-col gap-4">
            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-[#0092B8] text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-md animate-[fadeSlideUp_0.2s_ease]">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <CheckSquare2 size={17} />
                        Đã chọn <span className="font-black text-base">{selectedIds.length}</span> hồ sơ
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleBulkDelete}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-xl text-sm font-semibold transition-colors">
                            <Trash2 size={15} /> Xóa
                        </button>
                        <button onClick={() => setSelectedIds([])} className="p-2 hover:bg-white/15 rounded-xl transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50/50 rounded-xl">
                            <FileText size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Duyệt hồ sơ ({filtered.length})</h3>
                            <p className="text-sm text-gray-400 font-medium">Xác thực tổ chức và phê duyệt yêu cầu</p>
                        </div>
                    </div>
                    <button onClick={toggleSelectAll} 
                        className="text-xs font-semibold text-gray-400 hover:text-[#0092B8] transition-colors flex items-center gap-1.5">
                        <CheckSquare2 size={14} />
                        {selectedIds.length === paginated.length && paginated.length > 0 ? "Bỏ chọn tất cả" : "Chọn trang này"}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50">
                                {["", "Hồ sơ / Tổ chức", "Loại", "Người gửi", "Ngày gửi", "Trạng thái", "Hành động"].map((h, i) => (
                                    <th key={i} className={`px-5 py-5 text-sm font-bold text-gray-400 ${i > 4 ? "text-center" : "text-left"}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length > 0 ? paginated.map(doc => {
                                const typeStyle = getDocTypeStyles(doc.docType);
                                return (
                                    <tr key={doc.id} 
                                        className={`group border-b border-gray-50 last:border-0 transition-colors ${selectedIds.includes(doc.id) ? "bg-blue-50/40" : "hover:bg-gray-50/50"}`}>
                                        <td className="px-5 py-4 text-center w-12">
                                            <input type="checkbox" checked={selectedIds.includes(doc.id)} 
                                                onChange={() => toggleSelect(doc.id)}
                                                className="w-4 h-4 rounded accent-[#0092B8] cursor-pointer" />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={doc.orgLogoUrl} alt={doc.organization} className="w-10 h-10 rounded-xl border border-gray-100 object-cover" />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-bold text-gray-800 max-w-[200px] truncate block">{doc.profileName}</span>
                                                    <span className="text-xs text-gray-400 max-w-[200px] truncate block">{doc.organization}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap ${typeStyle.color}`}>
                                                {typeStyle.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-gray-700 truncate leading-tight">{doc.senderName}</span>
                                                <span className="text-xs text-gray-400 truncate">{doc.senderEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-gray-500 font-medium">{new Date(doc.sentDate).toLocaleDateString("vi-VN")}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            {doc.status === "Approved" ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded-xl whitespace-nowrap">
                                                    <CheckCircle2 size={12} /> Đã xác thực
                                                </div>
                                            ) : doc.status === "Pending" ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-xl whitespace-nowrap">
                                                    <FileClock size={12} /> Chờ duyệt
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 text-[10px] font-bold rounded-xl whitespace-nowrap">
                                                    <ShieldAlert size={12} /> Từ chối
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => setDetailDoc(doc)} title={doc.status === "Pending" ? "Xét duyệt" : "Xem chi tiết"}
                                                    className={`p-2 rounded-xl transition-all ${
                                                        doc.status === "Pending" 
                                                        ? "text-white bg-[#0092B8] hover:bg-[#007a99] shadow-sm" 
                                                        : "text-gray-400 hover:text-[#0092B8] hover:bg-blue-50"
                                                    }`}>
                                                    {doc.status === "Pending" ? <CheckCircle2 size={16} /> : <Eye size={17} />}
                                                </button>
                                                <button onClick={() => handleDelete(doc.id)} title="Xóa"
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-medium">
                                        Không tìm thấy hồ sơ phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span>Hiển thị <span className="text-gray-700 font-bold">{paginated.length}</span> / <span className="text-gray-700 font-bold">{filtered.length}</span> hồ sơ</span>
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
            </div>

            {/* Document Detail & Action Modal */}
            {detailDoc && (
                <DocDetailModal 
                    doc={detailDoc} 
                    onClose={() => setDetailDoc(null)} 
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}
