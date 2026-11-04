import type { FeaturedEventResponse, FeaturedEventStatus } from "../../../types/featured.types";

/** Trạng thái hiển thị: APPROVED tách thành "đang ghim" / "hết hạn" (backend giữ APPROVED, FE tự so endDate). */
export type FeaturedDisplayState = "PENDING" | "ACTIVE" | "EXPIRED" | "REJECTED" | "REVOKED" | "CANCELLED";

export const DISPLAY_STATE_META: Record<FeaturedDisplayState, { label: string; className: string }> = {
    PENDING: { label: "Chờ duyệt", className: "bg-amber-50 text-amber-700 border-amber-200" },
    ACTIVE: { label: "Đang ghim", className: "bg-green-50 text-green-700 border-green-200" },
    EXPIRED: { label: "Hết hạn", className: "bg-gray-100 text-gray-500 border-gray-200" },
    REJECTED: { label: "Từ chối", className: "bg-red-50 text-red-600 border-red-200" },
    REVOKED: { label: "Đã gỡ", className: "bg-rose-50 text-rose-700 border-rose-200" },
    CANCELLED: { label: "Tổ chức hủy", className: "bg-slate-100 text-slate-500 border-slate-200" },
};

const PUBLISHED = "PUBLISHED";

export function isExpired(item: FeaturedEventResponse, now: Date = new Date()): boolean {
    return item.status === "APPROVED" && item.endDate !== null && new Date(item.endDate) <= now;
}

export function getDisplayState(item: FeaturedEventResponse, now: Date = new Date()): FeaturedDisplayState {
    if (item.status === "APPROVED") return isExpired(item, now) ? "EXPIRED" : "ACTIVE";
    return item.status;
}

/** Chỉ ghim được sự kiện PUBLISHED — chặn ở FE trước, backend cũng trả 422. */
export function isEventPublic(item: FeaturedEventResponse): boolean {
    return item.eventStatus === PUBLISHED;
}

export const NOT_PUBLIC_MESSAGE = "Muốn ghim thì sự kiện phải được công khai (PUBLISHED).";

export interface FeaturedActions {
    canApprove: boolean;
    canReject: boolean;
    canEdit: boolean;
    canRevoke: boolean;
    canRevokePackage: boolean;
}

export function getAvailableActions(item: FeaturedEventResponse, now: Date = new Date()): FeaturedActions {
    const isActive = getDisplayState(item, now) === "ACTIVE";
    return {
        canApprove: item.status === "PENDING",
        canReject: item.status === "PENDING",
        canEdit: isActive,
        canRevoke: isActive,
        canRevokePackage: item.userPackageId !== null && item.userPackageStatus === "ACTIVE",
    };
}

/** Lý do kết thúc lấy đúng cột theo status — không phân loại bằng chữ của lý do. */
export function getClosingReason(item: FeaturedEventResponse): { label: string; reason: string; at: string | null } | null {
    if (item.status === "REJECTED" && item.rejectReason) return { label: "Lý do từ chối", reason: item.rejectReason, at: item.rejectedAt };
    if (item.status === "REVOKED" && item.revokedReason) return { label: "Lý do gỡ", reason: item.revokedReason, at: item.revokedAt };
    return null;
}

export type FeaturedTab = "ALL" | FeaturedEventStatus | "REMOVAL_REQUESTED";

export const FEATURED_TABS: { key: FeaturedTab; label: string }[] = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ duyệt" },
    { key: "APPROVED", label: "Đã duyệt" },
    { key: "REMOVAL_REQUESTED", label: "Tổ chức xin gỡ" },
    { key: "REJECTED", label: "Từ chối" },
    { key: "REVOKED", label: "Đã gỡ" },
    { key: "CANCELLED", label: "Tổ chức hủy" },
];

const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
};

export function formatDateTime(iso: string | null): string {
    return iso ? new Date(iso).toLocaleString("vi-VN", DATE_TIME_FORMAT) : "—";
}

const pad = (n: number): string => String(n).padStart(2, "0");

/** ISO (UTC) → giá trị cho <input type="datetime-local"> theo giờ máy. */
export function toDateTimeLocal(iso: string | null): string {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const shortId = (id: string): string => id.slice(-8);
