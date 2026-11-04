import type { FeaturePlacement } from "./package.types";

/**
 * Khớp contract backend §8c (FeaturedEventResponse, /admin/featured-events).
 * Một bản ghi đi trọn vòng đời: PENDING → APPROVED | REJECTED | CANCELLED; APPROVED → REVOKED.
 */
export type FeaturedEventStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "REVOKED";

/** Trạng thái lần mua gói (UserPackageResponse.status). */
export type UserPackageStatus = "PENDING_PAYMENT" | "ACTIVE" | "EXPIRED" | "REVOKED" | "CANCELLED";

export interface FeaturedEventResponse {
  id: string;
  userId: string;
  eventId: string;
  /** null = Admin gắn trực tiếp */
  userPackageId: string | null;
  placement: FeaturePlacement;
  durationDays: number;
  priority: number | null;
  /** 3 field null khi PENDING (khung giờ tính lúc duyệt) */
  startDate: string | null;
  endDate: string | null;
  address: string | null;
  note: string | null;
  status: FeaturedEventStatus;
  approvedAt: string | null;
  rejectReason: string | null;
  rejectedAt: string | null;
  revokedReason: string | null;
  revokedAt: string | null;
  removalRequestedAt: string | null;
  removalReason: string | null;
  eventTitle: string | null;
  eventStatus: string | null;
  eventEndTime: string | null;
  organizerName: string | null;
  organizerLogoUrl: string | null;
  /** 2 field null khi Admin gắn */
  packageName: string | null;
  userPackageStatus: UserPackageStatus | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface FeaturedEventListParams {
  status?: FeaturedEventStatus;
  placement?: FeaturePlacement;
  removalRequested?: boolean;
  page: number;
  size: number;
}

export interface FeaturedApproveRequest {
  priority: number;
  address: string | null;
}

export interface FeaturedCreateRequest {
  eventId: string;
  placement: FeaturePlacement;
  priority: number;
  durationDays: number;
  address: string | null;
}

export interface FeaturedUpdateRequest {
  priority: number;
  endDate: string;
  address: string | null;
}

/** Sự kiện public (GET /public/events) — chỉ các field cần cho ô chọn sự kiện. */
export interface PublicEventSummary {
  id: string;
  title: string;
  organizerName: string | null;
  bannerUrl: string | null;
  startTime: string;
  endTime: string;
}
