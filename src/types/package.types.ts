/** Khớp contract backend: PackageResponse / PackageUpsertRequest (/admin/packages). */
export type PackageStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";
export type PackageUseFor = "USER" | "ORGANIZATION" | "ALL";

export interface PackageResponse {
  id: string;
  name: string;
  description: string | null;
  /** Số nguyên VND (backend trả BigDecimal → JSON number) */
  price: number;
  durationDays: number;
  discount: boolean;
  sortOrder: number;
  tag: string | null;
  useFor: PackageUseFor;
  status: PackageStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface PackageUpsertRequest {
  name: string;
  description: string | null;
  price: number;
  durationDays: number;
  discount: boolean;
  sortOrder: number;
  tag: string | null;
  useFor: PackageUseFor;
}

export interface PackageListParams {
  status?: PackageStatus;
  useFor?: PackageUseFor;
  page?: number;
  size?: number;
}

export const PACKAGE_STATUS_LABELS: Record<PackageStatus, string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đang bán",
  HIDDEN: "Ngừng bán",
};

export const PACKAGE_USE_FOR_LABELS: Record<PackageUseFor, string> = {
  USER: "Người dùng",
  ORGANIZATION: "Tổ chức",
  ALL: "Tất cả",
};
