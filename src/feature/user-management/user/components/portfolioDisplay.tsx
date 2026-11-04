import type { Portfolio, PortfolioItemRole } from "../../../../types/portfolio.types";

export const ROLE_LABELS: Record<PortfolioItemRole, string> = {
    ATTENDEE: "Người tham dự",
    CTV: "Cộng tác viên",
};

export const formatPortfolioDate = (iso: string): string => new Date(iso).toLocaleDateString("vi-VN");

export function PortfolioPublishBadge({ portfolio }: { portfolio: Portfolio }) {
    return portfolio.isPublished ? (
        <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg border bg-green-50 text-green-700 border-green-200">
            Đã publish{portfolio.publishedAt ? ` · ${formatPortfolioDate(portfolio.publishedAt)}` : ""}
        </span>
    ) : (
        <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg border bg-gray-100 text-gray-600 border-gray-200">Chưa publish</span>
    );
}
