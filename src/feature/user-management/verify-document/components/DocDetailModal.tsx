import { useState } from "react";
import { z } from "zod";
import { X, FileText, ExternalLink, CheckCircle2, XCircle, Loader2, AlertCircle, Building2 } from "lucide-react";
import { getErrorMessage } from "../../../../services/apiError";
import {
    REJECT_REASON_MAX_LENGTH,
    REQUIRED_DOCUMENTS,
    VERIFICATION_STATUS_META,
    getDocumentTypeLabel,
    getMissingDocuments,
    getOrganizationTypeLabel,
    isImageFile,
    safeHttpsUrl,
    type VerificationProfile,
} from "../DTO/VerificationInterface";

interface Props {
    profile: VerificationProfile;
    onClose: () => void;
    onApprove: () => Promise<unknown>;
    onReject: (reason: string) => Promise<unknown>;
}

const reasonSchema = z
    .string()
    .trim()
    .min(1, "Vui lòng nhập lý do từ chối")
    .max(REJECT_REASON_MAX_LENGTH, `Lý do tối đa ${REJECT_REASON_MAX_LENGTH} ký tự`);

const formatDate = (iso: string | null): string => (iso ? new Date(iso).toLocaleString("vi-VN") : "—");

/** Xem đủ file của 1 hồ sơ rồi Duyệt / Từ chối cả hồ sơ (tổ chức đổi trạng thái theo). */
export default function DocDetailModal({ profile, onClose, onApprove, onReject }: Props) {
    const [isRejecting, setIsRejecting] = useState(false);
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const isPending = profile.status === "PENDING";
    const missing = getMissingDocuments(profile);
    const required = profile.organizationType ? REQUIRED_DOCUMENTS[profile.organizationType] : [];
    const meta = VERIFICATION_STATUS_META[profile.status];

    const run = async (action: () => Promise<unknown>) => {
        setError(null);
        setIsSaving(true);
        try {
            await action();
            onClose();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleReject = () => {
        const parsed = reasonSchema.safeParse(reason);
        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Lý do không hợp lệ");
            return;
        }
        run(() => onReject(parsed.data));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="verification-title">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <header className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="bg-[#0092B8]/10 text-[#0092B8] p-2.5 rounded-xl"><Building2 size={20} /></div>
                        <div className="min-w-0">
                            <h2 id="verification-title" className="text-lg font-bold text-gray-800 truncate">{profile.organizationName ?? "Chưa đặt tên"}</h2>
                            <p className="text-xs text-gray-500">{profile.organizationEmail ?? profile.userId} · {getOrganizationTypeLabel(profile.organizationType)}</p>
                            <p className="mt-1 text-xs text-gray-400">Nộp lúc {formatDate(profile.createdAt)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${meta.className}`}>{meta.label}</span>
                        <button type="button" onClick={onClose} aria-label="Đóng" className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} className="text-gray-500" /></button>
                    </div>
                </header>

                <div className="p-6 flex flex-col gap-5 overflow-y-auto">
                    {required.length > 0 && (
                        <section aria-labelledby="required-title" className="rounded-xl border border-gray-100 p-4">
                            <h3 id="required-title" className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Giấy tờ bắt buộc</h3>
                            <ul className="flex flex-col gap-1.5">
                                {required.map((type) => {
                                    const isMissing = missing.includes(type);
                                    return (
                                        <li key={type} className={`flex items-center gap-2 text-sm ${isMissing ? "text-amber-700" : "text-gray-700"}`}>
                                            {isMissing ? <AlertCircle size={15} aria-hidden="true" /> : <CheckCircle2 size={15} className="text-green-600" aria-hidden="true" />}
                                            {getDocumentTypeLabel(type)}{isMissing && <span className="text-xs font-semibold">(thiếu)</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    )}

                    <section aria-labelledby="files-title" className="flex flex-col gap-3">
                        <h3 id="files-title" className="text-xs font-bold uppercase tracking-wide text-gray-500">Các file đã nộp ({profile.files.length})</h3>
                        {profile.files.map((file) => {
                            const url = safeHttpsUrl(file.fileUrl);
                            return (
                                <article key={file.fileId} className="rounded-xl border border-gray-100 overflow-hidden">
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        <FileText size={18} className="text-[#0092B8] shrink-0" aria-hidden="true" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800">{getDocumentTypeLabel(file.documentType)}</p>
                                            <p className="text-xs text-gray-400 truncate">{file.originalFileName ?? file.fileId}</p>
                                        </div>
                                        {url ? (
                                            <a href={url} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-3 min-h-9 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50">
                                                <ExternalLink size={13} aria-hidden="true" />Mở file
                                            </a>
                                        ) : (
                                            <span className="text-xs text-red-500">Link không an toàn</span>
                                        )}
                                    </div>
                                    {url && isImageFile(file) && (
                                        <img src={url} alt={getDocumentTypeLabel(file.documentType)} loading="lazy" className="w-full max-h-72 object-contain bg-gray-50 border-t border-gray-100" />
                                    )}
                                </article>
                            );
                        })}
                    </section>

                    {profile.status === "REJECTED" && profile.rejectReason && (
                        <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                            <strong>Lý do từ chối:</strong> {profile.rejectReason}
                            <span className="block text-xs text-red-500 mt-1">{formatDate(profile.reviewedAt)}</span>
                        </p>
                    )}
                    {profile.status === "APPROVED" && (
                        <p className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">Đã duyệt lúc {formatDate(profile.reviewedAt)} — tổ chức đã được xác minh.</p>
                    )}

                    {isPending && isRejecting && (
                        <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-600">
                            Lý do từ chối *
                            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} maxLength={REJECT_REASON_MAX_LENGTH} autoFocus
                                placeholder="VD: Ảnh CCCD bị mờ, vui lòng chụp lại" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-normal normal-case tracking-normal outline-none focus:border-[#0092B8] resize-none" />
                            <span className="self-end text-[11px] font-normal text-gray-400">{reason.length}/{REJECT_REASON_MAX_LENGTH}</span>
                        </label>
                    )}

                    {error && (
                        <p role="alert" className="flex items-start gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100 text-xs font-medium text-red-600">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{error}
                        </p>
                    )}
                </div>

                {isPending && (
                    <footer className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        {isRejecting ? (
                            <>
                                <button type="button" onClick={() => { setIsRejecting(false); setError(null); }} className="px-5 min-h-11 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200/50">Quay lại</button>
                                <button type="button" onClick={handleReject} disabled={isSaving}
                                    className="px-5 min-h-11 inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50">
                                    {isSaving && <Loader2 size={14} className="animate-spin" />}Xác nhận từ chối
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button" onClick={() => setIsRejecting(true)} disabled={isSaving}
                                    className="px-5 min-h-11 inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 disabled:opacity-50">
                                    <XCircle size={15} />Từ chối
                                </button>
                                <button type="button" onClick={() => run(onApprove)} disabled={isSaving}
                                    title={missing.length > 0 ? "Hồ sơ đang thiếu giấy tờ bắt buộc" : undefined}
                                    className="px-5 min-h-11 inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] disabled:opacity-50">
                                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={15} />}Duyệt hồ sơ
                                </button>
                            </>
                        )}
                    </footer>
                )}
            </div>
        </div>
    );
}
