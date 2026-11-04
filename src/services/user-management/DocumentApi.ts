import { http } from "../apiClient";
import type { PageResponse } from "../../types/api.types";
import type {
    VerificationListParams,
    VerificationProfile,
} from "../../feature/user-management/verify-document/DTO/VerificationInterface";

const BASE_PATH = "/admin/verification-documents";
export const VERIFICATION_QUERY_KEY = ["verification-profiles"] as const;

/** Admin duyệt hồ sơ xác minh tổ chức (§6) — duyệt / từ chối CẢ hồ sơ, tổ chức đổi trạng thái theo. */
export const VerificationDocumentApi = {
    /** status tùy chọn; PENDING = cũ nhất trước, còn lại mới nhất trước */
    list(params: VerificationListParams): Promise<PageResponse<VerificationProfile>> {
        return http.get<PageResponse<VerificationProfile>>(BASE_PATH, { params });
    },

    get(id: string): Promise<VerificationProfile> {
        return http.get<VerificationProfile>(`${BASE_PATH}/${id}`);
    },

    /** Hồ sơ PENDING → APPROVED, tổ chức → VERIFIED */
    approve(id: string): Promise<VerificationProfile> {
        return http.post<VerificationProfile>(`${BASE_PATH}/${id}/approve`);
    },

    /** Hồ sơ + tổ chức → REJECTED (tổ chức nộp lại được); reason bắt buộc ≤1000 */
    reject(id: string, reason: string): Promise<VerificationProfile> {
        return http.post<VerificationProfile>(`${BASE_PATH}/${id}/reject`, { reason });
    },

    /** Đếm hồ sơ theo trạng thái (dùng totalElements, size=1) — cho thẻ thống kê / Dashboard */
    async count(status?: VerificationListParams["status"]): Promise<number> {
        const page = await VerificationDocumentApi.list({ status, page: 0, size: 1 });
        return page.totalElements;
    },
};
