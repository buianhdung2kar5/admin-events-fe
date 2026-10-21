import { http } from "../apiClient";
import type { LegacyPage } from "../../types/api.types";

/** Backend CHƯA có API sự kiện nổi bật — giữ nguyên path cũ, chỉ khớp interceptor mới. */
export const FeaturedApi = {
    getAllFeaturedEvents<T = unknown>(page: number = 0, size: number = 20): Promise<LegacyPage<T>> {
        return http.get<LegacyPage<T>>("/featured-events/admin", { params: { page, size } });
    },
    getFeaturedEventById<T = unknown>(id: number): Promise<T> {
        return http.get<T>(`/featured-events/admin/${id}`);
    },
    createFeaturedEvent(eventId: number, priority: number, startDate: Date, endDate: Date): Promise<unknown> {
        return http.post<unknown>("/featured-events", { eventId, priority, startDate, endDate });
    },
    updateFeaturedEvent(id: number, priority: number, startDate: Date, endDate: Date): Promise<unknown> {
        return http.put<unknown>(`/featured-events/${id}`, { priority, startDate, endDate });
    },
    deleteFeaturedEvent(idArray: number[]): Promise<void> {
        return http.delete("/featured-events", { data: idArray });
    },
};
