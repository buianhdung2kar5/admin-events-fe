import { http } from "../apiClient";
import type { PageResponse } from "../../types/api.types";
import type {
    RejectReportBody,
    ReportDetail,
    ReportListItem,
    ReportListParams,
    ReportStatus,
    ResolveReportBody,
} from "../../types/report.types";

const BASE_PATH = "/admin/reports";

export const REPORTS_QUERY_KEY = ["admin-reports"] as const;

/** Admin xử lý báo cáo vi phạm — chỉ đổi trạng thái; khóa tài khoản gọi riêng AccountApi.block. */
export const ReportsApi = {
    /** status=PENDING: cũ nhất trước, còn lại mới nhất trước; keyword tìm theo tiêu đề hoặc tên đối tượng */
    list(params: ReportListParams): Promise<PageResponse<ReportListItem>> {
        return http.get<PageResponse<ReportListItem>>(BASE_PATH, { params });
    },

    get(id: string): Promise<ReportDetail> {
        return http.get<ReportDetail>(`${BASE_PATH}/${id}`);
    },

    /** PENDING → RESOLVED; đơn đã đóng trả 422, hai Admin xử lý cùng lúc trả 409 */
    resolve(id: string, body: ResolveReportBody): Promise<ReportDetail> {
        return http.post<ReportDetail>(`${BASE_PATH}/${id}/resolve`, body);
    },

    /** PENDING → REJECTED */
    reject(id: string, body: RejectReportBody): Promise<ReportDetail> {
        return http.post<ReportDetail>(`${BASE_PATH}/${id}/reject`, body);
    },

    /** Đếm theo trạng thái (dùng totalElements, size=1) — cho thẻ thống kê / Dashboard */
    async count(status?: ReportStatus): Promise<number> {
        const page = await ReportsApi.list({ status, page: 0, size: 1 });
        return page.totalElements;
    },
};
