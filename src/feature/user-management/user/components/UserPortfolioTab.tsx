import { useState } from "react";
import type { KeyboardEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Loader2 } from "lucide-react";
import { getErrorMessage } from "../../../../services/apiError";
import { AccountApi } from "../../../../services/user-management/AccountApi";
import type { Portfolio } from "../../../../types/portfolio.types";
import PortfolioDetailModal from "./PortfolioDetailModal";
import { PortfolioPublishBadge } from "./portfolioDisplay";

function PortfolioCard({ portfolio, onOpen }: { portfolio: Portfolio; onOpen: () => void }) {
    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
        }
    };

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={handleKeyDown}
            className="rounded-2xl border border-gray-100 px-4 py-3 flex flex-col gap-1.5 cursor-pointer hover:bg-blue-50/30 hover:border-[#0092B8]/30 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0092B8]/40"
        >
            <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-gray-800">{portfolio.title}</h3>
                <PortfolioPublishBadge portfolio={portfolio} />
            </div>
            {portfolio.description && <p className="text-sm text-gray-600 line-clamp-2">{portfolio.description}</p>}
            <p className="text-xs text-gray-400">{portfolio.items.length > 0 ? `${portfolio.items.length} sự kiện` : "Chưa có sự kiện nào"}</p>
        </article>
    );
}

/** Portfolio của người dùng, kể cả bản chưa publish. Bấm thẻ để xem chi tiết; Admin chỉ xem. */
export default function UserPortfolioTab({ userId, ownerEmail }: { userId: string; ownerEmail?: string | null }) {
    const queryClient = useQueryClient();
    const [openId, setOpenId] = useState<string | null>(null);
    const { data: portfolios = [], isLoading, error } = useQuery({
        queryKey: ["user_portfolios", userId],
        queryFn: () => AccountApi.getPortfolios(userId),
    });

    /** Đóng chi tiết thì tải lại danh sách, để portfolio vừa bị xóa (404) biến mất. */
    const closeDetail = () => {
        setOpenId(null);
        queryClient.invalidateQueries({ queryKey: ["user_portfolios", userId] });
    };

    if (isLoading) {
        return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#0092B8] animate-spin" /></div>;
    }
    if (error) {
        return <p role="alert" className="py-12 text-center text-sm font-medium text-red-500">{getErrorMessage(error, "Không tải được portfolio")}</p>;
    }
    if (portfolios.length === 0) {
        return (
            <div className="py-12 flex flex-col items-center gap-2 text-sm text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <Award size={32} className="text-gray-300" aria-hidden="true" /> Người dùng chưa có portfolio
            </div>
        );
    }
    return (
        <>
            <div className="flex flex-col gap-3">
                {portfolios.map((portfolio) => <PortfolioCard key={portfolio.id} portfolio={portfolio} onOpen={() => setOpenId(portfolio.id)} />)}
            </div>
            {openId && <PortfolioDetailModal portfolioId={openId} ownerEmail={ownerEmail} onClose={closeDetail} />}
        </>
    );
}
