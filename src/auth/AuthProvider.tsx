import { useState, useEffect, useCallback, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { AdminUser } from "./AuthContext";
import {
  loginApi,
  logout as logoutService,
  onAuthChange,
  getStoredToken,
} from "../services/authService";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Lắng nghe Firebase Auth State thay vì chỉ đọc localStorage một lần.
   * Firebase là "nguồn sự thật" — tự động phục hồi session khi F5,
   * và tự động gia hạn token mỗi giờ.
   */
  useEffect(() => {
    const unsubscribe = onAuthChange((adminUser) => {
      setUser(adminUser);
      setToken(adminUser ? getStoredToken() : null);
      setIsLoading(false);
    });

    // Cleanup: Huỷ lắng nghe khi component unmount
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // loginApi trả về AdminUser trực tiếp (token đã được lưu bên trong authService)
      const adminUser = await loginApi(email, password);
      setUser(adminUser);
      setToken(getStoredToken());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutService(); // Đăng xuất: Backend + Firebase + localStorage
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}