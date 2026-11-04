import { useState } from "react";
import { Info, Lock } from "lucide-react";
import { getErrorMessage } from "../../../../services/apiError";
import { FEATURE_PLACEMENT_LABELS } from "../../../../types/package.types";
import type { FeaturedApproveRequest, FeaturedEventResponse, FeaturedUpdateRequest } from "../../../../types/featured.types";
import { formatDateTime, isEventPublic, NOT_PUBLIC_MESSAGE, toDateTimeLocal } from "../featuredDisplay";
import { parseApprove, parseUpdate } from "../featuredForm.schema";
import FeaturedModalShell, { FIELD_LABEL_CLS, INPUT_CLS } from "./FeaturedModalShell";

type Props =
    | { mode: "approve"; item: FeaturedEventResponse; onClose: () => void; onSubmit: (body: FeaturedApproveRequest) => Promise<unknown> }
    | { mode: "edit"; item: FeaturedEventResponse; onClose: () => void; onSubmit: (body: FeaturedUpdateRequest) => Promise<unknown> };

const DEFAULT_PRIORITY = "10";

/** Duyệt đơn (priority + address) hoặc sửa bản ghi đang ghim (priority + endDate + address). */
export default function FeaturedSettingsModal(props: Props) {
    const { mode, item, onClose } = props;
    const [priority, setPriority] = useState(item.priority !== null ? String(item.priority) : DEFAULT_PRIORITY);
    const [address, setAddress] = useState(item.address ?? "");
    const [endDate, setEndDate] = useState(toDateTimeLocal(item.endDate));
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const isPublic = isEventPublic(item);

    const submit = async (action: () => Promise<unknown>) => {
        setError(null);
        setIsSaving(true);
        try {
            await action();
            onClose();
        } catch (err: unknown) {
            // Backend 422 (vd. sự kiện không còn công khai) → hiện nguyên message
            setError(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = () => {
        if (props.mode === "approve") {
            const parsed = parseApprove({ priority, address });
            if (!parsed.ok) return setError(parsed.error);
            const { onSubmit } = props;
            return submit(() => onSubmit(parsed.payload));
        }
        const parsed = parseUpdate({ priority, endDate, address }, { startDate: item.startDate, eventEndTime: item.eventEndTime });
        if (!parsed.ok) return setError(parsed.error);
        const { onSubmit } = props;
        return submit(() => onSubmit(parsed.payload));
    };

    const placementLabel = FEATURE_PLACEMENT_LABELS[item.placement] ?? item.placement;

    return (
        <FeaturedModalShell
            title={mode === "approve" ? "Duyệt đơn nổi bật" : "Sửa sự kiện đang ghim"}
            subtitle={<>Sự kiện: <strong className="text-gray-700">{item.eventTitle ?? item.eventId}</strong>{item.organizerName && <> · {item.organizerName}</>}</>}
            error={error}
            isSaving={isSaving}
            submitLabel={mode === "approve" ? "Duyệt & hiển thị" : "Lưu thay đổi"}
            isSubmitDisabled={!isPublic}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            {!isPublic && (
                <p role="alert" className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                    <Lock size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {NOT_PUBLIC_MESSAGE} Hiện tại: {item.eventStatus ?? "không rõ"}.
                </p>
            )}

            <dl className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-gray-50 px-3 py-2"><dt className="text-gray-400">Vị trí (theo gói)</dt><dd className="font-semibold text-gray-700">{placementLabel}</dd></div>
                <div className="rounded-xl bg-gray-50 px-3 py-2"><dt className="text-gray-400">Số ngày (theo gói)</dt><dd className="font-semibold text-gray-700">{item.durationDays} ngày</dd></div>
                {mode === "edit" && (
                    <div className="rounded-xl bg-gray-50 px-3 py-2 col-span-2"><dt className="text-gray-400">Bắt đầu ghim</dt><dd className="font-semibold text-gray-700">{formatDateTime(item.startDate)}</dd></div>
                )}
            </dl>

            {mode === "approve" && (
                <p className="flex items-start gap-2 text-xs text-gray-500">
                    <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    Khung giờ tính từ lúc duyệt + {item.durationDays} ngày (cắt theo giờ kết thúc sự kiện).
                </p>
            )}
            {item.note && <p className="text-xs text-gray-500">Ghi chú của tổ chức: <span className="italic">“{item.note}”</span></p>}

            <label className={FIELD_LABEL_CLS}>
                Độ ưu tiên * <span className="font-normal normal-case text-gray-400">(1 = cao nhất, tối đa 1000)</span>
                <input type="number" min={1} max={1000} value={priority} onChange={(e) => setPriority(e.target.value)} className={INPUT_CLS} />
            </label>
            {mode === "edit" && (
                <label className={FIELD_LABEL_CLS}>
                    Kết thúc ghim *
                    <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                        max={toDateTimeLocal(item.eventEndTime) || undefined} className={INPUT_CLS} />
                    {item.eventEndTime && <span className="font-normal normal-case text-gray-400">Sự kiện kết thúc lúc {formatDateTime(item.eventEndTime)}</span>}
                </label>
            )}
            <label className={FIELD_LABEL_CLS}>
                Địa chỉ hiển thị
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={255} placeholder="Để trống nếu không cần" className={INPUT_CLS} />
            </label>
        </FeaturedModalShell>
    );
}
