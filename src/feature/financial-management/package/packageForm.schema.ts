import { z } from "zod";
import type { FeaturePlacement, PackageConfig, PackageResponse, PackageUpsertRequest } from "../../../types/package.types";

/** Khớp ràng buộc backend PackageUpsertRequest. */
const NAME_MAX = 255;
const DESCRIPTION_MAX = 2000;
const TAG_MAX = 50;
const QUOTA_MAX = 100000;
const FEATURE_DAYS_MAX = 365;

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
    /** Quyền lợi theo lượt — chỉ gửi khi useFor = ORGANIZATION */
    publishEnabled: boolean;
    publishQuota: string;
    featureEnabled: boolean;
    featureQuota: string;
    featurePlacement: FeaturePlacement;
    featureDays: string;
}

const blankToNull = (v: string): string | null => (v.trim() ? v.trim() : null);

const quota = (label: string) =>
    z.coerce
        .number({ invalid_type_error: `${label} phải là số` })
        .int(`${label} phải là số nguyên`)
        .min(1, `${label} tối thiểu 1`)
        .max(QUOTA_MAX, `${label} tối đa ${QUOTA_MAX.toLocaleString("vi-VN")}`);

const baseSchema = z.object({
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

const publishSchema = z.object({ monthlyQuota: quota("Lượt đăng sự kiện") });
const featureSchema = z.object({
    monthlyQuota: quota("Lượt nổi bật"),
    placement: z.enum(["HOME_TOP"]),
    durationDays: z.coerce
        .number({ invalid_type_error: "Số ngày nổi bật phải là số" })
        .int("Số ngày nổi bật phải là số nguyên")
        .min(1, "Số ngày nổi bật tối thiểu 1")
        .max(FEATURE_DAYS_MAX, `Số ngày nổi bật tối đa ${FEATURE_DAYS_MAX}`),
});

export type PackageFormResult = { ok: true; payload: PackageUpsertRequest } | { ok: false; error: string };

const firstIssue = (error: z.ZodError, fallback: string): string => error.issues[0]?.message ?? fallback;

/** Backend chỉ nhận config với gói cho Tổ chức (USER / ALL → 422) → loại khác luôn gửi null. */
function parseConfig(values: PackageFormValues): { ok: true; config: PackageConfig | null } | { ok: false; error: string } {
    if (values.useFor !== "ORGANIZATION") return { ok: true, config: null };

    const config: PackageConfig = {};
    if (values.publishEnabled) {
        const result = publishSchema.safeParse({ monthlyQuota: values.publishQuota });
        if (!result.success) return { ok: false, error: firstIssue(result.error, "Quyền lợi đăng sự kiện không hợp lệ") };
        config.EVENT_PUBLISH = result.data;
    }
    if (values.featureEnabled) {
        const result = featureSchema.safeParse({
            monthlyQuota: values.featureQuota,
            placement: values.featurePlacement,
            durationDays: values.featureDays,
        });
        if (!result.success) return { ok: false, error: firstIssue(result.error, "Quyền lợi nổi bật không hợp lệ") };
        config.EVENT_FEATURE = result.data;
    }
    return { ok: true, config: Object.keys(config).length > 0 ? config : null };
}

export function parsePackageForm(values: PackageFormValues): PackageFormResult {
    const base = baseSchema.safeParse(values);
    if (!base.success) return { ok: false, error: firstIssue(base.error, "Dữ liệu gói không hợp lệ") };
    const config = parseConfig(values);
    if (!config.ok) return config;
    return { ok: true, payload: { ...base.data, config: config.config } };
}

export function toPackageFormValues(pkg: PackageResponse | null): PackageFormValues {
    const publish = pkg?.config?.EVENT_PUBLISH;
    const feature = pkg?.config?.EVENT_FEATURE;
    return {
        name: pkg?.name ?? "",
        description: pkg?.description ?? "",
        price: pkg ? String(pkg.price) : "",
        durationDays: pkg ? String(pkg.durationDays) : "",
        discount: pkg?.discount ?? false,
        sortOrder: String(pkg?.sortOrder ?? 0),
        tag: pkg?.tag ?? "",
        useFor: pkg?.useFor ?? "ALL",
        publishEnabled: Boolean(publish),
        publishQuota: publish ? String(publish.monthlyQuota) : "",
        featureEnabled: Boolean(feature),
        featureQuota: feature ? String(feature.monthlyQuota) : "",
        featurePlacement: feature?.placement ?? "HOME_TOP",
        featureDays: feature ? String(feature.durationDays) : "",
    };
}
