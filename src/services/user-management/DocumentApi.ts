import { http } from "../apiClient";
import type { VerificationDocument, VerificationStatus } from "../../feature/user-management/verify-document/DTO/VerificationInterface";

const BASE_PATH = "/admin/verification-documents";
export const PENDING_DOCS_QUERY_KEY = ["verification-documents", "pending"] as const;

/** Admin duyệt tài liệu xác minh tổ chức — chỉ thao tác được trên tài liệu PENDING. */
export const VerificationDocumentApi = {
    /** Tài liệu theo trạng thái — `status` bắt buộc (backend không phân trang) */
    getDocumentsByStatus(status: VerificationStatus): Promise<VerificationDocument[]> {
        return http.get<VerificationDocument[]>(BASE_PATH, { params: { status } });
    },

    /** Toàn bộ tài liệu đang chờ duyệt */
    getPendingDocuments(): Promise<VerificationDocument[]> {
        return VerificationDocumentApi.getDocumentsByStatus("PENDING");
    },

    getDocument(id: string): Promise<VerificationDocument> {
        return http.get<VerificationDocument>(`${BASE_PATH}/${id}`);
    },

    /** PENDING → APPROVED */
    approve(id: string): Promise<VerificationDocument> {
        return http.post<VerificationDocument>(`${BASE_PATH}/${id}/approve`);
    },

    /** PENDING → REJECTED kèm lý do (bắt buộc, ≤ 1000 ký tự) */
    reject(id: string, note: string): Promise<VerificationDocument> {
        return http.post<VerificationDocument>(`${BASE_PATH}/${id}/reject`, { note });
    },
};
