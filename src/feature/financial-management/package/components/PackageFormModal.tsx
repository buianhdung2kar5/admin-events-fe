import { useState, type FormEvent, type ReactNode } from "react";
import { X, Package, Loader2 } from "lucide-react";
import { getErrorMessage } from "../../../../services/apiError";
import { PACKAGE_USE_FOR_LABELS, type PackageResponse, type PackageUseFor } from "../../../../types/package.types";
import { parsePackageForm, type PackageFormValues } from "../packageForm.schema";
import type { SavePackageInput } from "../hooks/useAdminPackages";

interface Props {
    pkg: PackageResponse | null;
    onClose: () => void;
    onSave: (input: SavePackageInput) => Promise<unknown>;
}

const USE_FOR_OPTIONS = Object.entries(PACKAGE_USE_FOR_LABELS) as [PackageUseFor, string][];
const INPUT_CLS = "w-full min-h-11 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all";

const toFormValues = (pkg: PackageResponse | null): PackageFormValues => ({
    name: pkg?.name ?? "",
    description: pkg?.description ?? "",
    price: pkg ? String(pkg.price) : "",
    durationDays: pkg ? String(pkg.durationDays) : "",
    discount: pkg?.discount ?? false,
    sortOrder: String(pkg?.sortOrder ?? 0),
    tag: pkg?.tag ?? "",
    useFor: pkg?.useFor ?? "ALL",
});

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {label}
            {children}
        </label>
    );
}

export default function PackageFormModal({ pkg, onClose, onSave }: Props) {
    const [values, setValues] = useState<PackageFormValues>(() => toFormValues(pkg));
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const isEdit = pkg !== null;

    const set = <K extends keyof PackageFormValues>(key: K, value: PackageFormValues[K]) =>
        setValues((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const parsed = parsePackageForm(values);
        if (!parsed.ok) {
            setError(parsed.error);
            return;
        }
        setError(null);
        setIsSaving(true);
        try {
            await onSave({ id: pkg?.id ?? null, payload: parsed.payload });
            onClose();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Lưu gói thất bại"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="package-form-title">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <form onSubmit={handleSubmit} noValidate className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#0092B8] p-2 rounded-xl"><Package size={20} className="text-white" /></div>
                        <div>
                            <h2 id="package-form-title" className="text-base font-bold text-gray-800">{isEdit ? "Chỉnh sửa gói" : "Tạo gói mới"}</h2>
                            <p className="text-xs text-gray-400">{isEdit ? pkg.name : "Gói mới luôn ở trạng thái Bản nháp"}</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Đóng" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={18} className="text-gray-400" />
                    </button>
                </header>

                <Field label="Tên gói *">
                    <input type="text" value={values.name} onChange={(e) => set("name", e.target.value)} maxLength={255} placeholder="VD: Gói VIP tháng" className={INPUT_CLS} />
                </Field>
                <Field label="Mô tả quyền lợi">
                    <textarea value={values.description} onChange={(e) => set("description", e.target.value)} maxLength={2000} rows={2} className={`${INPUT_CLS} resize-none`} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Giá (₫) *">
                        <input type="number" min={0} step={1000} value={values.price} onChange={(e) => set("price", e.target.value)} placeholder="0 = Miễn phí" className={INPUT_CLS} />
                    </Field>
                    <Field label="Thời hạn (ngày) *">
                        <input type="number" min={1} value={values.durationDays} onChange={(e) => set("durationDays", e.target.value)} placeholder="VD: 30" className={INPUT_CLS} />
                    </Field>
                    <Field label="Dành cho *">
                        <select value={values.useFor} onChange={(e) => set("useFor", e.target.value as PackageUseFor)} className={`${INPUT_CLS} bg-white`}>
                            {USE_FOR_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </Field>
                    <Field label="Thứ tự hiển thị">
                        <input type="number" min={0} value={values.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} className={INPUT_CLS} />
                    </Field>
                    <Field label="Nhãn nổi bật">
                        <input type="text" value={values.tag} onChange={(e) => set("tag", e.target.value)} maxLength={50} placeholder="VD: VIP" className={INPUT_CLS} />
                    </Field>
                    <label className="flex items-center gap-2 self-end min-h-11 text-sm font-semibold text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={values.discount} onChange={(e) => set("discount", e.target.checked)} className="w-4 h-4 accent-[#0092B8]" />
                        Đang ưu đãi
                    </label>
                </div>

                {error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}

                <footer className="flex gap-3 pt-1">
                    <button type="button" onClick={onClose} className="flex-1 min-h-11 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Hủy</button>
                    <button type="submit" disabled={isSaving} className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] active:scale-[0.98] disabled:opacity-50 transition-all">
                        {isSaving && <Loader2 size={15} className="animate-spin" />}
                        {isEdit ? "Lưu thay đổi" : "Tạo gói"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
