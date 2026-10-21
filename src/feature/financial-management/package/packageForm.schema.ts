import { z } from "zod";
import type { PackageUpsertRequest } from "../../../types/package.types";

/** Khớp ràng buộc backend PackageUpsertRequest. */
const NAME_MAX = 255;
const DESCRIPTION_MAX = 2000;
const TAG_MAX = 50;

/** Giá trị form thô (input luôn là chuỗi). */
export interface PackageFormValues {
    name: string;
    description: string;
    price: string;
    durationDays: string;
    discount: boolean;
    sortOrder: string;
    tag: string;
    useFor: PackageUpsertRequest["useFor"];
}

const blankToNull = (v: string): string | null => (v.trim() ? v.trim() : null);

const packageFormSchema = z.object({
    name: z.string().trim().min(1, "Tên gói không được để trống").max(NAME_MAX, "Tên gói tối đa 255 ký tự"),
    description: z.string().max(DESCRIPTION_MAX, "Mô tả tối đa 2000 ký tự").transform(blankToNull),
    price: z.coerce
        .number({ invalid_type_error: "Giá gói phải là số" })
        .int("Giá gói là số nguyên VND")
        .min(0, "Giá gói không được âm"),
    durationDays: z.coerce
        .number({ invalid_type_error: "Thời hạn phải là số" })
        .int("Thời hạn phải là số nguyên")
        .min(1, "Thời hạn gói phải lớn hơn 0 ngày"),
    discount: z.boolean(),
    sortOrder: z.coerce.number().int("Thứ tự phải là số nguyên").min(0, "Thứ tự hiển thị không được âm"),
    tag: z.string().max(TAG_MAX, "Tag tối đa 50 ký tự").transform(blankToNull),
    useFor: z.enum(["USER", "ORGANIZATION", "ALL"]),
});

export type PackageFormResult = { ok: true; payload: PackageUpsertRequest } | { ok: false; error: string };

export function parsePackageForm(values: PackageFormValues): PackageFormResult {
    const result = packageFormSchema.safeParse(values);
    if (result.success) return { ok: true, payload: result.data };
    return { ok: false, error: result.error.issues[0]?.message ?? "Dữ liệu gói không hợp lệ" };
}
