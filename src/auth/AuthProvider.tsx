import { useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { AuthContext, AdminUser } from "./AuthContext";
import { loginApi, logout as logoutService, restoreSession, getStoredToken } from "../services/authService";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Khôi phục phiên (token lưu ở localStorage) khi tải lại trang — xác thực lại với backend. */
  useEffect(() => {
    let isActive = true;
    restoreSession().then((restored) => {
      if (!isActive) return;
      setUser(restored);
      setToken(restored ? getStoredToken() : null);
      setIsLoading(false);
    });
    return () => {
      isActive = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
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
      await logoutService();
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, token, isAuthenticated: !!token && !!user, isLoading, login, logout }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
