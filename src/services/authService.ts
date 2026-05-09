import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { AdminUser } from "../auth/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const TOKEN_KEY = "id_token";   
const USER_KEY  = "admin_user"; 
export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export async function loginApi(email: string, password: string): Promise<AdminUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await credential.user.getIdToken();
  const res = await fetch(`${BASE_URL}/auth/verify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Xác thực thất bại");
  }

  const data = await res.json();
  const user = data.object;
  if (user?.role !== "ADMIN") {
    await signOut(auth);
    throw new Error("Tài khoản không có quyền truy cập trang quản trị");
  }

  if (user?.status === "DISABLED") {
    await signOut(auth);
    throw new Error("Tài khoản đã bị vô hiệu hoá");
  }
  saveSession(idToken, user);

  return user;
}
export async function logout(): Promise<void> {
  try {
    // Thông báo cho Backend invalidate session phía server
    const token = getStoredToken();
    if (token) {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch {
  } finally {
    await signOut(auth); 
    clearSession();      
  }
}

// ─── Lắng nghe trạng thái đăng nhập (dùng trong AuthProvider) ──────────────
/**
 * Lắng nghe Firebase Auth State.
 * Khi F5 hoặc mở tab mới, Firebase tự động kiểm tra và phục hồi session.
 * Trả về hàm unsubscribe để cleanup trong useEffect.
 */
export function onAuthChange(callback: (user: AdminUser | null) => void): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    try {
      // Lấy token mới nhất (Firebase tự gia hạn mỗi giờ)
      const idToken = await firebaseUser.getIdToken();

      // Gọi Backend để lấy thông tin user mới nhất
      const res = await fetch(`${BASE_URL}/auth/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!res.ok) {
        callback(null);
        return;
      }

      const data = await res.json();
      const user = data.object;

      if (user?.role !== "ADMIN") {
        callback(null);
        return;
      }

      // Cập nhật token mới nhất vào localStorage
      saveSession(idToken, user);
      callback(user);
    } catch {
      callback(null);
    }
  });
}

/** Kiểm tra token có hết hạn hay không */
export function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload);
    // Trả về true nếu token hết hạn trong vòng 5 phút tới (để an toàn)
    return Date.now() / 1000 >= exp - 300;
  } catch {
    return true;
  }
}

/** Làm mới token từ Firebase */
export async function refreshToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const newToken = await user.getIdToken(true);
    const adminUser = getStoredUser();
    if (adminUser) {
      saveSession(newToken, adminUser);
    }
    return newToken;
  } catch (error) {
    console.error("Lỗi khi refresh token:", error);
    return null;
  }
}

/** Lấy token hợp lệ (tự động refresh nếu cần) */
export async function getValidToken(): Promise<string | null> {
  let token = getStoredToken();
  if (!token) return null;

  if (isTokenExpired(token)) {
    console.log("Token expired, refreshing...");
    token = await refreshToken();
  }

  return token;
}

// ─── Quản lý LocalStorage ───────────────────────────────────────────────────

/** Lưu token + user vào localStorage */
export function saveSession(token: string, user: AdminUser): void {
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

/** Xóa toàn bộ session */
export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
