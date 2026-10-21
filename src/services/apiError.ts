import { AxiosError } from "axios";
import type { ApiEnvelope, FieldErrorDetail } from "../types/api.types";

const NETWORK_ERROR_MESSAGE = "Không kết nối được máy chủ. Vui lòng thử lại.";
const UNKNOWN_ERROR_MESSAGE = "Đã xảy ra lỗi từ máy chủ.";

/** Lỗi đã chuẩn hóa từ response lỗi của backend — `message` luôn đọc được cho người dùng. */
export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string;
  readonly fieldErrors: FieldErrorDetail[];

  constructor(message: string, status: number | null, code: string, fieldErrors: FieldErrorDetail[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    // Giữ instanceof đúng khi target ES5 (CRA)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

function isEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return typeof value === "object" && value !== null && "success" in value && "code" in value;
}

/** Ghép lỗi từng field vào message để hiển thị đúng lý do (VALIDATION_FAILED). */
function buildMessage(body: ApiEnvelope<unknown>): string {
  const base = body.message || UNKNOWN_ERROR_MESSAGE;
  if (!body.errors?.length) return base;
  return `${base}: ${body.errors.map((e) => e.message).join("; ")}`;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? null;
    const body: unknown = error.response?.data;
    if (isEnvelope(body)) {
      return new ApiError(buildMessage(body), status, body.code, body.errors ?? []);
    }
    if (!error.response) return new ApiError(NETWORK_ERROR_MESSAGE, null, "NETWORK_ERROR");
    return new ApiError(UNKNOWN_ERROR_MESSAGE, status, "UNKNOWN");
  }
  if (error instanceof Error) return new ApiError(error.message, null, "UNKNOWN");
  return new ApiError(UNKNOWN_ERROR_MESSAGE, null, "UNKNOWN");
}

/** Lấy message an toàn từ lỗi bất kỳ (dùng trong catch của UI). */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
