import { http } from "../apiClient";
import type { LegacyPage } from "../../types/api.types";

/** Backend CHƯA có API giao dịch cho Admin — giữ nguyên path cũ, chỉ khớp interceptor mới. */
export const financeApi = {
    getAllFinance: <T = unknown>(page: number = 0, size: number = 10, sort?: string[]): Promise<LegacyPage<T>> =>
        http.get<LegacyPage<T>>("/finance/transactions", { params: { page, size, sort } }),
};
