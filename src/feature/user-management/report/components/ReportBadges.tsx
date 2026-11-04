import type { ReportLevel, ReportStatus } from "../../../../types/report.types";
import { REPORT_LEVEL_META, REPORT_STATUS_META } from "../reportDisplay";

const BADGE = "inline-block px-2.5 py-1 rounded-lg border text-[11px] font-bold whitespace-nowrap";

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
    const meta = REPORT_STATUS_META[status];
    return <span className={`${BADGE} ${meta.className}`}>{meta.label}</span>;
}

export function ReportLevelBadge({ level }: { level: ReportLevel | null }) {
    if (!level) return <span className="text-xs text-gray-400">Chưa chấm</span>;
    const meta = REPORT_LEVEL_META[level];
    return <span className={`${BADGE} ${meta.className}`}>{meta.label}</span>;
}
