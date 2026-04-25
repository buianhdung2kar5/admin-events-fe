import { useState, useEffect, useCallback, ReactNode } from "react";
import { AuthContext, AdminUser } from "./AuthContext";
import {
  loginApi,
  saveSession,
  clearSession,
  getStoredToken,
  getStoredUser,
} from "../services/authService";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Khởi tạo session từ localStorage */
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginApi(email, password);
      saveSession(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
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