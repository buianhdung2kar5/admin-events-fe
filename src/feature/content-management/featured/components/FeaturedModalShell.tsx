import type { FormEvent, ReactNode } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

interface Props {
    title: string;
    subtitle?: ReactNode;
    error: string | null;
    isSaving: boolean;
    submitLabel: string;
    /** "danger" cho thao tác gỡ / từ chối / thu hồi */
    tone?: "primary" | "danger";
    isSubmitDisabled?: boolean;
    onClose: () => void;
    onSubmit: () => void;
    children: ReactNode;
}

const SUBMIT_TONE = {
    primary: "bg-[#0092B8] hover:bg-[#007a99]",
    danger: "bg-red-500 hover:bg-red-600",
};

/** Khung modal dùng chung cho các thao tác trên sự kiện nổi bật. */
export default function FeaturedModalShell({
    title, subtitle, error, isSaving, submitLabel, tone = "primary", isSubmitDisabled = false, onClose, onSubmit, children,
}: Props) {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="featured-modal-title">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <form onSubmit={handleSubmit} noValidate className="relative bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">
                <header className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
                    <div className="flex flex-col gap-1 min-w-0">
                        <h2 id="featured-modal-title" className="text-lg font-bold text-gray-800">{title}</h2>
                        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
                    </div>
                    <button type="button" onClick={onClose} aria-label="Đóng" className="p-2 hover:bg-gray-100 rounded-xl transition-colors shrink-0">
                        <X size={18} className="text-gray-500" />
                    </button>
                </header>

                <div className="p-6 flex flex-col gap-4 overflow-y-auto">
                    {children}
                    {error && (
                        <p role="alert" className="flex items-start gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100 text-xs font-medium text-red-600">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{error}
                        </p>
                    )}
                </div>

                <footer className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button type="button" onClick={onClose} className="px-5 min-h-11 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200/50 transition-colors">Hủy</button>
                    <button type="submit" disabled={isSaving || isSubmitDisabled}
                        className={`px-6 min-h-11 inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${SUBMIT_TONE[tone]}`}>
                        {isSaving && <Loader2 size={14} className="animate-spin" />}
                        {submitLabel}
                    </button>
                </footer>
            </form>
        </div>
    );
}

export const FIELD_LABEL_CLS = "flex flex-col gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wide";
export const INPUT_CLS = "w-full min-h-11 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-normal normal-case tracking-normal text-gray-800 outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all";
