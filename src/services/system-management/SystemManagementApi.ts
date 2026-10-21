import { http } from "../apiClient";
import type { LegacyPage } from "../../types/api.types";

/**
 * Backend CHƯA có các API này. Khóa/mở khóa tài khoản hàng loạt đã chuyển sang AccountApi.blockMany / unlockMany.
 */
export const SystemManagementApi = {
    getActivityAccount<T = unknown>(page: number = 0, size: number = 20, sort: string[] = []): Promise<LegacyPage<T>> {
        return http.get<LegacyPage<T>>("/admin/users/activity", { params: { page, size, sort } });
    },
    getHeapStatistics<T = unknown>(): Promise<T> {
        return http.get<T>("/admin/statistics");
    },
    bulkAction(data: unknown): Promise<unknown> {
        return http.post<unknown>("/admin/bulk-action", data);
    },
};
