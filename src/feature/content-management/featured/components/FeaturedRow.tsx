import { Check, X, Edit3, PinOff, ShieldOff, Flag, Building2 } from "lucide-react";
import type { ReactNode } from "react";
import { FEATURE_PLACEMENT_LABELS } from "../../../../types/package.types";
import type { FeaturedEventResponse } from "../../../../types/featured.types";
import {
    DISPLAY_STATE_META,
    formatDateTime,
    getAvailableActions,
    getClosingReason,
    getDisplayState,
    isEventPublic,
    NOT_PUBLIC_MESSAGE,
    shortId,
} from "../featuredDisplay";

export type FeaturedRowAction = "approve" | "reject" | "edit" | "revoke" | "revokePackage";

interface Props {
    item: FeaturedEventResponse;
    now: Date;
    onAction: (action: FeaturedRowAction, item: FeaturedEventResponse) => void;
}

const SAFE_IMAGE_PROTOCOL = "https:";

function safeImageUrl(url: string | null): string | undefined {
    if (!url) return undefined;
    try {
        return new URL(url).protocol === SAFE_IMAGE_PROTOCOL ? url : undefined;
    } catch {
        return undefined;
    }
}

function ActionButton({ label, icon, tone, disabled, title, onClick }: {
    label: string; icon: ReactNode; tone: string; disabled?: boolean; title?: string; onClick: () => void;
}) {
    return (
        <button type="button" onClick={onClick} disabled={disabled} title={title ?? label}
            className={`inline-flex items-center gap-1.5 px-2.5 min-h-9 rounded-lg border text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${tone}`}>
            {icon}{label}
        </button>
    );
}

/** Một dòng trong bảng sự kiện nổi bật; nút thao tác theo trạng thái. */
export default function FeaturedRow({ item, now, onAction }: Props) {
    const state = getDisplayState(item, now);
    const meta = DISPLAY_STATE_META[state];
    const actions = getAvailableActions(item, now);
    const isPublic = isEventPublic(item);
    const closing = getClosingReason(item);
    const logo = safeImageUrl(item.organizerLogoUrl);
    const notPublicTitle = isPublic ? undefined : NOT_PUBLIC_MESSAGE;

    return (
        <tr className="align-top hover:bg-blue-50/30 transition-colors">
            <td className="px-5 py-4 min-w-[240px]">
                <p className="font-bold text-gray-800">{item.eventTitle ?? `Sự kiện #${shortId(item.eventId)}`}</p>
                {!isPublic && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold uppercase">
                        Không công khai · {item.eventStatus ?? "?"}
                    </span>
                )}
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                    {logo ? <img src={logo} alt="" width={16} height={16} loading="lazy" className="w-4 h-4 rounded-full object-cover" /> : <Building2 size={13} aria-hidden="true" />}
                    {item.organizerName ?? `Tổ chức #${shortId(item.userId)}`}
                </p>
            </td>
            <td className="px-5 py-4 text-xs">
                {item.userPackageId ? (
                    <span className="font-semibold text-gray-700">{item.packageName ?? `Gói #${shortId(item.userPackageId)}`}</span>
                ) : (
                    <span className="px-2 py-0.5 rounded-md bg-[#0092B8]/10 text-[#0092B8] font-bold">Admin gắn</span>
                )}
                {item.userPackageStatus && item.userPackageStatus !== "ACTIVE" && (
                    <p className="mt-1 text-[11px] text-gray-400">Lần mua: {item.userPackageStatus}</p>
                )}
            </td>
            <td className="px-5 py-4 text-xs text-gray-600 whitespace-nowrap">
                <p className="font-semibold">{FEATURE_PLACEMENT_LABELS[item.placement] ?? item.placement}</p>
                <p className="text-gray-400">Ưu tiên {item.priority ?? "—"} · {item.durationDays} ngày</p>
            </td>
            <td className="px-5 py-4 text-xs text-gray-600 whitespace-nowrap">
                {item.startDate ? (
                    <>
                        <p>{formatDateTime(item.startDate)}</p>
                        <p className="text-gray-400">→ {formatDateTime(item.endDate)}</p>
                    </>
                ) : (
                    <p className="text-gray-400">Tính khi duyệt<br />Gửi {formatDateTime(item.createdAt)}</p>
                )}
            </td>
            <td className="px-5 py-4 text-xs max-w-[240px]">
                <span className={`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-bold ${meta.className}`}>{meta.label}</span>
                {item.removalRequestedAt && state === "ACTIVE" && (
                    <p className="mt-2 flex items-start gap-1 text-amber-700 font-semibold">
                        <Flag size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span>Tổ chức xin gỡ{item.removalReason && <span className="font-normal italic"> — “{item.removalReason}”</span>}</span>
                    </p>
                )}
                {closing && (
                    <p className="mt-2 text-gray-500">
                        <span className="font-semibold">{closing.label}:</span> {closing.reason}
                        {closing.at && <span className="block text-gray-400">{formatDateTime(closing.at)}</span>}
                    </p>
                )}
            </td>
            <td className="px-5 py-4">
                <div className="flex flex-wrap justify-end gap-1.5">
                    {actions.canApprove && (
                        <ActionButton label="Duyệt" icon={<Check size={13} />} disabled={!isPublic} title={notPublicTitle}
                            tone="text-green-700 bg-green-50 border-green-100 hover:bg-green-100" onClick={() => onAction("approve", item)} />
                    )}
                    {actions.canReject && (
                        <ActionButton label="Từ chối" icon={<X size={13} />}
                            tone="text-red-600 bg-red-50 border-red-100 hover:bg-red-100" onClick={() => onAction("reject", item)} />
                    )}
                    {actions.canEdit && (
                        <ActionButton label="Sửa" icon={<Edit3 size={13} />} disabled={!isPublic} title={notPublicTitle}
                            tone="text-amber-700 bg-amber-50 border-amber-100 hover:bg-amber-100" onClick={() => onAction("edit", item)} />
                    )}
                    {actions.canRevoke && (
                        <ActionButton label="Gỡ ghim" icon={<PinOff size={13} />}
                            tone="text-rose-700 bg-rose-50 border-rose-100 hover:bg-rose-100" onClick={() => onAction("revoke", item)} />
                    )}
                    {actions.canRevokePackage && (
                        <ActionButton label="Thu hồi gói" icon={<ShieldOff size={13} />}
                            tone="text-gray-600 bg-white border-gray-200 hover:bg-gray-50" onClick={() => onAction("revokePackage", item)} />
                    )}
                </div>
            </td>
        </tr>
    );
}
