import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { getErrorMessage } from "../../../../services/apiError";
import type { FeaturedEventResponse } from "../../../../types/featured.types";
import { parseReason, REASON_MAX } from "../featuredForm.schema";
import FeaturedModalShell, { FIELD_LABEL_CLS, INPUT_CLS } from "./FeaturedModalShell";

export type ReasonAction = "reject" | "revoke" | "revokePackage";

const COPY: Record<ReasonAction, { title: string; submit: string; warning: (item: FeaturedEventResponse) => string }> = {
    reject: {
        title: "Từ chối đơn nổi bật",
        submit: "Từ chối",
        warning: () => "Đơn chuyển sang Từ chối và tổ chức được trả lại 1 lượt nổi bật.",
    },
    revoke: {
        title: "Gỡ ghim sự kiện",
        submit: "Gỡ ghim",
        warning: () => "Banner dừng hiển thị ngay (kết thúc tại thời điểm gỡ). Tổ chức KHÔNG được trả lượt.",
    },
    revokePackage: {
        title: "Thu hồi gói của tổ chức",
        submit: "Thu hồi gói",
        warning: (item) =>
            `Thu hồi lần mua gói "${item.packageName ?? "—"}" sẽ cắt MỌI quyền lợi của lần mua đó ngay lập tức: hạn mức đăng / nổi bật giảm, mọi đơn chờ và banner đang chạy của lần mua bị gỡ, không trả lượt. Không chỉ riêng banner này. Nếu chỉ muốn bỏ banner, hãy dùng "Gỡ ghim".`,
    },
};

interface Props {
    action: ReasonAction;
    item: FeaturedEventResponse;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<unknown>;
}

/** Hỏi lý do (bắt buộc, ≤500) cho Từ chối / Gỡ ghim / Thu hồi gói. */
export default function FeaturedReasonModal({ action, item, onClose, onConfirm }: Props) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const copy = COPY[action];

    const handleSubmit = async () => {
        const parsed = parseReason(reason);
        if (!parsed.ok) {
            setError(parsed.error);
            return;
        }
        setError(null);
        setIsSaving(true);
        try {
            await onConfirm(parsed.payload);
            onClose();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <FeaturedModalShell
            title={copy.title}
            subtitle={<>Sự kiện: <strong className="text-gray-700">{item.eventTitle ?? item.eventId}</strong></>}
            error={error}
            isSaving={isSaving}
            submitLabel={copy.submit}
            tone="danger"
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <p className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 text-xs font-medium text-amber-800 leading-relaxed">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{copy.warning(item)}
            </p>
            {item.removalReason && action === "revoke" && (
                <p className="text-xs text-gray-500">Tổ chức xin gỡ: <span className="italic">“{item.removalReason}”</span></p>
            )}
            <label className={FIELD_LABEL_CLS}>
                Lý do *
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} maxLength={REASON_MAX} rows={3} autoFocus
                    placeholder="Lý do sẽ hiển thị cho tổ chức" className={`${INPUT_CLS} resize-none`} />
                <span className="self-end text-[11px] font-normal text-gray-400">{reason.length}/{REASON_MAX}</span>
            </label>
        </FeaturedModalShell>
    );
}
