import { useEffect, useState } from "react";
import { Search, Check, Loader2, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { FeaturedApi } from "../../../../services/events-management/FeaturedEventsApi";
import { getErrorMessage } from "../../../../services/apiError";
import { FEATURE_PLACEMENT_LABELS, type FeaturePlacement } from "../../../../types/package.types";
import type { FeaturedCreateRequest, PublicEventSummary } from "../../../../types/featured.types";
import { formatDateTime } from "../featuredDisplay";
import { parseCreate } from "../featuredForm.schema";
import FeaturedModalShell, { FIELD_LABEL_CLS, INPUT_CLS } from "./FeaturedModalShell";

const SEARCH_DEBOUNCE_MS = 300;
const PLACEMENT_OPTIONS = Object.entries(FEATURE_PLACEMENT_LABELS) as [FeaturePlacement, string][];

interface Props {
    onClose: () => void;
    onSubmit: (body: FeaturedCreateRequest) => Promise<unknown>;
}

/**
 * Admin gắn trực tiếp sự kiện nổi bật (không cần đơn, không trừ lượt).
 * Chỉ chọn được sự kiện công khai: danh sách lấy từ /public/events (chỉ trả PUBLISHED).
 */
export default function FeaturedFormModal({ onClose, onSubmit }: Props) {
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const [selected, setSelected] = useState<PublicEventSummary | null>(null);
    const [placement, setPlacement] = useState<FeaturePlacement>("HOME_TOP");
    const [priority, setPriority] = useState("10");
    const [durationDays, setDurationDays] = useState("7");
    const [address, setAddress] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedKeyword(keyword.trim()), SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [keyword]);

    const { data, isFetching, isError } = useQuery({
        queryKey: ["public-events-search", debouncedKeyword],
        queryFn: () => FeaturedApi.searchPublicEvents(debouncedKeyword),
    });
    const events = data?.items ?? [];

    const handleSubmit = async () => {
        const parsed = parseCreate({ eventId: selected?.id ?? "", placement, priority, durationDays, address });
        if (!parsed.ok) {
            setError(parsed.error);
            return;
        }
        setError(null);
        setIsSaving(true);
        try {
            await onSubmit(parsed.payload);
            onClose();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Gắn sự kiện nổi bật thất bại"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <FeaturedModalShell
            title="Gắn sự kiện nổi bật"
            subtitle="Admin gắn trực tiếp — hiển thị ngay, không trừ lượt của tổ chức"
            error={error}
            isSaving={isSaving}
            submitLabel="Gắn nổi bật"
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <div className={FIELD_LABEL_CLS}>
                <span>Sự kiện công khai *</span>
                <label className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 min-h-11 focus-within:border-[#0092B8]">
                    <Search size={15} className="text-gray-400 shrink-0" aria-hidden="true" />
                    <input type="search" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm theo tiêu đề sự kiện..."
                        aria-label="Tìm sự kiện công khai" className="flex-1 text-sm font-normal normal-case tracking-normal outline-none bg-transparent" />
                    {isFetching && <Loader2 size={14} className="animate-spin text-[#0092B8]" />}
                </label>
                <ul className="max-h-48 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50 font-normal normal-case tracking-normal" role="listbox" aria-label="Sự kiện công khai">
                    {isError && <li className="px-3 py-3 text-xs text-red-500">Không tải được danh sách sự kiện</li>}
                    {!isError && events.length === 0 && !isFetching && <li className="px-3 py-3 text-xs text-gray-400">Không có sự kiện công khai phù hợp</li>}
                    {events.map((event) => {
                        const isSelected = selected?.id === event.id;
                        return (
                            <li key={event.id} role="option" aria-selected={isSelected}>
                                <button type="button" onClick={() => setSelected(event)}
                                    className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${isSelected ? "bg-[#0092B8]/10" : "hover:bg-gray-50"}`}>
                                    <span className="flex-1 min-w-0">
                                        <span className="block text-sm font-semibold text-gray-800 truncate">{event.title}</span>
                                        <span className="block text-[11px] text-gray-400 truncate">{event.organizerName ?? "—"} · kết thúc {formatDateTime(event.endTime)}</span>
                                    </span>
                                    {isSelected && <Check size={16} className="text-[#0092B8] shrink-0" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <span className="flex items-start gap-1.5 font-normal normal-case tracking-normal text-[11px] text-gray-400">
                    <Info size={12} className="mt-0.5 shrink-0" aria-hidden="true" />Chỉ sự kiện đã công khai (PUBLISHED) mới ghim được.
                </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <label className={FIELD_LABEL_CLS}>
                    Vị trí *
                    <select value={placement} onChange={(e) => setPlacement(e.target.value as FeaturePlacement)} className={`${INPUT_CLS} bg-white`}>
                        {PLACEMENT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </label>
                <label className={FIELD_LABEL_CLS}>
                    Ưu tiên *
                    <input type="number" min={1} max={1000} value={priority} onChange={(e) => setPriority(e.target.value)} className={INPUT_CLS} />
                </label>
                <label className={FIELD_LABEL_CLS}>
                    Số ngày *
                    <input type="number" min={1} max={365} value={durationDays} onChange={(e) => setDurationDays(e.target.value)} className={INPUT_CLS} />
                </label>
            </div>
            <label className={FIELD_LABEL_CLS}>
                Địa chỉ hiển thị
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={255} placeholder="Để trống nếu không cần" className={INPUT_CLS} />
            </label>
        </FeaturedModalShell>
    );
}
