import React, { useState } from 'react';
import { 
    X, FileText, CheckCircle2, ShieldAlert, Download, ExternalLink, FileClock
} from 'lucide-react';
import { VerificationDocument, getDocumentTypeLabel, getDocumentTypeStyle } from '../DTO/VerificationInterface';

interface DocDetailModalProps {
    doc: VerificationDocument;
    onClose: () => void;
    onApprove: (id: number) => void;
    onReject: (id: number, reason: string) => void;
}

export default function DocDetailModal({ doc, onClose, onApprove, onReject }: DocDetailModalProps) {
    const [rejectReason, setRejectReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    const [checklist, setChecklist] = useState({
        validImage: false,
        validInfo: false,
        matchingName: false
    });
    const isChecklistComplete = checklist.validImage && checklist.validInfo && checklist.matchingName;

    const typeLabel = getDocumentTypeLabel(doc.documentType);
    const typeStyle = getDocumentTypeStyle(doc.documentType);

    const isImage = doc.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) != null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex overflow-hidden animate-[zoomIn_0.2s_ease]">
                
                {/* Left side - Document Viewer */}
                <div className="w-2/3 bg-gray-100 flex flex-col relative border-r border-gray-200">
                    <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                <FileText size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">Tài liệu đính kèm</h3>
                                <p className="text-xs text-gray-400">{doc.originalFileName}</p>
                            </div>
                        </div>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" 
                            className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-lg transition-colors">
                            <Download size={18} />
                        </a>
                    </div>

                    <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
                        {isImage ? (
                            <img 
                                src={doc.fileUrl} 
                                alt="Document"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400 gap-4 bg-white p-12 rounded-3xl border border-dashed border-gray-200">
                                <div className="p-6 bg-gray-50 rounded-full">
                                    <FileText size={64} className="opacity-20" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-600">Định dạng file không hỗ trợ xem trực tiếp</p>
                                    <p className="text-sm text-gray-400 mt-1">Vui lòng tải xuống hoặc xem ở tab mới để kiểm tra nội dung</p>
                                </div>
                                <a href={doc.fileUrl} target="_blank" rel="noreferrer" 
                                    className="flex items-center gap-2 px-6 py-3 bg-[#0092B8] text-white rounded-xl font-bold hover:bg-[#007a99] transition-all shadow-md">
                                    <ExternalLink size={18} /> Mở trong tab mới
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side - Info & Actions */}
                <div className="w-1/3 flex flex-col bg-white">
                    <div className="p-5 flex items-center justify-between border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800">Chi tiết xét duyệt</h2>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                        {/* Status Alert (Always Pending in current DocList) */}
                        <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl flex items-start gap-3 border border-amber-100">
                            <FileClock size={20} className="shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-sm text-amber-800">Chờ phê duyệt</p>
                                <p className="text-xs mt-1 text-amber-600 font-medium">Hồ sơ này đang đợi được kiểm tra thông tin và xác thực bởi quản trị viên.</p>
                            </div>
                        </div>

                        {/* Sender Info */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Thông tin người gửi</p>
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0092B8] font-black text-xl">
                                    {doc.userId}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-800">User #{doc.userId}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">Mã người dùng hệ thống</p>
                                </div>
                            </div>
                        </div>

                        {/* Request Info */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Thông tin hồ sơ</p>
                            <div className="flex flex-col gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tên file</p>
                                    <p className="text-sm font-bold text-gray-800">{doc.originalFileName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Loại tài liệu</p>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${typeStyle}`}>
                                            {typeLabel}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Ngày gửi</p>
                                        <p className="text-sm font-bold text-gray-800">{new Date(doc.createdTime).toLocaleDateString("vi-VN")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checklist */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Tiêu chí kiểm duyệt</p>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-blue-100">
                                    <input type="checkbox" checked={checklist.validImage} onChange={(e) => setChecklist(prev => ({...prev, validImage: e.target.checked}))} className="w-4 h-4 rounded accent-[#0092B8]" />
                                    <span className="text-sm font-medium text-gray-700">Hình ảnh rõ nét, không chỉnh sửa</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-blue-100">
                                    <input type="checkbox" checked={checklist.validInfo} onChange={(e) => setChecklist(prev => ({...prev, validInfo: e.target.checked}))} className="w-4 h-4 rounded accent-[#0092B8]" />
                                    <span className="text-sm font-medium text-gray-700">Thông tin đầy đủ và hợp lệ</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-blue-100">
                                    <input type="checkbox" checked={checklist.matchingName} onChange={(e) => setChecklist(prev => ({...prev, matchingName: e.target.checked}))} className="w-4 h-4 rounded accent-[#0092B8]" />
                                    <span className="text-sm font-medium text-gray-700">Tên tổ chức khớp với hồ sơ</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                        {isRejecting ? (
                            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                                <textarea 
                                    placeholder="Nhập lý do từ chối hồ sơ này..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-full h-24 p-3 text-sm border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none font-medium"
                                />
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsRejecting(false)}
                                        className="flex-1 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button 
                                        onClick={() => onReject(doc.verificationDocumentId, rejectReason)}
                                        disabled={!rejectReason.trim()}
                                        className="flex-1 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Xác nhận từ chối
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setIsRejecting(true)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                    >
                                        <ShieldAlert size={16} /> Từ chối
                                    </button>
                                    <button 
                                        onClick={() => onApprove(doc.verificationDocumentId)}
                                        disabled={!isChecklistComplete}
                                        className="flex-[2] flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-[#0092B8] hover:bg-[#007a99] rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={!isChecklistComplete ? "Vui lòng tick chọn đủ tiêu chí" : ""}
                                    >
                                        <CheckCircle2 size={16} /> Phê duyệt hồ sơ
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
