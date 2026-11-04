import { http } from "../apiClient";

/**
 * Lần mua gói (§8d). Admin chưa có API danh sách lần mua (§11) — hiện chỉ thu hồi được
 * từ màn hình sự kiện nổi bật, nơi bản ghi có sẵn userPackageId.
 */
export const UserPackageApi = {
    /** Chỉ lần mua ACTIVE → REVOKED: cắt MỌI quyền lợi của lần mua đó ngay lập tức */
    revoke(userPackageId: string, reason: string): Promise<unknown> {
        return http.post<unknown>(`/admin/user-packages/${userPackageId}/revoke`, { reason });
    },
};
