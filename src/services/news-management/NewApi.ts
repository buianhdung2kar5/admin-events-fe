import { http } from "../apiClient";
import type { LegacyPage } from "../../types/api.types";

export interface NewsItem {
    newsId: number;
    title: string;
    content: string;
    banner: string;
    tag: string;
    targetType: string;
    targetId: number | null;
    totalRewardCoin: number;
    remainingRewardCoin: number;
    rewardPerMinute: number;
    viewCount: number;
    createdTime: string;
}

export interface NewsResponse {
    content: NewsItem[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface createNewsData {
    title: string,
    content: string,
    /** URL ảnh đã upload qua POST /files */
    banner: string,
    tag: string,
    targetType: string,
    targetId: number | null,
    totalRewardCoin:number,
    rewardPerMinute:number,
}

/** Backend CHƯA có API tin tức — giữ nguyên path cũ, chỉ khớp interceptor mới. */
export const NewApi = {
    getAllNews: (page: number = 0, size: number = 20, sort: string[] = []): Promise<LegacyPage<NewsItem>> =>
        http.get<LegacyPage<NewsItem>>("/news", { params: { page, size, sort } }),
    createNews: (data: createNewsData): Promise<NewsItem> => http.post<NewsItem>("/news", data),
    deleteNews: (id: number): Promise<void> => http.delete(`/news/${id}`),
    getNewsDetail: (id: number): Promise<NewsItem> => http.get<NewsItem>(`/news/${id}`),
};
