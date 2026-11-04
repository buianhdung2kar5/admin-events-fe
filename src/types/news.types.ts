/** Tin tức do Admin quản lý — theo docs/BACKEND_API_CONTRACT.md §15. */
export type NewsStatus = "DRAFT" | "PUBLISHED";

export interface NewsSummary {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    bannerUrl: string | null;
    tag: string | null;
    status: NewsStatus;
    viewCount: number;
    /** null = chưa từng đăng */
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface News extends NewsSummary {
    /** HTML đã được backend lọc (OWASP whitelist) */
    content: string | null;
}

export interface NewsListParams {
    status?: NewsStatus;
    keyword?: string;
    tag?: string;
    page: number;
    size: number;
}

/** PUT gửi ĐỦ trường — trường null sẽ xóa giá trị cũ. */
export interface NewsUpsertBody {
    title: string;
    slug: string;
    summary: string | null;
    content: string | null;
    bannerUrl: string | null;
    tag: string | null;
}
