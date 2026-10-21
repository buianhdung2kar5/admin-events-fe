import { Search, Plus } from "lucide-react";
import {
    PACKAGE_STATUS_LABELS,
    PACKAGE_USE_FOR_LABELS,
    type PackageStatus,
    type PackageUseFor,
} from "../../../../types/package.types";

export interface PackageFilters {
    search: string;
    status: PackageStatus | "";
    useFor: PackageUseFor | "";
}

interface Props {
    filters: PackageFilters;
    onChange: (filters: PackageFilters) => void;
    onCreate: () => void;
}

const SELECT_CLS = "min-h-11 border border-gray-200 rounded-xl px-3 text-sm font-semibold text-gray-600 outline-none focus:border-[#0092B8] bg-white cursor-pointer";
const STATUS_OPTIONS = Object.entries(PACKAGE_STATUS_LABELS) as [PackageStatus, string][];
const USE_FOR_OPTIONS = Object.entries(PACKAGE_USE_FOR_LABELS) as [PackageUseFor, string][];

/** Thanh công cụ: tìm theo tên (trên trang hiện tại), lọc status / useFor (server), tạo gói. */
export default function PackageToolbar({ filters, onChange, onCreate }: Props) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 min-h-11 focus-within:border-[#0092B8] transition-all flex-1">
                <Search size={16} className="text-gray-400 shrink-0" aria-hidden="true" />
                <input type="search" value={filters.search} onChange={(e) => onChange({ ...filters, search: e.target.value })}
                    placeholder="Tìm theo tên gói..." aria-label="Tìm theo tên gói"
                    className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400" />
            </label>
            <div className="flex gap-2 flex-wrap">
                <select value={filters.status} aria-label="Lọc trạng thái" className={SELECT_CLS}
                    onChange={(e) => onChange({ ...filters, status: e.target.value as PackageStatus | "" })}>
                    <option value="">Mọi trạng thái</option>
                    {STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <select value={filters.useFor} aria-label="Lọc đối tượng" className={SELECT_CLS}
                    onChange={(e) => onChange({ ...filters, useFor: e.target.value as PackageUseFor | "" })}>
                    <option value="">Mọi đối tượng</option>
                    {USE_FOR_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <button type="button" onClick={onCreate}
                    className="flex items-center gap-2 min-h-11 bg-[#0092B8] text-white px-4 rounded-xl hover:bg-[#007a99] active:scale-[0.98] transition-all font-bold text-sm">
                    <Plus size={16} strokeWidth={3} /> Thêm gói
                </button>
            </div>
        </div>
    );
}
