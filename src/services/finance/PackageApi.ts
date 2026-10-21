import { http } from "../apiClient";
import type { PageResponse } from "../../types/api.types";
import type { PackageListParams, PackageResponse, PackageUpsertRequest } from "../../types/package.types";

const BASE_PATH = "/admin/packages";

/**
 * Admin quản lý danh mục gói ưu đãi. Vòng đời: DRAFT → PUBLISHED ⇄ HIDDEN.
 * Ẩn = ngừng bán (người đã mua dùng tiếp tới hết hạn). Gói PUBLISHED phải ẩn trước khi xóa.
 */
export const PackageApi = {
    getPackages(params: PackageListParams): Promise<PageResponse<PackageResponse>> {
        return http.get<PageResponse<PackageResponse>>(BASE_PATH, { params });
    },

    getPackage(id: string): Promise<PackageResponse> {
        return http.get<PackageResponse>(`${BASE_PATH}/${id}`);
    },

    /** Tạo gói mới ở trạng thái DRAFT */
    createPackage(payload: PackageUpsertRequest): Promise<PackageResponse> {
        return http.post<PackageResponse>(BASE_PATH, payload);
    },

    updatePackage(id: string, payload: PackageUpsertRequest): Promise<PackageResponse> {
        return http.put<PackageResponse>(`${BASE_PATH}/${id}`, payload);
    },

    /** DRAFT / HIDDEN → PUBLISHED */
    publishPackage(id: string): Promise<PackageResponse> {
        return http.post<PackageResponse>(`${BASE_PATH}/${id}/publish`);
    },

    /** PUBLISHED → HIDDEN */
    hidePackage(id: string): Promise<PackageResponse> {
        return http.post<PackageResponse>(`${BASE_PATH}/${id}/hide`);
    },

    /** Xóa mềm (không áp dụng cho gói đang PUBLISHED) */
    deletePackage(id: string): Promise<void> {
        return http.delete(`${BASE_PATH}/${id}`);
    },
};
