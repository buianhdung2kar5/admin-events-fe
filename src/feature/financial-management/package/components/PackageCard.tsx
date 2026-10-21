import { Package, Edit2, Eye, EyeOff, Trash2, Tag } from "lucide-react";
import {
    PACKAGE_STATUS_LABELS,
    PACKAGE_USE_FOR_LABELS,
    type PackageResponse,
    type PackageStatus,
} from "../../../../types/package.types";

export interface PackageCardActions {
    onEdit: (pkg: PackageResponse) => void;
    onPublish: (pkg: PackageResponse) => void;
    onHide: (pkg: PackageResponse) => void;
    onDelete: (pkg: PackageResponse) => void;
}

interface Props extends PackageCardActions {
    pkg: PackageResponse;
    isBusy: boolean;
}

const STATUS_STYLES: Record<PackageStatus, string> = {
    DRAFT: "bg-gray-50 text-gray-500 border-gray-200",
    PUBLISHED: "bg-green-50 text-green-600 border-green-200",
    HIDDEN: "bg-amber-50 text-amber-600 border-amber-200",
};

const ICON_BTN = "p-2.5 rounded-lg border border-gray-100 transition-all disabled:opacity-40";

/** Card hiển thị 1 gói; nút hành động theo trạng thái (DRAFT/HIDDEN → mở bán, PUBLISHED → ngừng bán). */
export default function PackageCard({ pkg, isBusy, onEdit, onPublish, onHide, onDelete }: Props) {
    const isPublished = pkg.status === "PUBLISHED";
    const priceLabel = pkg.price === 0 ? "Miễn phí" : `${pkg.price.toLocaleString("vi-VN")}đ`;

    return (
        <article className={`relative bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col ${pkg.status === "DRAFT" ? "opacity-80" : ""}`}>
            <header className="flex items-start gap-4 mb-4">
                <div className="bg-[#0092B8] p-2.5 rounded-lg shadow-md"><Package size={22} className="text-white" /></div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-gray-800 truncate">{pkg.name}</h3>
                    <p className="text-[11px] text-gray-400 font-medium line-clamp-2">{pkg.description || "Chưa có mô tả"}</p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${STATUS_STYLES[pkg.status]}`}>
                    {PACKAGE_STATUS_LABELS[pkg.status]}
                </span>
            </header>

            <p className="text-2xl font-bold text-gray-800 tabular-nums">{priceLabel}</p>
            <p className="text-xs text-gray-400 font-bold mb-4">⏳ {pkg.durationDays} ngày · Dành cho {PACKAGE_USE_FOR_LABELS[pkg.useFor]}</p>

            <div className="flex items-center gap-2 flex-wrap mb-5 text-[11px] font-bold">
                {pkg.tag && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#0092B8]/10 text-[#0092B8]"><Tag size={11} />{pkg.tag}</span>}
                {pkg.discount && <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-600">Đang ưu đãi</span>}
                <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-500">Thứ tự #{pkg.sortOrder}</span>
            </div>

            <footer className="flex items-center gap-2 mt-auto">
                <button type="button" disabled={isBusy} onClick={() => (isPublished ? onHide(pkg) : onPublish(pkg))}
                    className={`flex items-center justify-center gap-2 flex-1 min-h-11 rounded-lg text-[11px] font-semibold uppercase tracking-wide border transition-colors disabled:opacity-40 ${isPublished ? "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100" : "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"}`}>
                    {isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                    {isPublished ? "Ngừng bán" : "Mở bán"}
                </button>
                <button type="button" disabled={isBusy} onClick={() => onEdit(pkg)} aria-label={`Sửa gói ${pkg.name}`}
                    className={`${ICON_BTN} bg-gray-50 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50`}>
                    <Edit2 size={16} />
                </button>
                {!isPublished && (
                    <button type="button" disabled={isBusy} onClick={() => onDelete(pkg)} aria-label={`Xóa gói ${pkg.name}`}
                        className={`${ICON_BTN} bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50`}>
                        <Trash2 size={16} />
                    </button>
                )}
            </footer>
        </article>
    );
}
