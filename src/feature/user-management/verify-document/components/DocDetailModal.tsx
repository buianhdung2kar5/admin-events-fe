import React, { useState } from 'react';
import { 
    X, FileText, CheckCircle2, ShieldAlert, ChevronLeft, ChevronRight, Download
} from 'lucide-react';
import { DocumentItem, getDocTypeStyles } from '../data/DocMockData';

interface DocDetailModalProps {
    doc: DocumentItem;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string, reason: string) => void;
}

export default function DocDetailModal({ doc, onClose, onApprove, onReject }: DocDetailModalProps) {
    const [rejectReason, setRejectReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [checklist, setChecklist] = useState({
        validImage: false,
        validInfo: false,
        matchingName: false
    });
    const isChecklistComplete = checklist.validImage && checklist.validInfo && checklist.matchingName;

    const typeStyle = getDocTypeStyles(doc.docType);

    const nextImage = () => {
        if (currentImageIndex < doc.documentUrls.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };

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
                                <p className="text-xs text-gray-400">{currentImageIndex + 1} / {doc.documentUrls.length} trang</p>
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-lg transition-colors">
                            <Download size={18} />
                        </button>
                    </div>

                    <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
                        {doc.documentUrls.length > 0 ? (
                            <img 
                                src={doc.documentUrls[currentImageIndex]} 
                                alt={`Document page ${currentImageIndex + 1}`}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                <FileText size={48} className="opacity-20" />
                                <p className="text-sm font-medium">Không có hình ảnh tài liệu</p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {doc.documentUrls.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    disabled={currentImageIndex === 0}
                                    className="absolute left-4 p-2 bg-white/80 hover:bg-white text-gray-600 rounded-full shadow-md disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm transition-all"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    disabled={currentImageIndex === doc.documentUrls.length - 1}
                                    className="absolute right-4 p-2 bg-white/80 hover:bg-white text-gray-600 rounded-full shadow-md disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm transition-all"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
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
                        {/* Status Alert */}
                        {doc.status === "Approved" && (
                            <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-start gap-3 border border-green-100">
                                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Đã phê duyệt</p>
                                    <p className="text-xs mt-1 opacity-80">Bởi {doc.reviewedBy} vào {doc.reviewedAt ? new Date(doc.reviewedAt).toLocaleString("vi-VN") : ""}</p>
                                </div>
                            </div>
                        )}
                        {doc.status === "Rejected" && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-start gap-3 border border-red-100">
                                <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Đã từ chối</p>
                                    <p className="text-xs mt-1 opacity-80 mb-2">Bởi {doc.reviewedBy} vào {doc.reviewedAt ? new Date(doc.reviewedAt).toLocaleString("vi-VN") : ""}</p>
                                    <p className="text-sm font-medium bg-white/50 p-2 rounded-lg">Lý do: {doc.rejectionReason}</p>
                                </div>
                            </div>
                        )}

                        {/* Org Info */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Tổ chức yêu cầu</p>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
                                <img src={doc.orgLogoUrl} alt={doc.organization} className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{doc.organization}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{doc.senderRole === "Organization" ? "Tài khoản Tổ chức" : "Tài khoản Sinh viên"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Request Info */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Thông tin hồ sơ</p>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Tên hồ sơ</p>
                                    <p className="text-sm font-bold text-gray-800">{doc.profileName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Loại tài liệu</p>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${typeStyle.color}`}>
                                            {typeStyle.label}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Ngày gửi</p>
                                        <p className="text-sm font-medium text-gray-800">{new Date(doc.sentDate).toLocaleDateString("vi-VN")}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Người gửi</p>
                                        <p className="text-sm font-medium text-gray-800">{doc.senderName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Email liên hệ</p>
                                        <p className="text-sm font-medium text-gray-800 truncate" title={doc.senderEmail}>{doc.senderEmail}</p>
                                    </div>
                                </div>
                                {doc.notes && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Ghi chú kèm theo</p>
                                        <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700 leading-relaxed">
                                            {doc.notes}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Checklist */}
                        {doc.status === "Pending" && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Tiêu chí kiểm duyệt</p>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                        <input type="checkbox" checked={checklist.validImage} onChange={(e) => setChecklist(prev => ({...prev, validImage: e.target.checked}))} className="w-4 h-4 rounded accent-[#0092B8]" />
                                        <span className="text-sm font-medium text-gray-700">Hình ảnh rõ nét, không có dấu hiệu chỉnh sửa</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                        <input type="checkbox" checked={checklist.validInfo} onChange={(e) => setChecklist(prev => ({...prev, validInfo: e.target.checked}))} className="w-4 h-4 rounded accent-[#0092B8]" />
                                        <span className="text-sm font-medium text-gray-700">Thông tin trên giấy tờ đầy đủ và hợp lệ</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                        <input type="checkbox" checked={checklist.matchingName} onChange={(e) => setChecklist(prev => ({...prev, matchingName: e.target.checked}))} className="w-4 h-4 rounded accent-[#0092B8]" />
                                        <span className="text-sm font-medium text-gray-700">Tên tổ chức khớp với hồ sơ đăng ký</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Footer */}
                    {doc.status === "Pending" && (
                        <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                            {isRejecting ? (
                                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                                    <textarea 
                                        placeholder="Nhập lý do từ chối hồ sơ này..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        className="w-full h-24 p-3 text-sm border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setIsRejecting(false)}
                                            className="flex-1 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button 
                                            onClick={() => onReject(doc.id, rejectReason)}
                                            disabled={!rejectReason.trim()}
                                            className="flex-1 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Xác nhận từ chối
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {doc.senderRole === "Student" && (
                                        <div className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-[11px] font-medium flex items-center gap-2">
                                            <CheckCircle2 size={14} className="shrink-0" />
                                            Khi phê duyệt, tài khoản này sẽ tự động được nâng cấp lên hạng Tổ Chức (Organization).
                                        </div>
                                    )}
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setIsRejecting(true)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                        >
                                            <ShieldAlert size={16} /> Từ chối
                                        </button>
                                        <button 
                                            onClick={() => onApprove(doc.id)}
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
                    )}
                </div>
            </div>
        </div>
    );
}
