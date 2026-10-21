import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiError, toApiError } from "./apiError";
import { clearSession, getAccessToken, getRefreshToken, saveTokens, type TokenPair } from "./session";
import type { ApiEnvelope } from "../types/api.types";

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Base URL PHẢI gồm "/api/v1". Chạy local dùng proxy của CRA:
 * .env.development.local → REACT_APP_API_URL=/api/v1 (package.json "proxy" → http://localhost:8080).
 */
export const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";
const REQUEST_TIMEOUT_MS = 15000;
/** Endpoint auth tự trả 401 khi sai thông tin → báo lỗi, KHÔNG refresh. */
const AUTH_ENDPOINTS = ["/auth/login", "/auth/refresh", "/auth/logout"];
const LOGIN_PATH = "/login";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: REQUEST_TIMEOUT_MS,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Refresh token (Token Rotation) — gộp các request 401 đồng thời vào 1 lần refresh ───
let refreshPromise: Promise<string> | null = null;

async function requestNewAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError("Phiên đăng nhập đã hết hạn", 401, "UNAUTHORIZED");

  // axios thô (không qua interceptor) → tự lấy phần `data` của envelope
  const response = await axios.post<ApiEnvelope<TokenPair>>(`${BASE_URL}/auth/refresh`, { refreshToken });
  const tokens = response.data.data;
  if (!tokens?.accessToken) throw new ApiError("Cấp lại token thất bại", 401, "UNAUTHORIZED");
  saveTokens(tokens);
  return tokens.accessToken;
}

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = requestNewAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function redirectToLogin(): void {
  clearSession();
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.assign(LOGIN_PATH);
  }
}

function isAuthEndpoint(url: string | undefined): boolean {
  return AUTH_ENDPOINTS.some((path) => url?.includes(path));
}

async function retryWithNewToken(config: RetryableConfig): Promise<unknown> {
  config._retry = true;
  try {
    const token = await refreshAccessToken();
    config.headers.Authorization = `Bearer ${token}`;
    return apiClient(config);
  } catch (refreshError) {
    redirectToLogin();
    return Promise.reject(toApiError(refreshError));
  }
}

// ─── Response: unwrap `data` & chuẩn hóa lỗi ───
// Thành công → trả thẳng `body.data`. Lỗi → HTTP status là nguồn sự thật, reject ApiError.
apiClient.interceptors.response.use(
  // Ép kiểu: axios bắt interceptor trả AxiosResponse; `http.*` bên dưới mang kiểu đúng.
  (response) => (response.data as ApiEnvelope<unknown> | undefined)?.data as unknown as AxiosResponse,
  (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;
    if (error.response?.status === 401 && config && !isAuthEndpoint(config.url)) {
      if (!config._retry) return retryWithNewToken(config);
      redirectToLogin();
    }
    return Promise.reject(toApiError(error));
  }
);

/** Client có kiểu: kết quả trả về chính là phần `data` của envelope. */
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => apiClient.get<T, T>(url, config),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<T, T>(url, body, config),
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put<T, T>(url, body, config),
  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch<T, T>(url, body, config),
  delete: <T = void>(url: string, config?: AxiosRequestConfig): Promise<T> => apiClient.delete<T, T>(url, config),
};

export default apiClient;
