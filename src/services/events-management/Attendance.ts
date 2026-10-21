import { http } from "../apiClient";
import type { LegacyPage } from "../../types/api.types";

/** Backend CHƯA có module điểm danh — giữ nguyên path cũ, chỉ khớp interceptor mới. */
export const AttendanceApi = {
    getLogsAttendance: <T = unknown>(eventId: string, page: number = 0, size: number = 20): Promise<LegacyPage<T>> =>
        http.get<LegacyPage<T>>("attendances", { params: { eventId, page, size } }),
    getAttendanceById: <T = unknown>(id: string): Promise<T> => http.get<T>(`attendances/${id}`),
    putAttendance: (id: string, data: unknown): Promise<unknown> => http.put<unknown>(`attendances/${id}`, data),
    deleteAttendance: (id: string): Promise<void> => http.delete(`attendances/${id}`),
};
