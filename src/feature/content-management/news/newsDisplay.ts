import type { NewsStatus } from "../../../types/news.types";

export const NEWS_STATUS_META: Record<NewsStatus, { label: string; className: string }> = {
    DRAFT: { label: "Nháp", className: "bg-gray-100 text-gray-600 border-gray-200" },
    PUBLISHED: { label: "Đã đăng", className: "bg-green-50 text-green-700 border-green-200" },
};

export const formatNewsDate = (iso: string | null): string =>
    iso ? new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

/** Đường dẫn công khai của tin (FE User) — chỉ để xem trước, path tính theo slug */
export const newsPublicPath = (slug: string): string => `/news/${slug}`;
