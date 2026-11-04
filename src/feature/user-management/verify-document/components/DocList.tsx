import { useState } from "react";
import { Eye, Loader2, Search, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VerificationDocumentApi, VERIFICATION_QUERY_KEY } from "../../../../services/user-management/DocumentApi";
import { getErrorMessage } from "../../../../services/apiError";
import Toast from "../../../../components/common/Toast";
import {
    VERIFICATION_STATUS_META,
    getDocumentTypeLabel,
    getMissingDocuments,
    getOrganizationTypeLabel,
    type VerificationProfile,
    type VerificationStatus,
} from "../DTO/VerificationInterface";
import DocDetailModal from "./DocDetailModal";

const PAGE_SIZE = 10;
const TOAST_DURATION_MS = 3000;

type Tab = VerificationStatus | "ALL";
const TABS: { key: Tab; label: string }[] = [
    { key: "PENDING", label: "Chờ duyệt" },
    { key: "APPROVED", label: "Đã duyệt" },
    { key: "REJECTED", label: "Từ chối" },
    { key: "ALL", label: "Tất cả" },
];

const formatDate = (iso: string | null): string =>
    iso ? new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

/** Danh sách HỒ SƠ xác minh tổ chức (phân trang server); mở modal để duyệt / từ chối cả hồ sơ. */
export default function DocList() {
    const queryClient = useQueryClient();
    const [tab, setTab] = useState<Tab>("PENDING");
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [detail, setDetail] = useState<VerificationProfile | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const params = { status: tab === "ALL" ? undefined : tab, page, size: PAGE_SIZE };
    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: [...VERIFICATION_QUERY_KEY, "list", params],
        queryFn: () => VerificationDocumentApi.list(params),
        placeholderData: keepPreviousData,
    });

    const keyword = search.trim().toLowerCase();
    const profiles = (data?.items ?? []).filter((p) =>
        !keyword
        || (p.organizationName ?? "").toLowerCase().includes(keyword)
        || (p.organizationEmail ?? "").toLowerCase().includes(keyword));
    const totalPages = Math.max(1, data?.totalPages ?? 1);

    const notify = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), TOAST_DURATION_MS);
    };

    // Duyệt / từ chối đổi trạng thái tổ chức → làm mới cả danh sách, thống kê và trang tài khoản
    const onDone = () => {
        queryClient.invalidateQueries({ queryKey: VERIFICATION_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ["users_list"] });
        queryClient.invalidateQueries({ queryKey: ["org_detail"] });
    };
    const approve = useMutation({ mutationFn: (id: string) => VerificationDocumentApi.approve(id), onSuccess: onDone });
    const reject = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => VerificationDocumentApi.reject(id, reason),
        onSuccess: onDone,
    });

    const handleTab = (next: Tab) => {
        setTab(next);
        setPage(0);
    };

    return (
        <div className="flex flex-col gap-4">
            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <nav className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit" aria-label="Lọc trạng thái hồ sơ">
                    {TABS.map(({ key, label }) => (
                        <button key={key} type="button" onClick={() => handleTab(key)} aria-pressed={tab === key}
                            className={`px-4 min-h-10 rounded-lg text-sm font-semibold transition-all ${tab === key ? "bg-white shadow-sm text-[#0092B8]" : "text-gray-500 hover:text-gray-700"}`}>
                            {label}
                        </button>
                    ))}
                </nav>
                <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 min-h-11 focus-within:border-[#0092B8] md:w-80">
                    <Search size={16} className="text-gray-400 shrink-0" aria-hidden="true" />
                    <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm tên / email tổ chức (trang này)"
                        aria-label="Tìm tổ chức" className="text-sm outline-none bg-transparent w-full" />
                </label>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                {isFetching && !isLoading && <Loader2 size={16} className="absolute top-4 right-4 animate-spin text-[#0092B8]" aria-label="Đang tải lại" />}
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#0092B8] animate-spin" /></div>
                ) : error ? (
                    <p role="alert" className="px-6 py-16 text-center text-sm font-medium text-red-500">{getErrorMessage(error, "Không tải được danh sách hồ sơ")}</p>
                ) : profiles.length === 0 ? (
                    <div className="px-6 py-16 flex flex-col items-center gap-2 text-sm text-gray-400">
                        <ShieldCheck size={32} className="text-gray-300" aria-hidden="true" /> Không có hồ sơ nào
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-5 py-4">Tổ chức</th>
                                    <th className="px-5 py-4">Loại</th>
                                    <th className="px-5 py-4">Giấy tờ</th>
                                    <th className="px-5 py-4">Ngày nộp</th>
                                    <th className="px-5 py-4">Trạng thái</th>
                                    <th className="px-5 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {profiles.map((profile) => {
                                    const missing = getMissingDocuments(profile);
                                    const meta = VERIFICATION_STATUS_META[profile.status];
                                    return (
                                        <tr key={profile.id} className="align-top hover:bg-blue-50/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="font-bold text-gray-800">{profile.organizationName ?? "Chưa đặt tên"}</p>
                                                <p className="text-xs text-gray-400">{profile.organizationEmail ?? profile.userId}</p>
                                            </td>
                                            <td className="px-5 py-4 text-xs font-semibold text-gray-600">{getOrganizationTypeLabel(profile.organizationType)}</td>
                                            <td className="px-5 py-4 text-xs">
                                                <p className="font-semibold text-gray-700">{profile.files.length} file</p>
                                                {missing.length === 0 ? (
                                                    <p className="mt-1 inline-flex items-center gap-1 text-green-600 font-semibold"><CheckCircle2 size={12} aria-hidden="true" />Đủ giấy tờ bắt buộc</p>
                                                ) : (
                                                    <p className="mt-1 inline-flex items-start gap-1 text-amber-700 font-semibold">
                                                        <AlertTriangle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />Thiếu: {missing.map(getDocumentTypeLabel).join(", ")}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-xs text-gray-600 whitespace-nowrap">{formatDate(profile.createdAt)}</td>
                                            <td className="px-5 py-4 text-xs">
                                                <span className={`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-bold ${meta.className}`}>{meta.label}</span>
                                                {profile.reviewedAt && <p className="mt-1 text-gray-400">{formatDate(profile.reviewedAt)}</p>}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button type="button" onClick={() => setDetail(profile)}
                                                    className="inline-flex items-center gap-1.5 px-3 min-h-9 rounded-lg border border-[#0092B8]/20 bg-[#0092B8]/5 text-xs font-semibold text-[#0092B8] hover:bg-[#0092B8]/10">
                                                    <Eye size={14} />{profile.status === "PENDING" ? "Xem & duyệt" : "Xem"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-500">
                    <span>{data?.totalElements ?? 0} hồ sơ{tab === "PENDING" ? " · cũ nhất trước" : " · mới nhất trước"}</span>
                    <div className="flex items-center gap-2">
                        <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-3 min-h-10 border border-gray-200 rounded-lg disabled:opacity-40">Trước</button>
                        <span>Trang {page + 1} / {totalPages}</span>
                        <button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 min-h-10 border border-gray-200 rounded-lg disabled:opacity-40">Sau</button>
                    </div>
                </div>
            </div>

            {detail && (
                <DocDetailModal
                    profile={detail}
                    onClose={() => setDetail(null)}
                    onApprove={async () => {
                        await approve.mutateAsync(detail.id);
                        notify(`Đã duyệt hồ sơ — "${detail.organizationName ?? "tổ chức"}" đã được xác minh`);
                    }}
                    onReject={async (reason) => {
                        await reject.mutateAsync({ id: detail.id, reason });
                        notify("Đã từ chối hồ sơ, tổ chức có thể nộp lại");
                    }}
                />
            )}
        </div>
    );
}
