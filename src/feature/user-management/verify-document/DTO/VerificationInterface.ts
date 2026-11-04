/**
 * Khớp backend §6 (2026-10-22): Admin duyệt CẢ HỒ SƠ xác minh tổ chức (1 hồ sơ = nhiều file).
 * GET /admin/verification-documents?status&page&size | /{id}.
 */
export type DocumentType = "ESTABLISHMENT_DECISION" | "BUSINESS_LICENSE" | "REPRESENTATIVE_ID" | "AUTHORIZATION_LETTER" | "OTHER";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type OrganizationType = "STUDENT_ORG" | "COMPANY" | "NGO";

export interface VerificationFile {
    documentType: DocumentType;
    fileId: string;
    fileUrl: string;
    originalFileName: string | null;
}

export interface VerificationProfile {
    id: string;
    userId: string;
    organizationName: string | null;
    organizationEmail: string | null;
    organizationType: OrganizationType | null;
    files: VerificationFile[];
    status: VerificationStatus;
    rejectReason: string | null;
    reviewedAt: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface VerificationListParams {
    status?: VerificationStatus;
    page: number;
    size: number;
}

/** Độ dài tối đa lý do từ chối — khớp backend (≤1000). */
export const REJECT_REASON_MAX_LENGTH = 1000;

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
    ESTABLISHMENT_DECISION: "Quyết định thành lập / văn bản công nhận",
    BUSINESS_LICENSE: "Giấy chứng nhận đăng ký kinh doanh",
    REPRESENTATIVE_ID: "CCCD / thẻ người đại diện",
    AUTHORIZATION_LETTER: "Giấy giới thiệu / ủy quyền",
    OTHER: "Giấy tờ khác",
};

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
    STUDENT_ORG: "Tổ chức sinh viên",
    COMPANY: "Doanh nghiệp",
    NGO: "Tổ chức phi lợi nhuận",
};

export const VERIFICATION_STATUS_META: Record<VerificationStatus, { label: string; className: string }> = {
    PENDING: { label: "Chờ duyệt", className: "bg-amber-50 text-amber-700 border-amber-200" },
    APPROVED: { label: "Đã duyệt", className: "bg-green-50 text-green-700 border-green-200" },
    REJECTED: { label: "Từ chối", className: "bg-red-50 text-red-600 border-red-200" },
};

/** Giấy tờ bắt buộc theo loại tổ chức (mỗi loại đúng 1 file) — để Admin thấy hồ sơ đủ / thiếu. */
export const REQUIRED_DOCUMENTS: Record<OrganizationType, DocumentType[]> = {
    STUDENT_ORG: ["ESTABLISHMENT_DECISION", "REPRESENTATIVE_ID"],
    COMPANY: ["BUSINESS_LICENSE", "REPRESENTATIVE_ID"],
    NGO: ["ESTABLISHMENT_DECISION", "REPRESENTATIVE_ID"],
};

export function getMissingDocuments(profile: VerificationProfile): DocumentType[] {
    if (!profile.organizationType) return [];
    const submitted = new Set(profile.files.map((f) => f.documentType));
    return REQUIRED_DOCUMENTS[profile.organizationType].filter((type) => !submitted.has(type));
}

export const getDocumentTypeLabel = (type: string): string =>
    DOCUMENT_TYPE_LABELS[type as DocumentType] ?? (type || "Tài liệu");

export const getOrganizationTypeLabel = (type: string | null): string =>
    (type && ORGANIZATION_TYPE_LABELS[type as OrganizationType]) || "Chưa chọn loại";

/** Chỉ mở link https — chặn javascript:/data: URL (react-security §Unsafe URL Schemes). */
export const safeHttpsUrl = (url: string): string | undefined => {
    try {
        return new URL(url).protocol === "https:" ? url : undefined;
    } catch {
        return undefined;
    }
};

const IMAGE_EXTENSION = /\.(png|jpe?g|webp|gif)$/i;

export const isImageFile = (file: VerificationFile): boolean =>
    IMAGE_EXTENSION.test(file.originalFileName ?? "") || IMAGE_EXTENSION.test(file.fileUrl.split("?")[0]);
