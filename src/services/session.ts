import type { AdminUser } from "../auth/AuthContext";

/**
 * Lưu phiên Admin ở localStorage.
 * Lưu ý bảo mật: rule khuyên httpOnly cookie, nhưng backend đang trả token trong body
 * → tạm dùng localStorage; đổi sang cookie khi backend hỗ trợ.
 */
const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const USER_KEY = "admin_user";
/** Key của bản Firebase cũ — xóa khi dọn phiên để không còn token rác. */
const LEGACY_KEYS = ["id_token"];

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Trình duyệt chặn storage (chế độ riêng tư) → phiên chỉ sống trong bộ nhớ
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // bỏ qua
  }
}

export function getAccessToken(): string | null {
  return read(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return read(REFRESH_TOKEN_KEY);
}

export function saveTokens({ accessToken, refreshToken }: TokenPair): void {
  write(ACCESS_TOKEN_KEY, accessToken);
  write(REFRESH_TOKEN_KEY, refreshToken);
}

export function saveUser(user: AdminUser): void {
  write(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): AdminUser | null {
  const raw = read(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, ...LEGACY_KEYS].forEach(remove);
}
