import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Toast from "../../../components/common/Toast";
import { getErrorMessage } from "../../../services/apiError";
import { AccountApi } from "../../../services/user-management/AccountApi";
import { REPORTS_QUERY_KEY, ReportsApi } from "../../../services/user-management/ReportsApi";
import type { RejectReportBody, ResolveReportBody } from "../../../types/report.types";
import { ReportLevelBadge, ReportStatusBadge } from "../../../feature/user-management/report/components/ReportBadges";
import ReportEvidenceViewer from "../../../feature/user-management/report/components/ReportEvidenceViewer";
import ReportHandleForm from "../../../feature/user-management/report/components/ReportHandleForm";
import ReportResolutionCard from "../../../feature/user-management/report/components/ReportResolutionCard";
import ReportTargetCard from "../../../feature/user-management/report/components/ReportTargetCard";
import { REPORTER_ROLE_LABELS, formatReportDate, formatReportId } from "../../../feature/user-management/report/reportDisplay";

const TOAST_DURATION_MS = 3000;
const ACCOUNT_QUERY_KEYS = ["users_list", "user_stats_dashboard", "user_detail", "org_detail"];

/** Chi tiết báo cáo vi phạm: trái là nội dung + minh chứng, phải là đối tượng + form xử lý. */
export default function ReportDetailPage() {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const { data: report, isLoading, error } = useQuery({
        queryKey: [...REPORTS_QUERY_KEY, "detail", id],
        queryFn: () => ReportsApi.get(id),
    });

    const notify = (msg: string) => {
        setToast({ msg, ok: true });
        setTimeout(() => setToast(null), TOAST_DURATION_MS);
    };

    // Lỗi 422 / 409 cũng làm mới, để đơn vừa bị người khác đóng hiện đúng trạng thái
    const refresh = () => queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
    const resolve = useMutation({ mutationFn: (body: ResolveReportBody) => ReportsApi.resolve(id, body), onSettled: refresh });
    const reject = useMutation({ mutationFn: (body: RejectReportBody) => ReportsApi.reject(id, body), onSettled: refresh });
    const block = useMutation({
        mutationFn: (accountUserId: string) => AccountApi.block(accountUserId),
        onSettled: () => {
            refresh();
            ACCOUNT_QUERY_KEYS.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
        },
    });

    if (isLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#0092B8] animate-spin" /></div>;
    }
    if (error || !report) {
        return <p role="alert" className="px-6 py-16 text-center text-sm font-medium text-red-500">{getErrorMessage(error, "Không tải được báo cáo")}</p>;
    }

    return (
        <div className="flex flex-col gap-6 pb-12">
            <Toast toast={toast} onClose={() => setToast(null)} />

            <header className="flex items-start gap-4">
                <button type="button" onClick={() => navigate("/user-management/report")} aria-label="Về danh sách báo cáo" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col gap-2 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-800">{report.title}</h1>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>{formatReportId(report.id)}</span>
                        <ReportStatusBadge status={report.status} />
                        <ReportLevelBadge level={report.level} />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                    <section aria-labelledby="content-title" className="flex flex-col gap-2">
                        <h2 id="content-title" className="text-xs font-bold uppercase tracking-wide text-gray-500">Nội dung báo cáo</h2>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{report.content}</p>
                        <p className="text-xs text-gray-400">
                            {report.reporter.displayName} ({REPORTER_ROLE_LABELS[report.reporter.role]}) · Gửi lúc {formatReportDate(report.submittedAt)}
                        </p>
                    </section>
                    <ReportEvidenceViewer evidences={report.evidences} />
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <ReportTargetCard
                        report={report}
                        onBlock={async () => {
                            await block.mutateAsync(report.target.accountUserId);
                            notify("Đã khóa tài khoản");
                        }}
                    />
                    {report.resolution ? (
                        <ReportResolutionCard resolution={report.resolution} />
                    ) : (
                        <ReportHandleForm
                            onResolve={async (body) => {
                                await resolve.mutateAsync(body);
                                notify("Đã giải quyết báo cáo");
                            }}
                            onReject={async (body) => {
                                await reject.mutateAsync(body);
                                notify("Đã bác bỏ báo cáo");
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
