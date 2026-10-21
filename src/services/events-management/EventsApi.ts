import { http } from "../apiClient";
import type { LegacyPage } from "../../types/api.types";

/**
 * Backend CHƯA có API sự kiện cho Admin (/admin/events đang trong backlog) — giữ nguyên path cũ,
 * chỉ khớp interceptor mới (trả thẳng `data`, lỗi ném ApiError). Kiểu dữ liệu do nơi gọi truyền vào.
 */
export const EventsApi = {
    getAll<T = unknown>(
        page: number = 0,
        size: number = 20,
        keyword?: string,
        categoryId?: number,
        status?: string,
        startDateFrom?: string,
    ): Promise<LegacyPage<T>> {
        return http.get<LegacyPage<T>>("/events", { params: { keyword, categoryId, status, startDateFrom, page, size } });
    },
    getStatisticEvent<T = unknown>(id: string): Promise<T> {
        return http.get<T>(`/events/${id}/statistics`);
    },
    getAnalyticsEvent<T = unknown>(id: string): Promise<T> {
        return http.get<T>(`/events/${id}/analytics`);
    },
    getFeatureEvents<T = unknown>(): Promise<T> {
        return http.get<T>(`/events/featured`);
    },
    updateEventById(id: string, data: unknown): Promise<unknown> {
        return http.put<unknown>(`/events/${id}`, data);
    },
    publishEvent(id: string): Promise<unknown> {
        return http.post<unknown>(`/events/${id}/publish`);
    },
    createEvent(data: unknown): Promise<unknown> {
        return http.post<unknown>("/events", data);
    },
    deleteEventById(id: string): Promise<void> {
        return http.delete(`/events/${id}`);
    },
    getById<T = unknown>(id: string): Promise<T> {
        return http.get<T>(`/events/${id}`);
    },
};
