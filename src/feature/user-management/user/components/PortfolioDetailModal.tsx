import { useQuery } from "@tanstack/react-query";
import { AlertCircle, FileText, Loader2, X } from "lucide-react";
import { ApiError, getErrorMessage } from "../../../../services/apiError";
import { AccountApi } from "../../../../services/user-management/AccountApi";
import PortfolioPaperSheet from "./PortfolioPaperSheet";
import { PortfolioPublishBadge } from "./portfolioDisplay";

interface Props {
    portfolioId: string;
    ownerEmail?: string | null;
    onClose: () => void;
}

const isNotFound = (error: unknown): boolean => error instanceof ApiError && error.status === 404;

/** Chi tiết 1 portfolio (GET /admin/portfolios/{id}) dạng giấy chứng nhận. Admin chỉ xem. */
export default function PortfolioDetailModal({ portfolioId, ownerEmail, onClose }: Props) {
    const { data: portfolio, isLoading, error } = useQuery({
        queryKey: ["user_portfolio", portfolioId],
        queryFn: () => AccountApi.getPortfolio(portfolioId),
        retry: (failureCount, err) => !isNotFound(err) && failureCount < 1,
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="portfolio-title">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <header className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="bg-[#0092B8]/10 text-[#0092B8] p-2.5 rounded-xl"><FileText size={20} aria-hidden="true" /></div>
                        <div className="min-w-0 flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 id="portfolio-title" className="text-lg font-bold text-gray-800 break-words">{portfolio?.title ?? "Portfolio"}</h2>
                                {portfolio && <PortfolioPublishBadge portfolio={portfolio} />}
                            </div>
                            {portfolio && <p className="text-xs text-gray-500">{portfolio.items.length} chứng nhận</p>}
                        </div>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Đóng" className="p-2 hover:bg-gray-100 rounded-xl shrink-0"><X size={18} className="text-gray-500" /></button>
                </header>

                <div className="p-6 overflow-y-auto">
                    {isLoading && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#0092B8] animate-spin" /></div>}
                    {error && (
                        <p role="alert" className="flex items-start gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100 text-sm font-medium text-red-600">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                            {isNotFound(error) ? "Không tìm thấy portfolio (có thể đã bị xóa)." : getErrorMessage(error, "Không tải được portfolio")}
                        </p>
                    )}
                    {portfolio && <PortfolioPaperSheet portfolio={portfolio} ownerEmail={ownerEmail} />}
                </div>

                <footer className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button type="button" onClick={onClose} className="px-5 min-h-11 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50">Đóng</button>
                </footer>
            </div>
        </div>
    );
}
