import { http } from "../apiClient";
import type { LegacyPage } from "../../types/api.types";

/** Backend CHƯA có API tuyển CTV — giữ nguyên path cũ, chỉ khớp interceptor mới. */
export const RecruitmentApi = {
    getAllRecruitment: <T = unknown>(page: number = 0, size: number = 20, sort: string[] = []): Promise<LegacyPage<T>> =>
        http.get<LegacyPage<T>>("/recruitments", { params: { page, size, sort } }),
    getRecruitmentById: <T = unknown>(id: string): Promise<T> => http.get<T>(`/recruitments/${id}`),
    putRecruitment: (id: string, data: unknown): Promise<unknown> => http.put<unknown>(`/recruitments/${id}`, data),
    patchRecruitment: (id: string): Promise<unknown> => http.patch<unknown>(`/recruitment/${id}/close`),
    deleteRecruitment: (id: string): Promise<void> => http.delete(`/recruitment/${id}`),
};
