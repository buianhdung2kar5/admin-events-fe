import { useState } from "react";
import { X, Users, Award, Trophy, Briefcase, Hash, FileText, ChevronDown } from "lucide-react";
import { Recruitment, RecruitmentStatus } from "../data/RecruitmentMockData";

interface Props {
    recruitment: Recruitment;
    onClose: () => void;
    onStatusChange: (id: string, status: RecruitmentStatus) => void;
}

export default function RecruitmentDetailPanel({ recruitment, onClose, onStatusChange }: Props) {
    const [isConfirmingClose, setIsConfirmingClose] = useState(false);

    const statusStyle = recruitment.status === "OPEN"
        ? "bg-green-50 text-green-600 border-green-200"
        : "bg-gray-100 text-gray-500 border-gray-200";

    const fillRate = recruitment.quantity > 0 ? Math.round((recruitment.approvedCount / recruitment.quantity) * 100) : 0;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
                    <div className="flex flex-col gap-2 pr-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase border self-start ${statusStyle}`}>
                            {recruitment.status === "OPEN" ? "Đang mở" : "Đã đóng"}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 leading-tight">{recruitment.role}</h2>
                        <p className="text-sm text-gray-500 font-medium">{recruitment.eventTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors shrink-0">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-gray-50">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1 shadow-sm text-center">
                            <span className="text-2xl font-black text-[#0092B8]">{recruitment.appliedCount}</span>
                            <span className="text-xs text-gray-500 font-medium">Đơn nộp</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1 shadow-sm text-center">
                            <span className="text-2xl font-black text-green-600">{recruitment.approvedCount}</span>
                            <span className="text-xs text-gray-500 font-medium">Đã duyệt</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1 shadow-sm text-center">
                            <span className="text-2xl font-black text-gray-700">{recruitment.quantity}</span>
                            <span className="text-xs text-gray-500 font-medium">Chỉ tiêu</span>
                        </div>
                    </div>

                    {/* Fill Rate */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-center text-sm font-semibold">
                            <span className="text-gray-700">Tỷ lệ lấp đầy chỉ tiêu</span>
                            <span className={`font-bold ${fillRate >= 100 ? "text-green-600" : "text-[#0092B8]"}`}>{fillRate}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${fillRate >= 100 ? "bg-green-500" : "bg-[#0092B8]"}`} style={{ width: `${Math.min(fillRate, 100)}%` }} />
                        </div>
                        <p className="text-xs text-gray-400">Đã duyệt {recruitment.approvedCount}/{recruitment.quantity} vị trí CTV</p>
                    </div>

                    {/* Details */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Chi tiết bài tuyển</h3>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-xl text-[#0092B8] shrink-0"><FileText size={16} /></div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-500 uppercase">Mô tả công việc</span>
                                <p className="text-sm text-gray-700 leading-relaxed">{recruitment.description}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-50 rounded-xl text-green-500 shrink-0"><Award size={16} /></div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-500 uppercase">Quyền lợi</span>
                                <p className="text-sm text-gray-700">{recruitment.reward}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-50 rounded-xl text-amber-500 shrink-0"><Trophy size={16} /></div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-500 uppercase">Chứng nhận</span>
                                <p className="text-sm font-semibold text-[#0092B8]">{recruitment.certificateName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 rounded-xl text-purple-500 shrink-0"><Hash size={16} /></div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-500 uppercase">Vai trò</span>
                                <p className="text-sm font-bold text-gray-800">{recruitment.role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white">
                    {recruitment.status === "OPEN" ? (
                        !isConfirmingClose ? (
                            <button onClick={() => setIsConfirmingClose(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-red-200 hover:text-red-500 transition-all">
                                <ChevronDown size={16} /> Đóng đợt tuyển
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <p className="flex-1 text-sm font-medium text-gray-600">Xác nhận đóng đợt tuyển này?</p>
                                <button onClick={() => setIsConfirmingClose(false)} className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
                                <button onClick={() => { onStatusChange(recruitment.id, "CLOSED"); setIsConfirmingClose(false); onClose(); }} className="px-5 py-2 text-sm font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm">Đóng</button>
                            </div>
                        )
                    ) : (
                        <button onClick={() => onStatusChange(recruitment.id, "OPEN")} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-green-200 text-sm font-bold text-green-600 hover:bg-green-50 transition-all">
                            Mở lại đợt tuyển
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
