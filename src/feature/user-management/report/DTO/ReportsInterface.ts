export interface ReporterInfo {
    userId: number;
    fullName: string | null;
    avatarUrl: string | null;
    role: string;
    status: string;
    joinedAt: string;
}

export type ReportStatus = "PENDING" | "RESOLVED";

export interface ReportItem {
    reportId: number;
    reporter: ReporterInfo;
    name: string;
    email: string;
    phoneNumber: string;
    title: string;
    description: string;
    createdTime: string;
    // Note: status field is missing from the provided snippet, 
    // assuming it might be added later or we use a fallback.
    status?: ReportStatus; 
}

export interface ReportResponse {
    content: ReportItem[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
