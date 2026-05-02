import axios from "axios";
import { getStoredToken, logout } from "./authService";

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
  (config) => {
    const token = getStoredToken();
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
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      console.error("Phiên đăng nhập hết hạn.");
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
