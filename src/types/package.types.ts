/** Khớp contract backend: PackageResponse / PackageUpsertRequest (/admin/packages). */
export type PackageStatus = "DRAFT" | "PUBLISHED";
export type PackageUseFor = "USER" | "ORGANIZATION" | "ALL";

/** Vị trí hiển thị sự kiện nổi bật — hiện backend chỉ có HOME_TOP, sẽ thêm sau. */
export type FeaturePlacement = "HOME_TOP";

export interface PublishBenefitConfig {
  monthlyQuota: number;
}

export interface FeatureBenefitConfig {
  monthlyQuota: number;
  placement: FeaturePlacement;
  durationDays: number;
}

/** Quyền lợi theo lượt (key = action). Chỉ hợp lệ với gói useFor = ORGANIZATION. */
export interface PackageConfig {
  EVENT_PUBLISH?: PublishBenefitConfig;
  EVENT_FEATURE?: FeatureBenefitConfig;
}

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
  config: PackageConfig | null;
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
  /** PUT thay toàn bộ — null = bỏ quyền lợi */
  config: PackageConfig | null;
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
};

export const PACKAGE_USE_FOR_LABELS: Record<PackageUseFor, string> = {
  USER: "Người dùng",
  ORGANIZATION: "Tổ chức",
  ALL: "Tất cả",
};

export const FEATURE_PLACEMENT_LABELS: Record<FeaturePlacement, string> = {
  HOME_TOP: "Đầu trang chủ",
};

/** Tóm tắt quyền lợi cho card / bảng, vd. ["30 lượt đăng/tháng", "5 lượt nổi bật/tháng (Đầu trang chủ, 10 ngày)"]. */
export function describePackageConfig(config: PackageConfig | null): string[] {
  if (!config) return [];
  const lines: string[] = [];
  if (config.EVENT_PUBLISH) lines.push(`${config.EVENT_PUBLISH.monthlyQuota} lượt đăng sự kiện/tháng`);
  if (config.EVENT_FEATURE) {
    const { monthlyQuota, placement, durationDays } = config.EVENT_FEATURE;
    lines.push(`${monthlyQuota} lượt nổi bật/tháng (${FEATURE_PLACEMENT_LABELS[placement] ?? placement}, ${durationDays} ngày)`);
  }
  return lines;
}
