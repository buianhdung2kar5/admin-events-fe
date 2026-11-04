import { z } from "zod";
import { GENDERS, ORGANIZATION_TYPES, type Gender } from "../../../types/account.types";

const TEXT_MAX_LENGTH = 255;
const STUDENT_CODE_MAX_LENGTH = 50;

export const GENDER_LABELS: Record<Gender, string> = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
};

/** Dữ liệu cũ dùng NAM / NU — đưa về giá trị chuẩn; giá trị lạ trả null. */
export const normalizeGender = (value: string | null): Gender | null => {
    const upper = value?.toUpperCase();
    if (upper === "NAM") return "MALE";
    if (upper === "NU" || upper === "NỮ") return "FEMALE";
    return GENDERS.find((gender) => gender === upper) ?? null;
};

/** Nhãn giới tính từ giá trị backend; giá trị lạ hiện nguyên. */
export const getGenderLabel = (value: string | null): string | null => {
    const gender = normalizeGender(value);
    return gender ? GENDER_LABELS[gender] : value;
};

/** Ô chữ để trống: xóa nếu trước đó có nội dung, không thì giữ nguyên giá trị trong response. */
export const keepOrClear = (value: string, original: string | null): string | null =>
    value || (original ? "" : original);

const optionalText = (max: number, label: string) =>
    z.string().trim().max(max, `${label} tối đa ${max} ký tự`);

export const today = (): string => new Date().toLocaleDateString("en-CA");

export const userProfileSchema = z.object({
    fullName: z.string().trim().min(1, "Vui lòng nhập họ tên").max(TEXT_MAX_LENGTH, `Họ tên tối đa ${TEXT_MAX_LENGTH} ký tự`),
    gender: z.enum(GENDERS).or(z.literal("")),
    birthOfDate: z.string().refine((value) => !value || value < today(), "Ngày sinh phải ở quá khứ"),
    studentCode: optionalText(STUDENT_CODE_MAX_LENGTH, "Mã sinh viên"),
    university: optionalText(TEXT_MAX_LENGTH, "Trường"),
    faculty: optionalText(TEXT_MAX_LENGTH, "Khoa"),
    major: optionalText(TEXT_MAX_LENGTH, "Chuyên ngành"),
});

export const organizationProfileSchema = z.object({
    organizationName: z.string().trim().min(1, "Vui lòng nhập tên tổ chức"),
    organizationType: z.enum(ORGANIZATION_TYPES).or(z.literal("")),
    address: z.string().trim(),
    description: z.string().trim(),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
export type OrganizationProfileFormValues = z.infer<typeof organizationProfileSchema>;
