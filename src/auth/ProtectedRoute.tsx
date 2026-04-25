import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Bọc quanh các route cần bảo vệ.
 * Nếu chưa đăng nhập → redirect về /login.
 */
export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#0092B8] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
