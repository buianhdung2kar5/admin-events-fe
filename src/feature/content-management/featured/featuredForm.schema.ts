import { z } from "zod";
import type {
    FeaturedApproveRequest,
    FeaturedCreateRequest,
    FeaturedUpdateRequest,
} from "../../../types/featured.types";

/** Khớp ràng buộc backend §8c. */
const PRIORITY_MIN = 1;
const PRIORITY_MAX = 1000;
const DAYS_MAX = 365;
const ADDRESS_MAX = 255;
export const REASON_MAX = 500;

type Result<T> = { ok: true; payload: T } | { ok: false; error: string };

const priority = z.coerce
    .number({ invalid_type_error: "Độ ưu tiên phải là số" })
    .int("Độ ưu tiên phải là số nguyên")
    .min(PRIORITY_MIN, "Độ ưu tiên từ 1 (cao nhất) tới 1000")
    .max(PRIORITY_MAX, "Độ ưu tiên từ 1 (cao nhất) tới 1000");

const address = z
    .string()
    .max(ADDRESS_MAX, `Địa chỉ tối đa ${ADDRESS_MAX} ký tự`)
    .transform((v) => (v.trim() ? v.trim() : null));

function toResult<T>(parsed: z.SafeParseReturnType<unknown, T>, fallback: string): Result<T> {
    if (parsed.success) return { ok: true, payload: parsed.data };
    return { ok: false, error: parsed.error.issues[0]?.message ?? fallback };
}

export function parseApprove(values: { priority: string; address: string }): Result<FeaturedApproveRequest> {
    return toResult(z.object({ priority, address }).safeParse(values), "Thông tin duyệt không hợp lệ");
}

export function parseReason(reason: string): Result<string> {
    const schema = z.string().trim().min(1, "Vui lòng nhập lý do").max(REASON_MAX, `Lý do tối đa ${REASON_MAX} ký tự`);
    return toResult(schema.safeParse(reason), "Lý do không hợp lệ");
}

export function parseCreate(values: {
    eventId: string; placement: string; priority: string; durationDays: string; address: string;
}): Result<FeaturedCreateRequest> {
    const schema = z.object({
        eventId: z.string().min(1, "Vui lòng chọn sự kiện công khai"),
        placement: z.enum(["HOME_TOP"]),
        priority,
        durationDays: z.coerce
            .number({ invalid_type_error: "Số ngày phải là số" })
            .int("Số ngày phải là số nguyên")
            .min(1, "Số ngày tối thiểu 1")
            .max(DAYS_MAX, `Số ngày tối đa ${DAYS_MAX}`),
        address,
    });
    return toResult(schema.safeParse(values), "Thông tin gắn nổi bật không hợp lệ");
}

/** endDate phải sau startDate và không sau giờ kết thúc sự kiện. */
export function parseUpdate(
    values: { priority: string; endDate: string; address: string },
    bounds: { startDate: string | null; eventEndTime: string | null },
): Result<FeaturedUpdateRequest> {
    const schema = z
        .object({
            priority,
            endDate: z.string().min(1, "Vui lòng chọn thời điểm kết thúc").transform((v) => new Date(v)),
            address,
        })
        .refine((v) => !Number.isNaN(v.endDate.getTime()), { message: "Thời điểm kết thúc không hợp lệ" })
        .refine((v) => !bounds.startDate || v.endDate > new Date(bounds.startDate), { message: "Kết thúc phải sau thời điểm bắt đầu ghim" })
        .refine((v) => !bounds.eventEndTime || v.endDate <= new Date(bounds.eventEndTime), { message: "Kết thúc không được sau giờ kết thúc sự kiện" })
        .transform((v) => ({ priority: v.priority, endDate: v.endDate.toISOString(), address: v.address }));
    return toResult(schema.safeParse(values), "Thông tin cập nhật không hợp lệ");
}
