import { http } from "./apiClient";
import { ApiError } from "./apiError";
import { AccountApi } from "./user-management/AccountApi";
import { clearSession, getAccessToken, getRefreshToken, getStoredUser, saveTokens, saveUser } from "./session";
import type { AdminUser } from "../auth/AuthContext";
import type { AuthResponse } from "../types/account.types";

const NOT_ADMIN_MESSAGE = "Tài khoản không có quyền truy cập trang quản trị";

/** Thu hồi refresh token ở backend; lỗi (token đã hết hạn...) không chặn việc xóa phiên phía client. */
async function revokeRefreshToken(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return;
  try {
    await http.post<void>("/auth/logout", { refreshToken });
  } catch {
    // bỏ qua — phiên phía client vẫn bị xóa
  }
}

/**
 * Đăng nhập: POST /auth/login → AuthResponse.
 * Tài khoản không phải ADMIN → thu hồi token vừa cấp và báo lỗi. Tài khoản bị khóa → backend tự trả lỗi.
 */
export async function loginApi(email: string, password: string): Promise<AdminUser> {
  const auth = await http.post<AuthResponse>("/auth/login", { email, password });
  saveTokens(auth);

  if (auth.role !== "ADMIN") {
    await revokeRefreshToken();
    clearSession();
    throw new ApiError(NOT_ADMIN_MESSAGE, 403, "ACCESS_DENIED");
  }

  // Tài khoản ADMIN không có hồ sơ → hiển thị bằng email
  const user: AdminUser = { id: auth.userId, email: auth.email, name: auth.email, role: auth.role };
  saveUser(user);
  return user;
}

/** Đăng xuất: POST /auth/logout { refreshToken } rồi xóa phiên. */
export async function logout(): Promise<void> {
  await revokeRefreshToken();
  clearSession();
}

/**
 * Khôi phục phiên khi F5: còn token đã lưu → gọi GET /admin/accounts/{id} để vừa kiểm tra token
 * (401 thì interceptor tự refresh), vừa xác nhận tài khoản vẫn là ADMIN đang hoạt động.
 */
export async function restoreSession(): Promise<AdminUser | null> {
  const stored = getStoredUser();
  if (!stored || !getAccessToken()) {
    clearSession();
    return null;
  }
  try {
    const account = await AccountApi.getAccount(stored.id);
    if (account.role !== "ADMIN" || account.status !== "ACTIVE") {
      await logout();
      return null;
    }
    return stored;
  } catch {
    clearSession();
    return null;
  }
}

export function getStoredToken(): string | null {
  return getAccessToken();
}
