import { AdminUser } from "../auth/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const TOKEN_KEY = "admin_token";
const USER_KEY = "admin_user";

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

// ─────────────────────────────────────────────
// 🧪 MOCK DATA — Xóa block này khi có API thật
// ─────────────────────────────────────────────
const MOCK_ACCOUNTS: Record<string, { password: string; user: AdminUser }> = {
  admin: {
    password: "admin",
    user: {
      id: "mock-admin-001",
      email: "admin@sevents.vn",
      name: "Super Admin",
      role: "admin",
      avatar: undefined,
    },
  },
};

function mockLogin(email: string, password: string): LoginResponse | null {
  const account = MOCK_ACCOUNTS[email];
  if (!account || account.password !== password) return null;
  return {
    token: "mock-token-" + btoa(email + ":" + Date.now()),
    user: account.user,
  };
}
// ─────────────────────────────────────────────

/**
 * Gọi API đăng nhập.
 * Nếu trùng mock account thì trả về luôn mà không gọi API.
 * TODO: Xóa phần mock khi backend đã sẵn sàng.
 */
export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  // --- MOCK: thử đăng nhập bằng tài khoản mock trước ---
  const mockResult = mockLogin(email, password);
  if (mockResult) {
    // Giả lập độ trễ network nhỏ cho chân thực hơn
    await new Promise((r) => setTimeout(r, 600));
    return mockResult;
  }
  // --- END MOCK ---

  const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Email hoặc mật khẩu không đúng");
  }

  return res.json();
}

/** Lưu token + user vào localStorage */
export function saveSession(token: string, user: AdminUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Đọc token từ localStorage */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Đọc user từ localStorage */
export function getStoredUser(): AdminUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

/** Xóa session */
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
