import type {
    ReportLevel,
    ReportStatus,
    ReportTargetType,
    ReporterRole,
} from "../../../types/report.types";

const SHORT_ID_LENGTH = 8;

export const REPORT_STATUS_META: Record<ReportStatus, { label: string; className: string }> = {
    PENDING: { label: "Chờ xử lý", className: "bg-amber-50 text-amber-700 border-amber-200" },
    RESOLVED: { label: "Đã giải quyết", className: "bg-green-50 text-green-700 border-green-200" },
    REJECTED: { label: "Bác bỏ", className: "bg-gray-100 text-gray-600 border-gray-200" },
};

export const REPORT_LEVEL_META: Record<ReportLevel, { label: string; className: string }> = {
    LOW: { label: "Thấp", className: "bg-slate-50 text-slate-600 border-slate-200" },
    MEDIUM: { label: "Trung bình", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    HIGH: { label: "Cao", className: "bg-orange-50 text-orange-700 border-orange-200" },
    CRITICAL: { label: "Nghiêm trọng", className: "bg-red-50 text-red-700 border-red-200" },
};

export const REPORT_TARGET_LABELS: Record<ReportTargetType, string> = {
    USER: "Người dùng",
    ORGANIZATION: "Tổ chức",
    EVENT: "Sự kiện",
};

export const REPORTER_ROLE_LABELS: Record<ReporterRole, string> = {
    USER: "Người dùng",
    ORGANIZATION: "Tổ chức",
};

/** id là UUID — chỉ hiện phần đầu cho gọn. */
export const formatReportId = (id: string): string => `#${id.slice(0, SHORT_ID_LENGTH)}`;

export const formatReportDate = (iso: string): string =>
    new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
