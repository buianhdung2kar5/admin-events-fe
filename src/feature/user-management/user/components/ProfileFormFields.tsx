import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

export const PROFILE_INPUT_CLASS = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-normal normal-case tracking-normal text-gray-800 outline-none focus:border-[#0092B8] bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";

export function ProfileField({ label, children }: { label: string; children: ReactNode }) {
    return <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-600">{label}{children}</label>;
}

/** Trường API không nhận hoặc chưa cho sửa — hiện để Admin đối chiếu. */
export function ReadOnlyField({ label, value }: { label: string; value: string | null }) {
    return (
        <ProfileField label={label}>
            <input type="text" value={value || "—"} disabled title={value ?? undefined} className={PROFILE_INPUT_CLASS} />
        </ProfileField>
    );
}

export function ProfileFormError({ message }: { message: string | null }) {
    if (!message) return null;
    return (
        <p role="alert" className="flex items-start gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100 text-xs font-medium text-red-600">
            <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{message}
        </p>
    );
}
