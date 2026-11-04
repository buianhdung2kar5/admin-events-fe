import { useState } from "react";
import { Plus, Loader2, Sparkles } from "lucide-react";
import Toast from "../../../../components/common/Toast";
import { getErrorMessage } from "../../../../services/apiError";
import type { FeaturePlacement } from "../../../../types/package.types";
import type { FeaturedEventListParams, FeaturedEventResponse } from "../../../../types/featured.types";
import { FEATURED_TABS, type FeaturedTab } from "../featuredDisplay";
import { useFeaturedEvents } from "../hooks/useFeaturedEvents";
import FeaturedFormModal from "./FeaturedFormModal";
import FeaturedReasonModal, { type ReasonAction } from "./FeaturedReasonModal";
import FeaturedRow, { type FeaturedRowAction } from "./FeaturedRow";
import FeaturedSettingsModal from "./FeaturedSettingsModal";

const PAGE_SIZE = 20;
const TOAST_DURATION_MS = 3000;

interface FeaturedListProps {
    /** Từ GroupFilter của trang: search (lọc trên trang hiện tại), filter1 = placement (server) */
    filter?: { search?: string; filter1?: string };
}

type ModalState =
    | { kind: "none" }
    | { kind: "create" }
    | { kind: "approve" | "edit"; item: FeaturedEventResponse }
    | { kind: "reason"; action: ReasonAction; item: FeaturedEventResponse };

const SUCCESS_MESSAGES: Record<ReasonAction, string> = {
    reject: "Đã từ chối đơn, tổ chức được trả lượt",
    revoke: "Đã gỡ ghim sự kiện",
    revokePackage: "Đã thu hồi gói của tổ chức",
};

function toListParams(tab: FeaturedTab, placement: string | undefined, page: number): FeaturedEventListParams {
    return {
        status: tab === "ALL" || tab === "REMOVAL_REQUESTED" ? undefined : tab,
        removalRequested: tab === "REMOVAL_REQUESTED" ? true : undefined,
        placement: placement ? (placement as FeaturePlacement) : undefined,
        page,
        size: PAGE_SIZE,
    };
}

