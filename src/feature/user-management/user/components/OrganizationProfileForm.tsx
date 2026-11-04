import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { getErrorMessage } from "../../../../services/apiError";
import {
    ORGANIZATION_TYPES,
    type AccountDetail,
    type AccountProfileUpdateBody,
    type OrganizationProfile,
} from "../../../../types/account.types";
import { getOrgTypeStyles, getVerificationStyles } from "../DTO/OrganizationInterface";
import { keepOrClear, organizationProfileSchema, type OrganizationProfileFormValues } from "../profileForm.schema";
import { PROFILE_INPUT_CLASS, ProfileField, ProfileFormError, ReadOnlyField } from "./ProfileFormFields";

interface Props {
    formId: string;
    account: AccountDetail;
    profile: OrganizationProfile;
    onSubmit: (body: AccountProfileUpdateBody) => Promise<unknown>;
}

const toFormValues = (profile: OrganizationProfile): OrganizationProfileFormValues => ({
    organizationName: profile.organizationName,
    organizationType: profile.organizationType ?? "",
    address: profile.address ?? "",
    description: profile.description ?? "",
});

/** Body = giá trị trong response + phần Admin vừa sửa; trường không sửa được gửi lại nguyên giá trị cũ. */
const toBody = (values: OrganizationProfileFormValues, profile: OrganizationProfile): AccountProfileUpdateBody => ({
    organizationProfile: {
        organizationName: values.organizationName,
        organizationType: values.organizationType || profile.organizationType,
        address: keepOrClear(values.address, profile.address),
        description: keepOrClear(values.description, profile.description),
        logoUrl: profile.logoUrl,
    },
});

/** Form sửa hồ sơ tổ chức; nút Lưu nằm ở đầu trang, gửi form qua formId. */
export default function OrganizationProfileForm({ formId, account, profile, onSubmit }: Props) {
    const [values, setValues] = useState(() => toFormValues(profile));
    const [error, setError] = useState<string | null>(null);

    const change = (key: keyof OrganizationProfileFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setValues((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const parsed = organizationProfileSchema.safeParse(values);
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
                <ProfileField label="Tên tổ chức *">
                    <input type="text" value={values.organizationName} onChange={change("organizationName")} className={PROFILE_INPUT_CLASS} />
                </ProfileField>
                <ProfileField label="Loại hình">
                    <select value={values.organizationType} onChange={change("organizationType")} className={PROFILE_INPUT_CLASS}>
                        <option value="">Chưa chọn</option>
                        {ORGANIZATION_TYPES.map((type) => <option key={type} value={type}>{getOrgTypeStyles(type).label}</option>)}
                    </select>
                </ProfileField>
                <div className="md:col-span-2">
                    <ProfileField label="Địa chỉ">
                        <input type="text" value={values.address} onChange={change("address")} className={PROFILE_INPUT_CLASS} />
                    </ProfileField>
                </div>
                <div className="md:col-span-2">
                    <ProfileField label="Giới thiệu">
                        <textarea value={values.description} onChange={change("description")} rows={4} className={`${PROFILE_INPUT_CLASS} resize-none`} />
                    </ProfileField>
                </div>
                <ReadOnlyField label="Email" value={account.email} />
                <ReadOnlyField label="Điện thoại" value={account.phoneNumber} />
                <ReadOnlyField label="Logo" value={profile.logoUrl} />
                <ReadOnlyField label="Trạng thái xác minh" value={getVerificationStyles(profile.verificationStatus).label} />
                <ReadOnlyField label="Ngày tham gia" value={new Date(account.createdAt).toLocaleDateString("vi-VN")} />
            </div>
        </form>
    );
}
