import { http } from "../apiClient";
import type { PageResponse } from "../../types/api.types";
import type {
    FeaturedApproveRequest,
    FeaturedCreateRequest,
    FeaturedEventListParams,
    FeaturedEventResponse,
    FeaturedUpdateRequest,
    PublicEventSummary,
} from "../../types/featured.types";

const BASE_PATH = "/admin/featured-events";
const PUBLIC_EVENT_SEARCH_SIZE = 10;

export const FEATURED_EVENTS_QUERY_KEY = ["admin-featured-events"] as const;

/**
 * Admin quản lý sự kiện nổi bật (§8c). Mọi endpoint trả cùng shape FeaturedEventResponse.
 * Chỉ ghim được sự kiện PUBLISHED — backend trả 422 kèm message rõ ràng nếu không.
 */
export const FeaturedApi = {
    /** Mới nhất trước; không truyền status = mọi trạng thái */
    list(params: FeaturedEventListParams): Promise<PageResponse<FeaturedEventResponse>> {
        return http.get<PageResponse<FeaturedEventResponse>>(BASE_PATH, { params });
    },

    get(id: string): Promise<FeaturedEventResponse> {
        return http.get<FeaturedEventResponse>(`${BASE_PATH}/${id}`);
    },

    /** PENDING → APPROVED; khung giờ backend tự tính từ lúc duyệt + durationDays */
    approve(id: string, body: FeaturedApproveRequest): Promise<FeaturedEventResponse> {
        return http.post<FeaturedEventResponse>(`${BASE_PATH}/${id}/approve`, body);
    },

    /** Chỉ đơn PENDING → REJECTED, trả lượt cho tổ chức */
    reject(id: string, reason: string): Promise<FeaturedEventResponse> {
        return http.post<FeaturedEventResponse>(`${BASE_PATH}/${id}/reject`, { reason });
    },

    /** Gỡ ghim bản ghi APPROVED còn hạn → REVOKED, không trả lượt */
    revoke(id: string, reason: string): Promise<FeaturedEventResponse> {
        return http.post<FeaturedEventResponse>(`${BASE_PATH}/${id}/revoke`, { reason });
    },

    /** Gắn trực tiếp (không cần đơn, không trừ lượt) → APPROVED */
    create(body: FeaturedCreateRequest): Promise<FeaturedEventResponse> {
        return http.post<FeaturedEventResponse>(BASE_PATH, body);
    },

    /** Chỉ APPROVED */
    update(id: string, body: FeaturedUpdateRequest): Promise<FeaturedEventResponse> {
        return http.put<FeaturedEventResponse>(`${BASE_PATH}/${id}`, body);
    },

    /** Tìm sự kiện để gắn — API public chỉ trả sự kiện PUBLISHED (đúng điều kiện ghim) */
    searchPublicEvents(keyword: string): Promise<PageResponse<PublicEventSummary>> {
        return http.get<PageResponse<PublicEventSummary>>("/public/events", {
            params: { keyword: keyword || undefined, page: 0, size: PUBLIC_EVENT_SEARCH_SIZE },
        });
    },
};
