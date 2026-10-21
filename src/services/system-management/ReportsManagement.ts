import { http } from "../apiClient";
import type { LegacyPage } from "../../types/api.types";

/** Backend CHƯA có API báo cáo vi phạm — giữ nguyên path cũ, chỉ khớp interceptor mới. */
export const ReportsManagement = {
    getAllReports<T = unknown>(page?: number, size?: number, sort?: string[]): Promise<LegacyPage<T>> {
        return http.get<LegacyPage<T>>("/reports", { params: { page, size, sort } });
    },
    getReportById<T = unknown>(id: number): Promise<T> {
        return http.get<T>(`/reports/${id}`);
    },
    resolveReport(id: number): Promise<unknown> {
        return http.post<unknown>(`/reports/${id}/resolve`);
    },
};
