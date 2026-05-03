import { ReportItem } from "../DTO/ReportsInterface";
import { X, CheckCircle, Mail, Phone, Calendar, User, Info, MessageSquare } from "lucide-react";

interface Props {
    report: ReportItem;
    onClose: () => void;
    onResolve: (id: number) => void;
}

export default function ReportDetailModal({ report, onClose, onResolve }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#0092B8]/10 rounded-2xl text-[#0092B8]">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 tracking-tight">Chi tiết Báo cáo</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Mã báo cáo: #{report.reportId}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-8 flex flex-col gap-8 max-h-[75vh] overflow-y-auto">
                    
                    {/* Status Banner */}
                    <div className={`p-4 rounded-2xl flex items-center justify-between border transition-all ${
                        report.status === 'RESOLVED' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : 'bg-amber-50 border-amber-100 text-amber-600 shadow-lg shadow-amber-100/20'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${report.status === 'RESOLVED' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                <Info size={18} />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest">
                                {report.status === 'RESOLVED' ? "Đã xử lý (RESOLVED)" : "Đang chờ xử lý (PENDING)"}
                            </span>
                        </div>
                        <span className="text-[10px] font-black opacity-40 italic tracking-wider">{new Date(report.createdTime).toLocaleString("vi-VN")}</span>
                    </div>

                    {/* Report Content */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Thông tin báo cáo</p>
                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                <h3 className="text-lg font-black text-gray-800 mb-2 leading-tight">{report.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">{report.description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sender Info */}
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Người gửi báo cáo</p>
                                <div className="flex flex-col gap-4 bg-blue-50/30 p-5 rounded-3xl border border-blue-100/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0092B8]">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-800">{report.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">ID: {report.reporter?.userId}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                            <Mail size={14} className="text-[#0092B8]" /> {report.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                            <Phone size={14} className="text-[#0092B8]" /> {report.phoneNumber}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                            <Calendar size={14} className="text-[#0092B8]" /> Tham gia: {new Date(report.reporter?.joinedAt).toLocaleDateString("vi-VN")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Metadata if any */}
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Thông tin hệ thống</p>
                                <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100 space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Loại tài khoản</span>
                                        <span className="text-xs font-black text-[#0092B8] bg-white px-2.5 py-1 rounded-lg border border-gray-100 uppercase">{report.reporter?.role}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Trạng thái user</span>
                                        <span className="text-xs font-black text-green-600 bg-white px-2.5 py-1 rounded-lg border border-gray-100 uppercase">{report.reporter?.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                {(!report.status || report.status === "PENDING") && (
                    <div className="p-8 border-t border-gray-100 bg-gray-50/30">
                        <button 
                            onClick={() => onResolve(report.reportId)}
                            className="w-full flex items-center justify-center gap-3 py-4 text-sm font-black text-white bg-[#0092B8] hover:bg-[#007a99] rounded-2xl transition-all shadow-lg shadow-[#0092B8]/20"
                        >
                            <CheckCircle size={20} /> Đánh dấu đã xử lý
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
