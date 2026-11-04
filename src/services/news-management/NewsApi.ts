import { http } from "../apiClient";
import { ApiError } from "../apiError";
import type { PageResponse } from "../../types/api.types";
import type { News, NewsListParams, NewsStatus, NewsSummary, NewsUpsertBody } from "../../types/news.types";
import { findMockNews, isMockNewsId, mockNewsPage } from "./newsMock";

const BASE_PATH = "/admin/news";

export const NEWS_QUERY_KEY = ["admin-news"] as const;

export interface NewsPage extends PageResponse<NewsSummary> {
    /** true = API lỗi (404 / 5xx / mất kết nối), đang hiện tin mẫu */
    isMock: boolean;
}

/** Backend chưa restart sau khi chạy SQL tin tức thường trả 404/500 → hiện tin mẫu thay vì màn lỗi. */
const shouldUseMock = (error: unknown): boolean =>
    error instanceof ApiError && (error.status === null || error.status === 404 || error.status >= 500);

/** Admin quản lý tin tức — /admin/news (§15). Chỉ tin DRAFT mới xóa được. */
export const NewsApi = {
    /** Mới cập nhật trước; keyword tìm theo tiêu đề */
    async list(params: NewsListParams): Promise<NewsPage> {
        try {
            const page = await http.get<PageResponse<NewsSummary>>(BASE_PATH, { params });
            return { ...page, isMock: false };
        } catch (error: unknown) {
            if (shouldUseMock(error)) return { ...mockNewsPage(params), isMock: true };
            throw error;
        }
    },

    get(id: string): Promise<News> {
        const mock = isMockNewsId(id) ? findMockNews(id) : undefined;
        if (mock) return Promise.resolve(mock);
        return http.get<News>(`${BASE_PATH}/${id}`);
    },

    /** Luôn tạo DRAFT */
    create(body: NewsUpsertBody): Promise<News> {
        return http.post<News>(BASE_PATH, body);
    },

    /** Gửi ĐỦ trường; null = xóa giá trị cũ */
    update(id: string, body: NewsUpsertBody): Promise<News> {
        return http.put<News>(`${BASE_PATH}/${id}`, body);
    },

    /** Nội dung trống / sai trạng thái → 422 */
    publish(id: string): Promise<News> {
        return http.post<News>(`${BASE_PATH}/${id}/publish`);
    },

    unpublish(id: string): Promise<News> {
        return http.post<News>(`${BASE_PATH}/${id}/unpublish`);
    },

    /** Chỉ DRAFT; tin đang đăng → 422 */
    remove(id: string): Promise<void> {
        return http.delete(`${BASE_PATH}/${id}`);
    },

    /** Đếm theo trạng thái (totalElements, size=1) cho thẻ thống kê */
    async count(status?: NewsStatus): Promise<number> {
        const page = await NewsApi.list({ status, page: 0, size: 1 });
        return page.totalElements;
    },
};
