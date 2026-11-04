import type { ReportResolution } from "../../../../types/report.types";
import { formatReportDate } from "../reportDisplay";
import { ReportLevelBadge } from "./ReportBadges";

/** Kết quả của đơn đã đóng — thay cho form xử lý. */
export default function ReportResolutionCard({ resolution }: { resolution: ReportResolution }) {
    const isResolved = resolution.result === "RESOLVED";

    return (
        <section aria-labelledby="resolution-title" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 text-sm">
            <h2 id="resolution-title" className="text-xs font-bold uppercase tracking-wide text-gray-500">Kết quả xử lý</h2>
            <p className="font-bold text-gray-800">{isResolved ? "Đã giải quyết" : "Đã bác bỏ"}</p>
            {resolution.level && <p className="flex items-center gap-2 text-gray-600">Mức độ: <ReportLevelBadge level={resolution.level} /></p>}
            <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-700">
                <p className="text-xs font-bold text-gray-500 mb-1">Phản hồi gửi người báo cáo</p>
                {resolution.response}
            </div>
            <p className="text-xs text-gray-400">{resolution.handledBy} · {formatReportDate(resolution.resolvedAt)}</p>
        </section>
    );
}
