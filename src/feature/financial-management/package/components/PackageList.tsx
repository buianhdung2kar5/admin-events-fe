import { useState } from "react";
import { Loader2, Package } from "lucide-react";
import Toast from "../../../../components/common/Toast";
import { getErrorMessage } from "../../../../services/apiError";
import type { PackageResponse } from "../../../../types/package.types";
import { useAdminPackages } from "../hooks/useAdminPackages";
import PackageCard from "./PackageCard";
import PackageFormModal from "./PackageFormModal";
import PackageToolbar, { type PackageFilters } from "./PackageToolbar";

const PAGE_SIZE = 12;
const TOAST_DURATION_MS = 3000;
const INITIAL_FILTERS: PackageFilters = { search: "", status: "", useFor: "" };
type Tab = "packages" | "userpackages";
type FormState = { open: false } | { open: true; pkg: PackageResponse | null };

/** Orchestrator màn hình gói ưu đãi: state lọc/trang + thao tác, giao phần hiển thị cho các section. */
export default function PackageList() {
    const [activeTab, setActiveTab] = useState<Tab>("packages");
    const [filters, setFilters] = useState<PackageFilters>(INITIAL_FILTERS);
    const [page, setPage] = useState(0);
    const [form, setForm] = useState<FormState>({ open: false });
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const { page: data, isLoading, error, isMutating, savePackage, publishPackage, hidePackage, deletePackage } =
        useAdminPackages({ status: filters.status || undefined, useFor: filters.useFor || undefined, page, size: PAGE_SIZE });

    const keyword = filters.search.trim().toLowerCase();
    const packages = (data?.items ?? []).filter((p) => !keyword || p.name.toLowerCase().includes(keyword));
    const totalPages = Math.max(1, data?.totalPages ?? 1);

    const notify = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), TOAST_DURATION_MS);
    };

    const run = async (action: () => Promise<unknown>, success: string) => {
        try {
            await action();
            notify(success);
        } catch (err: unknown) {
            notify(getErrorMessage(err, "Thao tác thất bại"), false);
        }
    };

    const handleFiltersChange = (next: PackageFilters) => {
        // Đổi bộ lọc phía server → quay về trang đầu
        if (next.status !== filters.status || next.useFor !== filters.useFor) setPage(0);
        setFilters(next);
    };

    const actions = {
        onEdit: (pkg: PackageResponse) => setForm({ open: true, pkg }),
        onPublish: (pkg: PackageResponse) => run(() => publishPackage(pkg.id), `Đã mở bán "${pkg.name}"`),
        onHide: (pkg: PackageResponse) => {
            if (!window.confirm(`Ngừng bán "${pkg.name}"? Người đã mua vẫn dùng tiếp tới hết hạn.`)) return;
            run(() => hidePackage(pkg.id), `Đã ngừng bán "${pkg.name}"`);
        },
        onDelete: (pkg: PackageResponse) => {
            if (!window.confirm(`Xóa gói "${pkg.name}"? Thao tác không thể hoàn tác.`)) return;
            run(() => deletePackage(pkg.id), `Đã xóa "${pkg.name}"`);
        },
    };

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
            <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit" aria-label="Chọn mục gói">
                {([["packages", "Gói dịch vụ"], ["userpackages", "User đã mua"]] as [Tab, string][]).map(([key, label]) => (
                    <button key={key} type="button" onClick={() => setActiveTab(key)} aria-pressed={activeTab === key}
                        className={`px-5 min-h-11 rounded-lg text-sm font-semibold transition-all ${activeTab === key ? "bg-white shadow-sm text-[#0092B8]" : "text-gray-500 hover:text-gray-700"}`}>
                        {label}
                    </button>
                ))}
            </nav>

            <Toast toast={toast} onClose={() => setToast(null)} />

            {activeTab === "userpackages" ? (
                <p className="bg-white rounded-xl border border-dashed border-gray-200 px-6 py-12 text-center text-sm text-gray-400">
                    Danh sách gói người dùng đã mua — backend chưa có API cho Admin (dự kiến ở Phase 6: thu hồi gói, hoàn tiền, đối soát).
                </p>
            ) : (
                <>
                    <PackageToolbar filters={filters} onChange={handleFiltersChange} onCreate={() => setForm({ open: true, pkg: null })} />
                    {isLoading ? (
                        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-[#0092B8] animate-spin" /></div>
                    ) : error ? (
                        <p role="alert" className="bg-white rounded-xl border border-red-100 px-6 py-12 text-center text-sm font-medium text-red-500">{error}</p>
                    ) : packages.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 px-6 py-12 flex flex-col items-center gap-2 text-sm text-gray-400">
                            <Package size={32} className="text-gray-300" /> Chưa có gói nào phù hợp
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} isBusy={isMutating} {...actions} />)}
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-end gap-2 text-xs font-medium text-gray-500">
                            <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-3 min-h-11 border border-gray-200 rounded-lg disabled:opacity-40">Trước</button>
                            <span>Trang {page + 1} / {totalPages}</span>
                            <button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 min-h-11 border border-gray-200 rounded-lg disabled:opacity-40">Sau</button>
                        </div>
                    )}
                </>
            )}

            {form.open && (
                <PackageFormModal
                    pkg={form.pkg}
                    onClose={() => setForm({ open: false })}
                    onSave={async (input) => {
                        await savePackage(input);
                        notify(input.id ? "Đã cập nhật gói" : "Đã tạo gói (Bản nháp)");
                    }}
                />
            )}
        </div>
    );
}
