import type { ReactNode } from "react";
import { Award } from "lucide-react";
import { safeHttpsUrl } from "../../verify-document/DTO/VerificationInterface";
import type { Portfolio } from "../../../../types/portfolio.types";
import { ROLE_LABELS, formatPortfolioDate } from "./portfolioDisplay";

/** Tờ portfolio dạng giấy chứng nhận, giống PortfolioSheetUI bên FE User (refactor_events). */
const PAPER_GOLD = "#B48F2A";
const PAPER_BORDER = "border-[#E4D7AE]";

/** Bỏ phần trống rồi nối bằng dấu chấm giữa. */
const joinParts = (parts: (string | null | undefined)[]): string =>
    parts.map((part) => part?.trim()).filter(Boolean).join(" · ");

/** Đường kẻ trang trí: vạch — hình thoi — vạch. */
function OrnamentDivider() {
    return (
        <div aria-hidden="true" className="flex items-center justify-center gap-3 py-1">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#CDBA7F]" />
            <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: PAPER_GOLD }} />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#CDBA7F]" />
        </div>
    );
}

/** Họa tiết góc khung, xoay theo từng góc bằng class truyền vào. */
function Corner({ className }: { className: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 32 32" className={`absolute w-8 h-8 ${className}`} fill="none" stroke={PAPER_GOLD} strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 30V10C2 5.6 5.6 2 10 2h20" />
            <path d="M8 30V14c0-3.3 2.7-6 6-6h16" opacity="0.5" />
            <circle cx="2" cy="2" r="1.5" fill={PAPER_GOLD} stroke="none" />
        </svg>
    );
}

function PaperSheet({ children }: { children: ReactNode }) {
    return (
        <article className={`bg-[#FFFDF6] border ${PAPER_BORDER} rounded-lg p-2 text-center`}>
            <div className={`relative overflow-hidden border ${PAPER_BORDER} rounded px-6 py-10 md:px-12`}>
                <Corner className="top-1.5 left-1.5" />
                <Corner className="top-1.5 right-1.5 rotate-90" />
                <Corner className="bottom-1.5 right-1.5 rotate-180" />
                <Corner className="bottom-1.5 left-1.5 -rotate-90" />
                <Award aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 text-[#B48F2A] opacity-[0.05] pointer-events-none" />
                <div className="relative space-y-6">{children}</div>
            </div>
        </article>
    );
}

interface Props {
    portfolio: Portfolio;
    /** Owner trong response admin không có email → lấy từ tài khoản đang xem */
    ownerEmail?: string | null;
}

export default function PortfolioPaperSheet({ portfolio, ownerEmail }: Props) {
    const { owner, items } = portfolio;
    const fullName = owner?.fullName?.trim() ?? "";
    const name = fullName || ownerEmail || "";
    const avatar = safeHttpsUrl(owner?.avatarUrl ?? "");
    const studyLine = joinParts([owner?.studentCode, owner?.university]);
    const majorLine = joinParts([owner?.faculty, owner?.major]);

    return (
        <PaperSheet>
            {owner && (
                <>
                    <header className="flex flex-col items-center gap-1">
                        <span className="w-20 h-20 rounded-full bg-[#E2E8F0] overflow-hidden flex items-center justify-center text-2xl font-semibold text-[#475569] ring-2 ring-[#B48F2A]/50 ring-offset-4 ring-offset-[#FFFDF6]">
                            {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : name.charAt(0).toUpperCase()}
                        </span>
                        <h3 className="mt-3 text-xl font-semibold text-[#0F172A] break-words">{name}</h3>
                        {studyLine && <p className="text-sm text-[#475569] break-words">{studyLine}</p>}
                        {majorLine && <p className="text-sm text-[#475569] break-words">{majorLine}</p>}
                        {fullName && ownerEmail && <p className="text-xs text-[#64748B] break-words">{ownerEmail}</p>}
                    </header>
                    <OrnamentDivider />
                </>
            )}

            <section aria-label="Giới thiệu portfolio" className="space-y-1">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: PAPER_GOLD }}>
                    <Award className="w-3.5 h-3.5" aria-hidden="true" />
                    Portfolio hoạt động
                </p>
                <h4 className="text-xl font-semibold text-[#007595] leading-snug break-words">{portfolio.title || "Chưa có tiêu đề"}</h4>
                {portfolio.description && <p className="text-sm text-[#475569] whitespace-pre-line break-words">{portfolio.description}</p>}
            </section>

            <OrnamentDivider />

            {items.length === 0 ? (
                <p className="text-sm text-[#64748B]">Chưa có sự kiện nào.</p>
            ) : (
                <ol className="space-y-5">
                    {items.map((item, index) => (
                        <li key={`${item.eventId}-${item.role}`} className="space-y-1">
                            {index > 0 && <OrnamentDivider />}
                            <p className="pt-2 text-xs italic text-[#64748B]">Đã tham gia</p>
                            <p className="text-lg font-semibold text-[#007595] leading-snug break-words">{item.eventTitle}</p>
                            <p className="text-sm text-[#475569] break-words">{item.organizationName}</p>
                            <p className="text-sm break-words">
                                <span className={`font-medium ${item.role === "CTV" ? "text-[#BE185D]" : "text-[#047857]"}`}>
                                    {joinParts([ROLE_LABELS[item.role], item.positionName])}
                                </span>
                                <span className="text-[#475569]"> · <span className="tabular-nums">{formatPortfolioDate(item.endTime)}</span></span>
                            </p>
                            {item.note && <p className="text-sm text-[#475569] italic break-words">“{item.note}”</p>}
                        </li>
                    ))}
                </ol>
            )}

            <footer className="space-y-2 pt-2">
                <OrnamentDivider />
                <p className="text-xs text-[#94A3B8]">Ngày lập: {formatPortfolioDate(portfolio.createdAt)}</p>
            </footer>
        </PaperSheet>
    );
}
