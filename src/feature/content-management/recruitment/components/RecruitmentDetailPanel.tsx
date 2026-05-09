import { useState } from "react";
import {
    X, Award, Trophy, Hash, FileText, ChevronDown, ChevronUp,
    MapPin, Building2, DollarSign, Star, Coins, Users,
    HelpCircle, CheckCircle2, ListChecks, AlignLeft, Calendar
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { RecruitmentApi } from "../../../../services/events-management/Recruitments";
import { RecruitmentDetail } from "../data/RecruitmentMockData";

interface Props {
    recruitmentId: number;
    onClose: () => void;
    onToggleStatus: (id: number) => Promise<void>;
}

export default function RecruitmentDetailPanel({ recruitmentId, onClose, onToggleStatus }: Props) {
    const [isConfirmingToggle, setIsConfirmingToggle] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const { data: response, isLoading, isError } = useQuery<{ object: RecruitmentDetail }>({
        queryKey: ["recruitment-detail", recruitmentId],
        queryFn: () => RecruitmentApi.getRecruitmentById(String(recruitmentId)),
    });

    const r = response?.object;

    const statusStyle = r?.isOpen
        ? "bg-green-50 text-green-600 border-green-200"
        : "bg-gray-100 text-gray-500 border-gray-200";

    const fillRate = r && r.quantity > 0
        ? Math.round((r.recruitedCtvCount / r.quantity) * 100)
        : 0;

    const formatCurrency = (amount: number) =>
        amount > 0 ? amount.toLocaleString("vi-VN") + " đ" : "Không có";

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

    const questionTypeLabel = (type: string) => {
        if (type === "SINGLECHOICE") return { label: "1 lựa chọn", icon: <CheckCircle2 size={12} /> };
        if (type === "MULTIPLECHOICE") return { label: "Nhiều lựa chọn", icon: <ListChecks size={12} /> };
        return { label: "Văn bản", icon: <AlignLeft size={12} /> };
    };

    const handleToggle = async () => {
        if (!r) return;
        setIsToggling(true);
        await onToggleStatus(recruitmentId);
        setIsToggling(false);
        setIsConfirmingToggle(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
                    <div className="flex flex-col gap-2 pr-6">
                        {isLoading ? (
                            <div className="flex flex-col gap-2">
                                <div className="w-16 h-5 bg-gray-100 rounded-lg animate-pulse" />
                                <div className="w-48 h-6 bg-gray-100 rounded-lg animate-pulse" />
                                <div className="w-32 h-4 bg-gray-100 rounded-lg animate-pulse" />
                            </div>
                        ) : r ? (
                            <>
                                <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase border self-start ${statusStyle}`}>
                                    {r.isOpen ? "Đang mở" : "Đã đóng"}
                                </div>
                                <h2 className="text-lg font-bold text-gray-800 leading-tight">{r.roleName}</h2>
                                <p className="text-sm text-gray-500 font-medium">{r.title}</p>
                            </>
                        ) : null}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors shrink-0">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-gray-50">
                    {isLoading && (
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
                                    <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
                                    <div className="w-full h-12 bg-gray-100 rounded-xl animate-pulse" />
                                </div>
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center text-sm text-red-400 font-medium">
                            Không thể tải chi tiết. Vui lòng thử lại.
                        </div>
                    )}

                    {!isLoading && !isError && r && (
                        <>
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1 shadow-sm text-center">
                                    <span className="text-2xl font-black text-[#0092B8]">{r.appliedCount}</span>
                                    <span className="text-xs text-gray-500 font-medium">Đơn nộp</span>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1 shadow-sm text-center">
                                    <span className="text-2xl font-black text-green-600">{r.recruitedCtvCount}</span>
                                    <span className="text-xs text-gray-500 font-medium">Đã tuyển</span>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1 shadow-sm text-center">
                                    <span className="text-2xl font-black text-gray-700">{r.quantity}</span>
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
                                    <div
                                        className={`h-full rounded-full transition-all ${fillRate >= 100 ? "bg-green-500" : "bg-[#0092B8]"}`}
                                        style={{ width: `${Math.min(fillRate, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400">Đã tuyển {r.recruitedCtvCount}/{r.quantity} CTV</p>
                            </div>

                            {/* Thông tin cơ bản */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Thông tin đợt tuyển</h3>

                                {/* Organizer */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-xl text-[#0092B8] shrink-0"><Building2 size={16} /></div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Ban tổ chức</span>
                                        <p className="text-sm text-gray-700 font-medium">{r.organizerName}</p>
                                    </div>
                                </div>

                                {/* Start time */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500 shrink-0"><Calendar size={16} /></div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Thời gian diễn ra</span>
                                        <p className="text-sm text-gray-700 font-medium">{formatDate(r.startTime)}</p>
                                    </div>
                                </div>

                                {/* Venue */}
                                {r.venue && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-rose-50 rounded-xl text-rose-500 shrink-0"><MapPin size={16} /></div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Địa điểm</span>
                                            <p className="text-sm font-semibold text-gray-800">{r.venue.name}</p>
                                            <p className="text-xs text-gray-400">{r.venue.address}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Role */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 rounded-xl text-purple-500 shrink-0"><Hash size={16} /></div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Vai trò CTV</span>
                                        <p className="text-sm font-bold text-gray-800">{r.roleName}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-cyan-50 rounded-xl text-cyan-500 shrink-0"><FileText size={16} /></div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Mô tả công việc</span>
                                        <p className="text-sm text-gray-700 leading-relaxed">{r.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quyền lợi */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Quyền lợi CTV</h3>

                                <div className="grid grid-cols-1 gap-3">
                                    {r.cashRewardAmount > 0 && (
                                        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600"><DollarSign size={14} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase">Thù lao</p>
                                                <p className="text-sm font-bold text-amber-700">{formatCurrency(r.cashRewardAmount)}</p>
                                            </div>
                                        </div>
                                    )}
                                    {r.youthUnionPoint > 0 && (
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                            <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600"><Star size={14} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase">Điểm Rèn luyện</p>
                                                <p className="text-sm font-bold text-purple-700">{r.youthUnionPoint} điểm</p>
                                            </div>
                                        </div>
                                    )}
                                    {r.rewardCoin > 0 && (
                                        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                                            <div className="p-1.5 bg-yellow-100 rounded-lg text-yellow-600"><Coins size={14} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase">Xu thưởng</p>
                                                <p className="text-sm font-bold text-yellow-700">{r.rewardCoin} xu</p>
                                            </div>
                                        </div>
                                    )}
                                    {r.certificateName && (
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                                            <div className="p-1.5 bg-green-100 rounded-lg text-green-600"><Trophy size={14} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase">Chứng nhận</p>
                                                <p className="text-sm font-semibold text-green-700">{r.certificateName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Câu hỏi */}
                            {r.requirementQuestions.length > 0 && (
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <HelpCircle size={15} className="text-gray-400" />
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Câu hỏi đơn ứng tuyển ({r.requirementQuestions.length})
                                        </h3>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {r.requirementQuestions.map((q, idx) => {
                                            const typeInfo = questionTypeLabel(q.questionType);
                                            return (
                                                <div key={q.questionId} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-semibold text-gray-700">
                                                            <span className="text-[#0092B8] mr-1">{idx + 1}.</span>
                                                            {q.questionText}
                                                            {q.isRequired && <span className="text-red-400 ml-1">*</span>}
                                                        </p>
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg whitespace-nowrap shrink-0">
                                                            {typeInfo.icon} {typeInfo.label}
                                                        </span>
                                                    </div>
                                                    {q.options.length > 0 && (
                                                        <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-gray-100">
                                                            {q.options.map(opt => (
                                                                <span key={opt.optionId} className="text-xs text-gray-500">• {opt.optionValue}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Categories */}
                            {r.categories.length > 0 && (
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Danh mục sự kiện</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {r.categories.map(cat =>
                                            cat.options.map(opt => (
                                                <span key={opt.categoryOptionId} className="text-xs font-semibold px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600">
                                                    {cat.name}: {opt.value}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Action */}
                {!isLoading && !isError && r && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-white">
                        {!isConfirmingToggle ? (
                            <button
                                onClick={() => setIsConfirmingToggle(true)}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                                    r.isOpen
                                        ? "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-red-200 hover:text-red-500"
                                        : "border-green-200 text-green-600 hover:bg-green-50"
                                }`}
                            >
                                {r.isOpen ? (
                                    <><ChevronDown size={16} /> Đóng đợt tuyển</>
                                ) : (
                                    <><ChevronUp size={16} /> Mở lại đợt tuyển</>
                                )}
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <p className="flex-1 text-sm font-medium text-gray-600">
                                    {r.isOpen ? "Xác nhận đóng đợt tuyển này?" : "Xác nhận mở lại đợt tuyển?"}
                                </p>
                                <button
                                    onClick={() => setIsConfirmingToggle(false)}
                                    className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleToggle}
                                    disabled={isToggling}
                                    className={`px-5 py-2 text-sm font-semibold rounded-xl text-white transition-colors shadow-sm disabled:opacity-60 ${
                                        r.isOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                    }`}
                                >
                                    {isToggling ? "Đang xử lý..." : r.isOpen ? "Đóng" : "Mở lại"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
