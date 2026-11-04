import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { getErrorMessage } from "../../../../services/apiError";
import { GENDERS, type AccountDetail, type AccountProfileUpdateBody, type UserProfile } from "../../../../types/account.types";
import {
    GENDER_LABELS,
    keepOrClear,
    normalizeGender,
    today,
    userProfileSchema,
    type UserProfileFormValues,
} from "../profileForm.schema";
import { PROFILE_INPUT_CLASS, ProfileField, ProfileFormError, ReadOnlyField } from "./ProfileFormFields";

interface Props {
    formId: string;
    account: AccountDetail;
    profile: UserProfile;
    onSubmit: (body: AccountProfileUpdateBody) => Promise<unknown>;
}

const TEXT_FIELDS = [
    { key: "fullName", label: "Họ tên *" },
    { key: "studentCode", label: "Mã sinh viên" },
    { key: "university", label: "Trường Đại học" },
    { key: "faculty", label: "Khoa" },
    { key: "major", label: "Chuyên ngành" },
] as const;

const toFormValues = (profile: UserProfile): UserProfileFormValues => ({
    fullName: profile.fullName ?? "",
    gender: normalizeGender(profile.gender) ?? "",
    birthOfDate: profile.birthOfDate ?? "",
    studentCode: profile.studentCode ?? "",
    university: profile.university ?? "",
    faculty: profile.faculty ?? "",
    major: profile.major ?? "",
});

/** Body = giá trị trong response + phần Admin vừa sửa; trường không sửa được gửi lại nguyên giá trị cũ. */
const toBody = (values: UserProfileFormValues, profile: UserProfile): AccountProfileUpdateBody => ({
    userProfile: {
        fullName: values.fullName,
        gender: values.gender || profile.gender,
        birthOfDate: values.birthOfDate || profile.birthOfDate,
        studentCode: keepOrClear(values.studentCode, profile.studentCode),
        university: keepOrClear(values.university, profile.university),
        faculty: keepOrClear(values.faculty, profile.faculty),
        major: keepOrClear(values.major, profile.major),
        avatarUrl: profile.avatarUrl,
    },
});

/** Form sửa hồ sơ người dùng; nút Lưu nằm ở đầu trang, gửi form qua formId. */
export default function UserProfileForm({ formId, account, profile, onSubmit }: Props) {
    const [values, setValues] = useState(() => toFormValues(profile));
    const [error, setError] = useState<string | null>(null);

    const change = (key: keyof UserProfileFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setValues((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const parsed = userProfileSchema.safeParse(values);
        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ");
            return;
        }
        setError(null);
        try {
            await onSubmit(toBody(parsed.data, profile));
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Không lưu được hồ sơ"));
        }
    };

    return (
        <form id={formId} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <ProfileFormError message={error} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TEXT_FIELDS.map(({ key, label }) => (
                    <ProfileField key={key} label={label}>
                        <input type="text" value={values[key]} onChange={change(key)} className={PROFILE_INPUT_CLASS} />
                    </ProfileField>
                ))}
                <ProfileField label="Giới tính">
                    <select value={values.gender} onChange={change("gender")} className={PROFILE_INPUT_CLASS}>
                        <option value="">Chưa chọn</option>
                        {GENDERS.map((gender) => <option key={gender} value={gender}>{GENDER_LABELS[gender]}</option>)}
                    </select>
                </ProfileField>
                <ProfileField label="Sinh nhật">
                    <input type="date" value={values.birthOfDate} max={today()} onChange={change("birthOfDate")} className={PROFILE_INPUT_CLASS} />
                </ProfileField>
                <ReadOnlyField label="Email" value={account.email} />
                <ReadOnlyField label="Điện thoại" value={account.phoneNumber} />
                <ReadOnlyField label="Ảnh đại diện" value={profile.avatarUrl} />
                <ReadOnlyField label="Ngày tham gia" value={new Date(account.createdAt).toLocaleDateString("vi-VN")} />
            </div>
        </form>
    );
}
