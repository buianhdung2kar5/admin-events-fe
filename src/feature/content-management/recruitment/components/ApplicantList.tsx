import { useState } from "react";
import { ArrowLeft, Eye, Check, XCircle, Search, X } from "lucide-react";
import { Applicant, ApplicationStatus, MockApplicants, Recruitment } from "../data/RecruitmentMockData";
import ApplicantDetailModal from "./ApplicantDetailModal";

interface Props {
    recruitment: Recruitment;
    onBack: () => void;
}

const STATUS_STYLES: Record<ApplicationStatus, string> = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    APPROVED: "bg-green-50 text-green-600 border-green-200",
    REJECTED: "bg-red-50 text-red-500 border-red-200"
};
const STATUS_LABELS: Record<ApplicationStatus, string> = {
    PENDING: "Chờ duyệt", APPROVED: "Đã duyệt", REJECTED: "Từ chối"
};

export default function ApplicantList({ recruitment, onBack }: Props) {
    const [applicants, setApplicants] = useState<Applicant[]>(
        MockApplicants.filter(a => a.recruitmentId === recruitment.id)
    );
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "ALL">("ALL");
    const [search, setSearch] = useState("");

    const handleStatusChange = (id: string, status: ApplicationStatus) => {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    };

    const filtered = applicants.filter(a => {
        const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
        const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase()) ||
            a.studentId.includes(search);
        return matchStatus && matchSearch;
    });

    const counts = {
        ALL: applicants.length,
        PENDING: applicants.filter(a => a.status === "PENDING").length,
        APPROVED: applicants.filter(a => a.status === "APPROVED").length,
        REJECTED: applicants.filter(a => a.status === "REJECTED").length,
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Back Header */}
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-bold text-gray-800">Đơn ứng tuyển — {recruitment.role}</h2>
                    <p className="text-sm text-gray-500">{recruitment.eventTitle}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                            filterStatus === s
                                ? "bg-[#0092B8] text-white border-[#0092B8] shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}>
                        {s === "ALL" ? "Tất cả" : STATUS_LABELS[s]}
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${filterStatus === s ? "bg-white/20" : "bg-gray-100"}`}>
                            {counts[s]}
                        </span>
                    </button>
                ))}

                {/* Search */}
                <div className="ml-auto flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#0092B8] transition-all">
                    <Search size={15} className="text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm ứng viên..."
                        className="text-sm outline-none bg-transparent w-44 placeholder:text-gray-400"
                    />
                    {search && <button onClick={() => setSearch("")}><X size={14} className="text-gray-400 hover:text-gray-600" /></button>}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 font-semibold tracking-wider">
                        <tr>
                            <th className="px-5 py-4">Ứng viên</th>
                            <th className="px-5 py-4">Liên hệ</th>
                            <th className="px-5 py-4">Trường / Ngành</th>
                            <th className="px-5 py-4 text-center">Trả lời</th>
                            <th className="px-5 py-4 text-center">Trạng thái</th>
                            <th className="px-5 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-16 text-center text-sm text-gray-400 font-medium">
                                    Không có đơn ứng tuyển nào
                                </td>
                            </tr>
                        ) : (
                            filtered.map(a => (
                                <tr key={a.id} className="hover:bg-blue-50/20 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={a.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-100 bg-gray-50" />
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-gray-800">{a.name}</span>
                                                <span className="text-xs font-mono text-gray-400">{a.studentId}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                                            <span>{a.email}</span>
                                            <span>{a.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col gap-0.5 text-xs text-gray-600 max-w-[180px]">
                                            <span className="font-semibold truncate">{a.school}</span>
                                            <span className="text-gray-400 truncate">{a.major}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="text-sm font-bold text-gray-700">{a.answers.length}</span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLES[a.status]}`}>
                                            {STATUS_LABELS[a.status]}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setSelectedApplicant(a)} className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-xl transition-all" title="Xem chi tiết">
                                                <Eye size={16} />
                                            </button>
                                            {a.status === "PENDING" && (
                                                <>
                                                    <button onClick={() => handleStatusChange(a.id, "APPROVED")} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Duyệt">
                                                        <Check size={16} />
                                                    </button>
                                                    <button onClick={() => handleStatusChange(a.id, "REJECTED")} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Từ chối">
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Applicant Detail Modal */}
            {selectedApplicant && (
                <ApplicantDetailModal
                    applicant={selectedApplicant}
                    onClose={() => setSelectedApplicant(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}