/** Quản lý sự kiện nổi bật: tab trạng thái, mới nhất trước, phân trang server, thao tác theo trạng thái. */
export default function FeaturedList({ filter }: FeaturedListProps) {
    const [tab, setTab] = useState<FeaturedTab>("ALL");
    const [page, setPage] = useState(0);
    const [modal, setModal] = useState<ModalState>({ kind: "none" });
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const placement = filter?.filter1 || undefined;
    const [lastPlacement, setLastPlacement] = useState(placement);

    // Đổi bộ lọc vị trí → về trang đầu (điều chỉnh state trong render thay cho effect)
    if (placement !== lastPlacement) {
        setLastPlacement(placement);
        setPage(0);
    }

    const featured = useFeaturedEvents(toListParams(tab, placement, page));
    const keyword = (filter?.search ?? "").trim().toLowerCase();
    const items = (featured.page?.items ?? []).filter((item) =>
        !keyword
        || (item.eventTitle ?? "").toLowerCase().includes(keyword)
        || (item.organizerName ?? "").toLowerCase().includes(keyword));
    const totalPages = Math.max(1, featured.page?.totalPages ?? 1);
    const now = new Date();

    const notify = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), TOAST_DURATION_MS);
    };
    const close = () => setModal({ kind: "none" });

    const handleTab = (next: FeaturedTab) => {
        setTab(next);
        setPage(0);
    };

    const handleAction = (action: FeaturedRowAction, item: FeaturedEventResponse) => {
        if (action === "approve" || action === "edit") setModal({ kind: action, item });
        else setModal({ kind: "reason", action, item });
    };

    const confirmReason = async (action: ReasonAction, item: FeaturedEventResponse, reason: string) => {
        if (action === "reject") await featured.reject({ id: item.id, reason });
        else if (action === "revoke") await featured.revoke({ id: item.id, reason });
        else if (item.userPackageId) await featured.revokePackage({ userPackageId: item.userPackageId, reason });
        notify(SUCCESS_MESSAGES[action]);
    };

    return (
        <div className="flex flex-col gap-5">
            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="flex items-center justify-between gap-3 flex-wrap">
                <nav className="flex gap-1 bg-gray-100 p-1 rounded-xl flex-wrap" aria-label="Lọc theo trạng thái">
                    {FEATURED_TABS.map(({ key, label }) => (
                        <button key={key} type="button" onClick={() => handleTab(key)} aria-pressed={tab === key}
                            className={`px-3.5 min-h-10 rounded-lg text-sm font-semibold transition-all ${tab === key ? "bg-white shadow-sm text-[#0092B8]" : "text-gray-500 hover:text-gray-700"}`}>
                            {label}
                        </button>
                    ))}
                </nav>
                <button type="button" onClick={() => setModal({ kind: "create" })}
                    className="px-4 min-h-11 bg-[#0092B8] text-white text-sm font-semibold rounded-xl hover:bg-[#007a99] transition-colors shadow-sm flex items-center gap-2">
                    <Plus size={18} /> Gắn nổi bật
                </button>
            </div>

            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                {featured.isFetching && !featured.isLoading && (
                    <Loader2 size={16} className="absolute top-4 right-4 animate-spin text-[#0092B8]" aria-label="Đang tải lại" />
                )}
                {featured.isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#0092B8] animate-spin" /></div>
                ) : featured.error ? (
                    <p role="alert" className="px-6 py-16 text-center text-sm font-medium text-red-500">
                        {getErrorMessage(featured.error, "Không tải được danh sách sự kiện nổi bật")}
                    </p>
                ) : items.length === 0 ? (
                    <div className="px-6 py-16 flex flex-col items-center gap-2 text-sm text-gray-400">
                        <Sparkles size={32} className="text-gray-300" aria-hidden="true" /> Không có bản ghi nào
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-5 py-4">Sự kiện · Tổ chức</th>
                                    <th className="px-5 py-4">Nguồn</th>
                                    <th className="px-5 py-4">Vị trí</th>
                                    <th className="px-5 py-4">Khung giờ</th>
                                    <th className="px-5 py-4">Trạng thái</th>
                                    <th className="px-5 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.map((item) => <FeaturedRow key={item.id} item={item} now={now} onAction={handleAction} />)}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-500">
                    <span>{featured.page?.totalElements ?? 0} bản ghi · mới nhất trước</span>
                    <div className="flex items-center gap-2">
                        <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-3 min-h-10 border border-gray-200 rounded-lg disabled:opacity-40">Trước</button>
                        <span>Trang {page + 1} / {totalPages}</span>
                        <button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 min-h-10 border border-gray-200 rounded-lg disabled:opacity-40">Sau</button>
                    </div>
                </div>
            </div>

            {modal.kind === "create" && (
                <FeaturedFormModal onClose={close} onSubmit={async (body) => {
                    await featured.create(body);
                    notify("Đã gắn sự kiện nổi bật");
                }} />
            )}
            {modal.kind === "approve" && (
                <FeaturedSettingsModal mode="approve" item={modal.item} onClose={close} onSubmit={async (body) => {
                    await featured.approve({ id: modal.item.id, body });
                    notify("Đã duyệt, sự kiện hiển thị ngay");
                }} />
            )}
            {modal.kind === "edit" && (
                <FeaturedSettingsModal mode="edit" item={modal.item} onClose={close} onSubmit={async (body) => {
                    await featured.update({ id: modal.item.id, body });
                    notify("Đã cập nhật sự kiện nổi bật");
                }} />
            )}
            {modal.kind === "reason" && (
                <FeaturedReasonModal action={modal.action} item={modal.item} onClose={close}
                    onConfirm={(reason) => confirmReason(modal.action, modal.item, reason)} />
            )}
        </div>
    );
}
