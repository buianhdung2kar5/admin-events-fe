import { useEffect, useRef, useState } from "react";
import { AlertCircle, Ban, Building2, CheckCircle2, Loader2, Lock, User } from "lucide-react";
import { getErrorMessage } from "../../../../services/apiError";
import type { ReportDetail } from "../../../../types/report.types";
import { REPORT_TARGET_LABELS } from "../reportDisplay";

interface Props {
    report: ReportDetail;
    onBlock: () => Promise<unknown>;
}

function ConfirmLockDialog({ name, isSaving, onCancel, onConfirm }: { name: string; isSaving: boolean; onCancel: () => void; onConfirm: () => void }) {
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        cancelRef.current?.focus();
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onCancel]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="lock-title" aria-describedby="lock-desc">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
                <h2 id="lock-title" className="text-lg font-bold text-gray-800">Khóa tài khoản này?</h2>
                <p id="lock-desc" className="text-sm text-gray-600">Tài khoản <strong className="text-gray-800">{name}</strong> sẽ bị khóa và không thể đăng nhập cho đến khi được mở lại. Trạng thái báo cáo không thay đổi.</p>
                <div className="flex justify-end gap-3">
                    <button ref={cancelRef} type="button" onClick={onCancel} disabled={isSaving} className="px-5 min-h-11 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">Hủy</button>
                    <button type="button" onClick={onConfirm} disabled={isSaving}
                        className="px-5 min-h-11 inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50">
                        {isSaving && <Loader2 size={14} className="animate-spin" />}Khóa tài khoản
                    </button>
                </div>
            </div>
        </div>
    );
}

/** Tài khoản bị báo cáo để Admin cân nhắc; khóa tài khoản là thao tác riêng, không đổi trạng thái đơn. */
export default function ReportTargetCard({ report, onBlock }: Props) {
    const { target, targetType, targetName } = report;
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isBlocked = target.accountStatus === "BLOCKED";
    const isEvent = targetType === "EVENT";

    const handleBlock = async () => {
        setError(null);
        setIsSaving(true);
        try {
            await onBlock();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Không khóa được tài khoản"));
        } finally {
            setIsSaving(false);
            setIsConfirming(false);
        }
    };

    return (
        <section aria-labelledby="target-title" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <h2 id="target-title" className="text-xs font-bold uppercase tracking-wide text-gray-500">Đối tượng bị báo cáo</h2>

            <div className="flex items-start gap-3">
                <div className="bg-[#0092B8]/10 text-[#0092B8] p-2.5 rounded-xl">
                    {targetType === "USER" ? <User size={20} aria-hidden="true" /> : <Building2 size={20} aria-hidden="true" />}
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-gray-800">{targetName}</p>
                    <p className="text-xs text-gray-500">{REPORT_TARGET_LABELS[targetType]}</p>
                    {isEvent && <p className="mt-1 text-xs text-gray-500">Tài khoản chịu xử lý: <strong className="text-gray-700">{target.displayName}</strong> (tổ chức sở hữu sự kiện)</p>}
                </div>
            </div>

            <dl className="rounded-xl p-3 bg-gray-50 text-center">
                <dd className="text-xl font-bold text-gray-800">{target.otherReportCount}</dd>
                <dt className="text-xs text-gray-500">Báo cáo khác</dt>
            </dl>

            <p className={`inline-flex items-center gap-1.5 text-sm font-semibold ${isBlocked ? "text-red-600" : "text-green-600"}`}>
                {isBlocked ? <Ban size={15} aria-hidden="true" /> : <CheckCircle2 size={15} aria-hidden="true" />}
                {isBlocked ? "Tài khoản đang bị khóa" : "Tài khoản đang hoạt động"}
            </p>

            {error && (
                <p role="alert" className="flex items-start gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100 text-xs font-medium text-red-600">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{error}
                </p>
            )}

            {!isBlocked && (
                <button type="button" onClick={() => setIsConfirming(true)}
                    className="px-5 min-h-11 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100">
                    <Lock size={14} aria-hidden="true" />Khóa tài khoản
                </button>
            )}

            {isConfirming && (
                <ConfirmLockDialog name={target.displayName} isSaving={isSaving} onCancel={() => setIsConfirming(false)} onConfirm={handleBlock} />
            )}
        </section>
    );
}
