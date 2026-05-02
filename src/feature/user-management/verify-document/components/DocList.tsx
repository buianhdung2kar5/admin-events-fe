import { useState, useEffect } from 'react';
import { 
    FileText, Eye, CheckCircle2, ShieldAlert, FileClock, 
    CheckSquare2, Trash2, X, Loader2
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { VerificationDocumentApi } from '../../../../services/user-management/DocumentApi';
import { 
    VerificationDocument, VerificationDocumentResponse, 
    getDocumentTypeLabel, getDocumentTypeStyle 
} from '../DTO/VerificationInterface';
import DocDetailModal from './DocDetailModal';
import Toast from '../../../../components/common/Toast';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [detailDoc, setDetailDoc] = useState<VerificationDocument | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    
    const queryClient = useQueryClient();

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ['verification-documents', currentPage, filter],
        queryFn: async () => {
            const res = await VerificationDocumentApi.getAllDocumentVerify(
                currentPage - 1,
                PAGE_SIZE,
                ['createdTime,desc']
            );
            return res;
        }
    });

    const documents = response?.object?.content || [];
    const totalElements = response?.object?.totalElements || 0;
    const totalPages = response?.object?.totalPages || 1;

    useEffect(() => { setCurrentPage(1); }, [filter]);

    // ── Actions ─────────────────────────────────────────────────────
    const handleApprove = async (id: number) => {
        try {
            await VerificationDocumentApi.approvedDocumentVerify(id);
            setToast({ msg: "Phê duyệt hồ sơ thành công!", ok: true });
            queryClient.invalidateQueries({ queryKey: ['verification-documents'] });
            setDetailDoc(null);
        } catch (error: any) {
            setToast({ msg: error.message || "Không thể phê duyệt hồ sơ", ok: false });
        }
    };

    const handleReject = async (id: number, reason: string) => {
        // TODO: call reject API if exists, for now just a placeholder
        setToast({ msg: `Đã từ chối hồ sơ vì: ${reason}`, ok: true });
        setDetailDoc(null);
    };

    const toggleSelect = (id: number) => 
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    
    const toggleSelectAll = () => 
        setSelectedIds(selectedIds.length === documents.length ? [] : documents.map((d:any) => d.verificationDocumentId));

    if (isError) return <div className="p-12 text-center text-red-500 bg-white rounded-3xl border border-red-100 font-medium">Lỗi khi tải danh sách hồ sơ xác thực!</div>;

    return (
        <div className="flex flex-col gap-4">
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-[#0092B8] text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-md animate-[fadeSlideUp_0.2s_ease]">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <CheckSquare2 size={17} />
                        Đã chọn <span className="font-black text-base">{selectedIds.length}</span> hồ sơ
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setSelectedIds([])} className="p-2 hover:bg-white/15 rounded-xl transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <Loader2 className="animate-spin text-[#0092B8]" size={32} />
                    </div>
                )}

                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50/50 rounded-xl">
                            <FileText size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Duyệt hồ sơ ({totalElements})</h3>
                            <p className="text-sm text-gray-400 font-medium">Xác thực tổ chức và phê duyệt yêu cầu</p>
                        </div>
                    </div>
                    <button onClick={toggleSelectAll} 
                        className="text-xs font-semibold text-gray-400 hover:text-[#0092B8] transition-colors flex items-center gap-1.5">
                        <CheckSquare2 size={14} />
                        {selectedIds.length === documents.length && documents.length > 0 ? "Bỏ chọn tất cả" : "Chọn trang này"}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50">
                                {["", "Tài liệu", "Loại", "Người gửi", "Ngày gửi", "Trạng thái", "Hành động"].map((h, i) => (
                                    <th key={i} className={`px-5 py-5 text-sm font-bold text-gray-400 ${i > 4 ? "text-center" : "text-left"}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {documents.length > 0 ? documents.map((doc:any) => {
                                const typeLabel = getDocumentTypeLabel(doc.documentType);
                                const typeStyle = getDocumentTypeStyle(doc.documentType);
                                return (
                                    <tr key={doc.verificationDocumentId} 
                                        className={`group border-b border-gray-50 last:border-0 transition-colors ${selectedIds.includes(doc.verificationDocumentId) ? "bg-blue-50/40" : "hover:bg-gray-50/50"}`}>
                                        <td className="px-5 py-4 text-center w-12">
                                            <input type="checkbox" checked={selectedIds.includes(doc.verificationDocumentId)} 
                                                onChange={() => toggleSelect(doc.verificationDocumentId)}
                                                className="w-4 h-4 rounded accent-[#0092B8] cursor-pointer" />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                                    <FileText size={18} />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-bold text-gray-800 max-w-[220px] truncate block">{doc.originalFileName}</span>
                                                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline font-bold truncate block">Xem file gốc</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider ${typeStyle}`}>
                                                {typeLabel}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-gray-700 truncate leading-tight">User #{doc.userId}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">UID: {doc.userId}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-gray-500 font-medium">{new Date(doc.createdTime).toLocaleDateString("vi-VN")}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-xl whitespace-nowrap">
                                                <FileClock size={12} /> Chờ duyệt
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => setDetailDoc(doc)} title="Xem hồ sơ"
                                                    className="p-2 rounded-xl transition-all text-gray-400 hover:text-[#0092B8] hover:bg-blue-50">
                                                    <Eye size={17} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if (window.confirm("Bạn có chắc chắn muốn phê duyệt hồ sơ này không?")) {
                                                            handleApprove(doc.verificationDocumentId);
                                                        }
                                                    }} 
                                                    title="Phê duyệt nhanh"
                                                    className="p-2 rounded-xl transition-all text-white bg-[#0092B8] hover:bg-[#007a99] shadow-sm"
                                                >
                                                    <CheckCircle2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : !isLoading && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center flex flex-col items-center justify-center gap-4">
                                        <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                            <FileText size={48} />
                                        </div>
                                        <p className="text-gray-400 font-bold">Không tìm thấy hồ sơ phù hợp</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
                        <span>Hiển thị <span className="text-gray-700 font-bold">{documents.length}</span> / <span className="text-gray-700 font-bold">{totalElements}</span> hồ sơ</span>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40 cursor-pointer">Trước</button>
                            
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum = 1;
                                    if (totalPages <= 5) pageNum = i + 1;
                                    else if (currentPage <= 3) pageNum = i + 1;
                                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                    else pageNum = currentPage - 2 + i;
                                    
                                    return (
                                        <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 rounded-lg font-bold transition-all ${pageNum === currentPage ? "bg-[#0092B8] text-white shadow-sm" : "border border-gray-200 hover:bg-white"}`}>{pageNum}</button>
                                    );
                                })}
                            </div>

                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40 cursor-pointer">Sau</button>
                        </div>
                    </div>
                )}
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
