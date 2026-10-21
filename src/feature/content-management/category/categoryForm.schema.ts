import { z } from "zod";
import { CATEGORY_NAME_MAX_LENGTH, type CategoryUpsertRequest } from "./data/category.types";

/** Giá trị form thô — "" ở ô danh mục cha nghĩa là danh mục gốc. */
export interface CategoryFormValues {
    name: string;
    parentCategoryId: string;
}

const categoryFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Tên danh mục không được để trống")
        .max(CATEGORY_NAME_MAX_LENGTH, `Tên danh mục không quá ${CATEGORY_NAME_MAX_LENGTH} ký tự`),
    parentCategoryId: z.string().transform((v) => (v ? v : null)),
});

export type CategoryFormResult = { ok: true; payload: CategoryUpsertRequest } | { ok: false; error: string };

export function parseCategoryForm(values: CategoryFormValues): CategoryFormResult {
    const result = categoryFormSchema.safeParse(values);
    if (result.success) return { ok: true, payload: result.data };
    return { ok: false, error: result.error.issues[0]?.message ?? "Dữ liệu danh mục không hợp lệ" };
}
