import { ShieldCheck, FileClock, FileCheck, ShieldAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { VerificationDocumentApi } from "../../../services/user-management/DocumentApi";
import { ReportsApi } from "../../../services/user-management/ReportsApi";
import { RecruitmentApi } from "../../../services/events-management/Recruitments";
import { EventsApi } from "../../../services/events-management/EventsApi";

export default function EmergencyCard() {
    const { data: pendingDocs,       isLoading: l1 } = useQuery({
        queryKey: ["dashboard_pending_docs"],
        queryFn: () => VerificationDocumentApi.getAllDocumentVerify(0, 1, [], "PENDING"),
    });
    const { data: pendingReports,    isLoading: l2 } = useQuery({
        queryKey: ["dashboard_pending_reports"],
        queryFn: () => ReportsApi.getAllReports(0, 1, undefined, "PENDING"),
    });
    const { data: draftEvents,       isLoading: l3 } = useQuery({
        queryKey: ["dashboard_draft_events"],
        queryFn: () => EventsApi.getAll(0, 1, undefined, undefined, "DRAFT"),
    });
    const { data: openRecruitments,  isLoading: l4 } = useQuery({
        queryKey: ["dashboard_open_recruitments"],
        queryFn: () => RecruitmentApi.getAllRecruitment(0, 1, []),
    });

    const cards = [
        {
            id: "authen",
            title: "Xác thực tài liệu chờ duyệt",
            number: pendingDocs?.object?.totalElements ?? 0,
            icon: ShieldCheck,
            colorText: "#0092B8",
            colorBorder: "#0092B8",
            colorBg: "#EFF9FC",
            colorIcon: "#0092B8",
            isLoading: l1,
        },
        {
            id: "report",
            title: "Báo cáo chưa xử lý",
            number: pendingReports?.data?.object?.totalElements ?? 0,
            icon: ShieldAlert,
            colorText: "#E7000B",
            colorBorder: "#FBBFC2",
            colorBg: "#FFF5F5",
            colorIcon: "#E7000B",
            isLoading: l2,
        },
        {
            id: "draft_events",
            title: "Sự kiện đang chờ duyệt",
            number: draftEvents?.object?.totalElements ?? 0,
            icon: FileClock,
            colorText: "#D08700",
            colorBorder: "#FFE08A",
            colorBg: "#FFFBEB",
            colorIcon: "#D08700",
            isLoading: l3,
        },
        {
            id: "open_recruitments",
            title: "Đợt tuyển CTV đang mở",
            number: openRecruitments?.object?.totalElements ?? 0,
            icon: FileCheck,
            colorText: "#6B7280",
            colorBorder: "#D1D5DB",
            colorBg: "#F9FAFB",
            colorIcon: "#6B7280",
            isLoading: l4,
        },
    ];

    return (
        <div className="flex flex-wrap gap-3 w-full">
            {cards.map((item) => {
                const Icon = item.icon;

                if (item.isLoading) {
                    return (
                        <div
                            key={item.id}
                            style={{ border: `1.5px solid ${item.colorBorder}`, backgroundColor: item.colorBg }}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-1 min-w-[160px] animate-pulse"
                        >
                            {/* Icon placeholder */}
                            <div
                                className="w-6 h-6 rounded-full flex-shrink-0 opacity-30"
                                style={{ backgroundColor: item.colorIcon }}
                            />
                            <div className="flex flex-col gap-1.5 flex-1">
                                <div className="h-2.5 rounded bg-gray-200 w-3/4" />
                                <div className="h-6 rounded-lg w-10" style={{ backgroundColor: item.colorBorder, opacity: 0.25 }} />
                            </div>
                        </div>
                    );
                }

                return (
                    <div
                        key={item.id}
                        style={{ border: `1.5px solid ${item.colorBorder}`, backgroundColor: item.colorBg }}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-1 min-w-[160px] transition-all"
                    >
                        <Icon size={22} style={{ color: item.colorIcon }} className="flex-shrink-0" />
                        <div className="flex flex-col leading-tight">
                            <span style={{ color: "#6B7280" }} className="text-xs font-medium leading-snug">
                                {item.title}
                            </span>
                            <span style={{ color: item.colorText }} className="text-xl font-bold mt-0.5">
                                {item.number}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}