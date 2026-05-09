import axios from "axios";
import { logout, getValidToken, refreshToken } from "./authService";

export interface ApiResponse<T = any> {
  errorCode: number;
  statusCode: number;
  message?: string;
  object: T;
}

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi tập trung
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Chỉ trả về dữ liệu từ server
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    // Nếu lỗi 401 và chưa thử retry
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("401 Unauthorized detected, attempting token refresh...");
      
      const newToken = await refreshToken();
      if (newToken) {
        console.log("Token refreshed successfully, retrying request.");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
      
      // Nếu refresh thất bại, logout
      console.error("Token refresh failed, logging out.");
      logout();
    } else if (status === 401) {
      // Nếu đã thử retry rồi vẫn 401 thì logout luôn
      logout();
    }

    const message = error.response?.data?.message || error.message || "Đã có lỗi xảy ra";

    // Tạo cấu trúc lỗi thống nhất
    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }
);

export default apiClient;
