import { useQuery } from "@tanstack/react-query";
import { RecruitmentApi } from "../../../services/events-management/Recruitments";
import { CalendarDays, Building2, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewJobCard() {
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ["dashboard_recruitments"],
        queryFn: () => RecruitmentApi.getAllRecruitment(0, 5, ["createdTime,desc"]),
    });

    const jobs: any[] = data?.object?.content || [];

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-5 h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Briefcase size={20} className="text-[#0092B8]" />
                    <h3 className="text-xl font-bold text-gray-800">Đợt tuyển CTV mới nhất</h3>
                </div>
                <span
                    onClick={() => navigate("/content-management/recruitment")}
                    className="text-xs font-semibold text-[#0092B8] bg-[#EFF9FC] px-3 py-1 rounded-full cursor-pointer hover:opacity-80 transition"
                >
                    Xem tất cả
                </span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[40px_1fr_auto] gap-x-3 px-2 pb-1 border-b border-gray-100">
                <span />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Sự kiện / Vai trò</span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Trạng thái</span>
            </div>

            {/* Job rows */}
            {isLoading ? (
                <div className="flex flex-col gap-3 animate-pulse">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="grid grid-cols-[40px_1fr_auto] items-center gap-x-3 px-2 py-2">
                            <div className="w-10 h-10 rounded-xl bg-gray-100" />
                            <div className="flex flex-col gap-1">
                                <div className="h-3 bg-gray-100 rounded w-3/4" />
                                <div className="h-2 bg-gray-50 rounded w-1/2" />
                            </div>
                            <div className="w-14 h-5 bg-gray-100 rounded-full" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {jobs.map((job) => (
                        <div
                            key={job.ctvRecruitmentId}
                            className="grid grid-cols-[40px_1fr_auto] items-center gap-x-3 px-2 py-2.5 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            {/* Banner thumbnail */}
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                                {job.banner ? (
                                    <img src={job.banner} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/40x40/f3f4f6/a1a1aa?text=CTV"; }} />
                                ) : (
                                    <Building2 size={18} className="text-gray-300" />
                                )}
                            </div>

                            {/* Title + Role */}
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-gray-800 truncate">{job.title}</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <CalendarDays size={11} className="text-gray-400 flex-shrink-0" />
                                    <span className="text-xs text-gray-400 truncate">{job.roleName}</span>
                                </div>
                            </div>

                            {/* Status badge */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${job.isOpen ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-100"}`}>
                                {job.isOpen ? "Đang mở" : "Đã đóng"}
                            </span>
                        </div>
                    ))}
                    {jobs.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">Chưa có đợt tuyển nào</p>
                    )}
                </div>
            )}
        </div>
    );
}
