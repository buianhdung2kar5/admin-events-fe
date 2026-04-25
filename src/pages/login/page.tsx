import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-text">S</span>
          </div>
          <h1 className="login-title">S-EVENTS Admin</h1>
          <p className="login-subtitle">Đăng nhập để truy cập bảng điều khiển</p>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Email */}
          <div className="login-field">
            <label className="login-label" htmlFor="admin-email">
              Email
            </label>
            <div className="login-input-wrapper">
              <Mail size={18} className="login-input-icon" />
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="admin@sevents.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label" htmlFor="admin-password">
              Mật khẩu
            </label>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-input-icon" />
              <input
                id="admin-password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input login-input-password"
                disabled={loading}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPass((p) => !p)}
                tabIndex={-1}
                aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="btn-login-submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="login-spinner" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="login-footer">
          © {new Date().getFullYear()} S-Events · Hệ thống quản trị nội bộ
        </p>
      </div>
    </div>
  );
}
