/** Khớp backend VerificationDocumentResponse (GET /admin/verification-documents?status= | /{id}). */
export type DocumentType = "BUSINESS_LICENSE" | "UNIVERSITY_DECISION" | "CLUB_CERTIFICATE" | "TAX_CODE" | "OTHER";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface VerificationDocument {
    verificationDocumentId: string;
    /** Tài khoản tổ chức đã nộp — backend chỉ trả id (không có tên/avatar) */
    userId: string;
    fileId: string;
    fileUrl: string;
    documentType: DocumentType;
    originalFileName: string | null;
    status: VerificationStatus;
    /** Lý do từ chối */
    note: string | null;
    createdAt: string;
}

/** Độ dài tối đa lý do từ chối — khớp @Size(max = 1000) của RejectDocumentRequest. */
export const REJECT_NOTE_MAX_LENGTH = 1000;

/** Chỉ mở link https — chặn javascript:/data: URL (react-security §Unsafe URL Schemes). */
export const safeHttpsUrl = (url: string): string | undefined => {
    try {
        return new URL(url).protocol === "https:" ? url : undefined;
    } catch {
        return undefined;
    }
};

export const getDocumentTypeLabel = (type: string) => {
    switch (type?.toUpperCase()) {
        case "BUSINESS_LICENSE":
            return "Giấy phép kinh doanh";
        case "CLUB_CERTIFICATE":
            return "Chứng nhận CLB / Hội nhóm";
        case "TAX_CODE":
            return "Mã số thuế";
        case "UNIVERSITY_DECISION":
            return "Quyết định của trường";
        case "OTHER":
            return "Khác";
        default:
            return type || "Tài liệu";
    }
};

export const getDocumentTypeStyle = (type: string) => {
    switch (type?.toUpperCase()) {
        case "BUSINESS_LICENSE":
            return "bg-blue-50 text-blue-600 border-blue-100";
        case "CLUB_CERTIFICATE":
            return "bg-purple-50 text-purple-600 border-purple-100";
        case "TAX_CODE":
            return "bg-amber-50 text-amber-600 border-amber-100";
        default:
            return "bg-gray-50 text-gray-600 border-gray-100";
    }
};
