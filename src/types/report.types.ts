/** Báo cáo vi phạm — theo docs/BACKEND_API_CONTRACT.md §14. */
export const REPORT_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export type ReportStatus = "PENDING" | "RESOLVED" | "REJECTED";
export type ReportTargetType = "USER" | "ORGANIZATION" | "EVENT";
export type ReportLevel = (typeof REPORT_LEVELS)[number];
export type ReporterRole = "USER" | "ORGANIZATION";
export type TargetAccountStatus = "ACTIVE" | "BLOCKED";

export interface ReportReporter {
    userId: string;
    displayName: string;
    role: ReporterRole;
}

export interface ReportListItem {
    id: string;
    title: string;
    reporter: ReportReporter;
    targetType: ReportTargetType;
    targetId: string;
    targetName: string;
    level: ReportLevel | null;
    status: ReportStatus;
    evidenceCount: number;
    submittedAt: string;
    handledBy: string | null;
}

export interface ReportEvidence {
    mediaId: string;
    fileUrl: string;
    fileName: string;
    contentType: string;
}

/** Tài khoản chịu xử lý — đối tượng EVENT thì là tổ chức sở hữu sự kiện. */
export interface ReportTarget {
    accountUserId: string;
    displayName: string;
    accountStatus: TargetAccountStatus;
    otherReportCount: number;
}

export interface ReportResolution {
    result: "RESOLVED" | "REJECTED";
    level: ReportLevel | null;
    response: string;
    handledBy: string;
    resolvedAt: string;
}

export interface ReportDetail extends ReportListItem {
    content: string;
    evidences: ReportEvidence[];
    target: ReportTarget;
    resolution: ReportResolution | null;
}

export interface ReportListParams {
    status?: ReportStatus;
    targetType?: ReportTargetType;
    level?: ReportLevel;
    keyword?: string;
    page: number;
    size: number;
}

export interface ResolveReportBody {
    response: string;
    level?: ReportLevel;
}

export interface RejectReportBody {
    response: string;
}
