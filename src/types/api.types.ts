/**
 * Format response chung của backend (events-backend: docs/API_RESPONSE_STANDARD.md).
 * Thành công (2xx): { success: true, code: "OK", message, data, timestamp }
 * Lỗi (4xx/5xx):    { success: false, code, message, errors?, path, timestamp }
 */
export interface FieldErrorDetail {
  field: string;
  message: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
  errors?: FieldErrorDetail[];
  path?: string;
  timestamp: string;
}

/** Dữ liệu phân trang (`PageResponse` phía backend), `page` bắt đầu từ 0. */
export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Format phân trang kiểu Spring cũ — chỉ còn dùng cho các màn hình backend CHƯA có API
 * (sự kiện, tin tức, tuyển CTV...). Khi backend có API thật thì đổi sang PageResponse.
 */
export interface LegacyPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size?: number;
  number?: number;
}
