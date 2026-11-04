import type { ReactNode } from "react";
import { Megaphone, Sparkles, Info } from "lucide-react";
import { FEATURE_PLACEMENT_LABELS, type FeaturePlacement } from "../../../../types/package.types";
import type { PackageFormValues } from "../packageForm.schema";

interface Props {
    values: PackageFormValues;
    onChange: <K extends keyof PackageFormValues>(key: K, value: PackageFormValues[K]) => void;
}

const INPUT_CLS = "w-full min-h-11 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all disabled:bg-gray-50 disabled:text-gray-400";
const PLACEMENT_OPTIONS = Object.entries(FEATURE_PLACEMENT_LABELS) as [FeaturePlacement, string][];

function SmallField({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="flex flex-col gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
            {label}
            {children}
        </label>
    );
}

function BenefitToggle({ icon, title, hint, checked, onToggle, children }: {
    icon: ReactNode; title: string; hint: string; checked: boolean; onToggle: (checked: boolean) => void; children: ReactNode;
}) {
    return (
        <div className={`rounded-xl border p-4 flex flex-col gap-3 transition-colors ${checked ? "border-[#0092B8]/40 bg-[#0092B8]/[0.03]" : "border-gray-100"}`}>
            <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={checked} onChange={(e) => onToggle(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#0092B8]" />
                <span className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700">{icon}{title}</span>
                    <span className="text-xs text-gray-400">{hint}</span>
                </span>
            </label>
            {checked && children}
        </div>
    );
}

/** Phần "Quyền lợi theo lượt" của form gói — chỉ áp dụng cho gói dành cho Tổ chức. */
export default function PackageBenefitFields({ values, onChange }: Props) {
    if (values.useFor !== "ORGANIZATION") {
        return (
            <p className="flex items-start gap-2 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500">
                <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                Quyền lợi theo lượt (đăng sự kiện, làm nổi bật) chỉ áp dụng cho gói dành cho Tổ chức. Chọn "Dành cho: Tổ chức" để cấu hình.
            </p>
        );
    }

    return (
        <fieldset className="flex flex-col gap-3">
            <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quyền lợi theo lượt (cộng thêm mỗi tháng)</legend>

            <BenefitToggle
                icon={<Megaphone size={14} className="text-[#0092B8]" />}
                title="Đăng sự kiện"
                hint="Tổ chức được miễn phí 20 lượt/tháng; gói cộng thêm số lượt dưới đây."
                checked={values.publishEnabled}
                onToggle={(checked) => onChange("publishEnabled", checked)}
            >
                <SmallField label="Số lượt / tháng *">
                    <input type="number" min={1} value={values.publishQuota} onChange={(e) => onChange("publishQuota", e.target.value)} placeholder="VD: 30" className={INPUT_CLS} />
                </SmallField>
            </BenefitToggle>

            <BenefitToggle
                icon={<Sparkles size={14} className="text-[#0092B8]" />}
                title="Làm nổi bật sự kiện"
                hint="Mỗi lượt = 1 đơn ghim sự kiện ở vị trí và số ngày dưới đây (Admin duyệt)."
                checked={values.featureEnabled}
                onToggle={(checked) => onChange("featureEnabled", checked)}
            >
                <div className="grid grid-cols-3 gap-3">
                    <SmallField label="Lượt / tháng *">
                        <input type="number" min={1} value={values.featureQuota} onChange={(e) => onChange("featureQuota", e.target.value)} placeholder="VD: 5" className={INPUT_CLS} />
                    </SmallField>
                    <SmallField label="Vị trí *">
                        <select value={values.featurePlacement} onChange={(e) => onChange("featurePlacement", e.target.value as FeaturePlacement)} className={`${INPUT_CLS} bg-white`}>
                            {PLACEMENT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </SmallField>
                    <SmallField label="Số ngày *">
                        <input type="number" min={1} max={365} value={values.featureDays} onChange={(e) => onChange("featureDays", e.target.value)} placeholder="VD: 10" className={INPUT_CLS} />
                    </SmallField>
                </div>
            </BenefitToggle>
        </fieldset>
    );
}
