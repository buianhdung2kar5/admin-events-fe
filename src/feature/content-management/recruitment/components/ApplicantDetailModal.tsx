import { useState } from "react";
import { X, User, Mail, Phone, BookOpen, School, FileText, Check, XCircle, ChevronRight } from "lucide-react";
import { Applicant, ApplicationStatus } from "../data/RecruitmentMockData";

interface Props {
    applicant: Applicant;
    onClose: () => void;
    onStatusChange: (id: string, status: ApplicationStatus) => void;
}

export default function ApplicantDetailModal({ applicant, onClose, onStatusChange }: Props) {
    const [activeTab, setActiveTab] = useState<"info" | "answers">("info");

    const statusStyle: Record<ApplicationStatus, string> = {
        PENDING: "bg-amber-50 text-amber-600 border-amber-200",
        APPROVED: "bg-green-50 text-green-600 border-green-200",
        REJECTED: "bg-red-50 text-red-500 border-red-200"
    };
    const statusLabel: Record<ApplicationStatus, string> = {
        PENDING: "Chờ duyệt", APPROVED: "Đã duyệt", REJECTED: "Từ chối"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={applicant.avatarUrl} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-100 bg-gray-50" />
                        <div className="flex flex-col gap-1">
                            <h2 className="text-lg font-bold text-gray-800">{applicant.name}</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="font-mono text-xs bg-gray-50 px-2 py-0.5 rounded-lg border">{applicant.studentId}</span>
                                <span>{applicant.school}</span>
                            </div>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase border self-start ${statusStyle[applicant.status]}`}>
                                {statusLabel[applicant.status]}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors shrink-0">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6 bg-white">
                    {[
                        { id: "info", label: "Thông tin ứng viên", icon: <User size={15} /> },
                        { id: "answers", label: "Câu trả lời", icon: <FileText size={15} /> }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                                activeTab === tab.id ? "border-[#0092B8] text-[#0092B8]" : "border-transparent text-gray-500 hover:text-gray-800"
                            }`}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {activeTab === "info" && (
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <InfoRow icon={<Mail size={15} />} label="Email" value={applicant.email} />
                                <InfoRow icon={<Phone size={15} />} label="Điện thoại" value={applicant.phone} />
                                <InfoRow icon={<School size={15} />} label="Trường" value={applicant.school} />
                                <InfoRow icon={<BookOpen size={15} />} label="Ngành học" value={applicant.major} />
                                <InfoRow icon={<User size={15} />} label="MSSV" value={applicant.studentId} />
                                <InfoRow icon={<FileText size={15} />} label="Ngày nộp" value={new Date(applicant.appliedAt).toLocaleString("vi-VN")} />
                            </div>

                            {/* CV */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-red-50 rounded-xl text-red-500"><FileText size={18} /></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">CV / Hồ sơ đính kèm</span>
                                        <span className="text-xs text-gray-400">cv_{applicant.studentId}.pdf</span>
                                    </div>
                                </div>
                                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#0092B8] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100">
                                    Xem CV <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "answers" && (
                        <div className="flex flex-col gap-4">
                            {applicant.answers.length === 0 ? (
                                <div className="py-12 text-center text-sm text-gray-400 font-medium">
                                    Ứng viên này không có câu trả lời nào
                                </div>
                            ) : (
                                applicant.answers.map((ans, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-[#0092B8]/10 text-[#0092B8] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                                            <p className="text-sm font-bold text-gray-700">{ans.question}</p>
                                        </div>
                                        <div className="ml-9 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-sm text-gray-700 leading-relaxed">{ans.answer}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {applicant.status === "PENDING" && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3">
                        <button
                            onClick={() => { onStatusChange(applicant.id, "REJECTED"); onClose(); }}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors"
                        >
                            <XCircle size={16} /> Từ chối
                        </button>
                        <button
                            onClick={() => { onStatusChange(applicant.id, "APPROVED"); onClose(); }}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors shadow-sm"
                        >
                            <Check size={16} /> Duyệt đơn
                        </button>
                    </div>
                )}
                {applicant.status === "APPROVED" && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end">
                        <button
                            onClick={() => { onStatusChange(applicant.id, "REJECTED"); onClose(); }}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors"
                        >
                            <XCircle size={16} /> Thu hồi duyệt
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="text-gray-400 shrink-0">{icon}</div>
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</span>
                <span className="text-sm font-semibold text-gray-800 truncate">{value}</span>
            </div>
        </div>
    );
}
