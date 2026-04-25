import { useState } from "react";
import { ReportItem } from "../data/ReportMockData";
import { X, CheckCircle, ShieldAlert, UserX, AlertTriangle } from "lucide-react";

interface Props {
    report: ReportItem;
    onClose: () => void;
    onResolve: (id: string) => void;
    onSuspendTarget: (id: string, targetType: string, reason: string, duration: number) => void;
}

export default function ReportDetailModal({ report, onClose, onResolve, onSuspendTarget }: Props) {
    const [isSuspending, setIsSuspending] = useState(false);
    const [suspendReason, setSuspendReason] = useState(report.reason);
    const [suspendDuration, setSuspendDuration] = useState<number>(30);

    const getCategoryStyles = (cat: string) => {
        switch (cat) {
            case "HARASSMENT": return "bg-purple-50 text-purple-600 border-purple-200";
            case "SPAM": return "bg-amber-50 text-amber-600 border-amber-200";
            case "ILLEGAL": return "bg-red-50 text-red-600 border-red-200";
            case "FAKE": return "bg-orange-50 text-orange-600 border-orange-200";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={20} />
                        Chi tiết Báo cáo / Khiếu nại
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                    {/* Báo cáo info */}
                    <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Trạng thái xử lý</span>
                            <span className={`w-fit px-2.5 py-1 rounded-lg text-[11px] font-bold border ${report.status === 'RESOLVED' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200 animate-pulse'}`}>
                                {report.status === 'RESOLVED' ? "ĐÃ XỬ LÝ (RESOLVED)" : "CHỜ XỬ LÝ (PENDING)"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Phân loại (Category)</span>
                            <span className={`w-fit px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getCategoryStyles(report.reportCategory)}`}>
                                {report.reportCategory}
                            </span>
                        </div>
                        
                        <div className="flex flex-col gap-1 col-span-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Người báo cáo</span>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800">{report.reporterName}</span>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">ID: {report.reporterId}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 col-span-2 bg-red-50/50 p-4 rounded-xl border border-red-100">
                            <span className="text-xs font-bold text-red-500 uppercase">Đối tượng bị báo cáo (Target)</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-bold text-gray-800 text-lg">{report.targetName}</span>
                                <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md">{report.targetType}: {report.targetId}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 col-span-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Lý do ngắn gọn</span>
                            <span className="font-semibold text-gray-800">{report.reason}</span>
                        </div>

                        <div className="flex flex-col gap-1 col-span-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Chi tiết (Description)</span>
                            <div className="bg-gray-50 text-gray-700 border border-gray-200 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
                                {report.description}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 text-xs">
                            <span className="font-bold text-gray-500 uppercase">Tạo lúc</span>
                            <span className="text-gray-600">{new Date(report.createdAt).toLocaleString("vi-VN")}</span>
                        </div>
                        {report.resolvedAt && (
                            <div className="flex flex-col gap-1 text-xs">
                                <span className="font-bold text-gray-500 uppercase">Xử lý lúc (By: {report.resolvedBy})</span>
                                <span className="text-gray-600">{new Date(report.resolvedAt).toLocaleString("vi-VN")}</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {report.status === "PENDING" && (
                        <div className="flex flex-col gap-4 pt-6 border-t border-gray-100">
                            {isSuspending ? (
                                <div className="flex flex-col gap-4 bg-red-50 p-5 rounded-2xl border border-red-100">
                                    <h4 className="font-bold text-red-600 text-sm flex items-center gap-2">
                                        <ShieldAlert size={16} /> Khóa đối tượng ({report.targetType})
                                    </h4>
                                    
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Thời gian khóa (ngày) <span className="text-red-500">*</span></label>
                                        <input type="number" min="1" value={suspendDuration} onChange={e => setSuspendDuration(Number(e.target.value))} className="border border-red-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500" />
                                    </div>
                                    
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Lý do khóa <span className="text-red-500">*</span></label>
                                        <textarea rows={2} value={suspendReason} onChange={e => setSuspendReason(e.target.value)} placeholder="Nhập lý do khóa tài khoản..." className="border border-red-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 resize-none" />
                                    </div>

                                    <div className="flex items-center gap-3 mt-2">
                                        <button onClick={() => setIsSuspending(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors">
                                            Hủy
                                        </button>
                                        <button 
                                            onClick={() => { 
                                                onSuspendTarget(report.targetId, report.targetType, suspendReason, suspendDuration); 
                                                onResolve(report.id); 
                                                onClose(); 
                                            }} 
                                            disabled={!suspendReason.trim() || suspendDuration <= 0}
                                            className="flex-1 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                            <UserX size={16} /> Xác nhận Khóa & Đóng Report
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    <button onClick={() => { onResolve(report.id); onClose(); }} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors shadow-sm w-full">
                                        <CheckCircle size={18} /> Đóng Report (Cảnh cáo)
                                    </button>
                                    <button onClick={() => setIsSuspending(true)} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm w-full">
                                        <UserX size={18} /> Khóa Đối Tượng (Suspend)
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
