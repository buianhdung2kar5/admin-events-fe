/** Khớp contract backend: AuthResponse, AccountSummaryResponse, AccountDetailResponse, *ProfileResponse. */
export type UserRole = "USER" | "ORGANIZATION" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type OrganizationVerifyStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface AuthResponse {
  userId: string;
  email: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiredAt: string;
}

/** Một dòng trong GET /admin/accounts */
export interface AccountSummary {
  id: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  status: UserStatus;
  /** fullName (USER) hoặc organizationName (ORGANIZATION) */
  displayName: string | null;
  /** avatarUrl (USER) hoặc logoUrl (ORGANIZATION) */
  avatarUrl: string | null;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  fullName: string | null;
  gender: string | null;
  /** YYYY-MM-DD */
  birthOfDate: string | null;
  studentCode: string | null;
  university: string | null;
  faculty: string | null;
  major: string | null;
  avatarUrl: string | null;
}

export interface OrganizationProfile {
  userId: string;
  email: string;
  organizationName: string;
  organizationType: string | null;
  address: string | null;
  logoUrl: string | null;
  description: string | null;
  verificationStatus: OrganizationVerifyStatus;
  verifiedTime: string | null;
}

/** GET /admin/accounts/{id} — hồ sơ chọn theo role (USER → userProfile, ORGANIZATION → organizationProfile). */
export interface AccountDetail {
  id: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  status: UserStatus;
  currentCoin: number | null;
  createdAt: string;
  updatedAt: string | null;
  userProfile: UserProfile | null;
  organizationProfile: OrganizationProfile | null;
}

export interface AccountListParams {
  role?: UserRole;
  status?: UserStatus;
  keyword?: string;
  page?: number;
  size?: number;
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Hoạt động",
  BLOCKED: "Bị khóa",
};
