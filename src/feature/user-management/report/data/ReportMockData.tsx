export type ReportCategory = "HARASSMENT" | "SPAM" | "ILLEGAL" | "FAKE" | "INAPPROPRIATE";
export type ReportTargetType = "USER" | "EVENT" | "MESSAGE" | "ORGANIZATION";
export type ReportStatus = "PENDING" | "RESOLVED";

export interface ReportItem {
    id: string;
    reporterId: string;
    reporterName: string;
    targetType: ReportTargetType;
    targetId: string;
    targetName: string; // The name of the user/event being reported
    reportCategory: ReportCategory;
    reason: string;
    description: string;
    status: ReportStatus;
    createdAt: string;
    resolvedAt?: string;
    resolvedBy?: string;
}

export const MockReports: ReportItem[] = [
    {
        id: "rep-001",
        reporterId: "u-101",
        reporterName: "Trần Văn A",
        targetType: "USER",
        targetId: "u-999",
        targetName: "Nguyễn Thị B (Kẻ gian lận)",
        reportCategory: "FAKE",
        reason: "Tài khoản giả mạo",
        description: "Người này sử dụng hình ảnh của tôi và nhắn tin lừa đảo người khác chuyển tiền mua vé.",
        status: "PENDING",
        createdAt: "2026-04-20T14:30:00Z"
    },
    {
        id: "rep-002",
        reporterId: "u-102",
        reporterName: "Lê Văn C",
        targetType: "EVENT",
        targetId: "evt-005",
        targetName: "Khóa học Đầu tư Crypto 5.0",
        reportCategory: "ILLEGAL",
        reason: "Sự kiện có dấu hiệu đa cấp",
        description: "Sự kiện này yêu cầu nạp tiền vào hệ thống không rõ nguồn gốc để nhận hoa hồng 500%.",
        status: "PENDING",
        createdAt: "2026-04-24T09:15:00Z"
    },
    {
        id: "rep-003",
        reporterId: "u-103",
        reporterName: "Phạm Thị D",
        targetType: "USER",
        targetId: "u-888",
        targetName: "Trương Văn E",
        reportCategory: "HARASSMENT",
        reason: "Quấy rối qua tin nhắn",
        description: "Người này liên tục gửi tin nhắn rác và lời lẽ xúc phạm tôi trong hệ thống chat sự kiện.",
        status: "RESOLVED",
        createdAt: "2026-04-18T20:00:00Z",
        resolvedAt: "2026-04-19T10:00:00Z",
        resolvedBy: "admin-01"
    }
];
