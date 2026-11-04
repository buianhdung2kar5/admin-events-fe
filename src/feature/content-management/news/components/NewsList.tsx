import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, EyeOff, ImageOff, Loader2, Newspaper, Pencil, Plus, Search, Send, Tag, Trash2 } from "lucide-react";
import Toast from "../../../../components/common/Toast";
import { getErrorMessage } from "../../../../services/apiError";
import { NEWS_QUERY_KEY, NewsApi } from "../../../../services/news-management/NewsApi";
import { isMockNewsId } from "../../../../services/news-management/newsMock";
import { safeHttpsUrl } from "../../../user-management/verify-document/DTO/VerificationInterface";
import type { NewsStatus, NewsSummary } from "../../../../types/news.types";
import { NEWS_STATUS_META, formatNewsDate } from "../newsDisplay";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;
const TOAST_DURATION_MS = 3000;
const INPUT_CLASS = "flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 min-h-11 focus-within:border-[#0092B8]";

const TABS: { value: NewsStatus | ""; label: string }[] = [
    { value: "", label: "Tất cả" },
    { value: "DRAFT", label: "Nháp" },
    { value: "PUBLISHED", label: "Đã đăng" },
];

function StatusBadge({ status }: { status: NewsStatus }) {
    const meta = NEWS_STATUS_META[status];
    return <span className={`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-bold whitespace-nowrap ${meta.className}`}>{meta.label}</span>;
}

function StatCard({ label, value, color }: { label: string; value: number | undefined; color: string }) {
    return (
        <div className="flex flex-col gap-2 items-center justify-center bg-white p-6 py-8 rounded-2xl shadow-sm border border-gray-100">
            <p className={`text-3xl font-bold ${color}`}>{value ?? "—"}</p>
            <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-wider">{label}</p>
        </div>
    );
}

function ConfirmDeleteDialog({ news, isDeleting, onCancel, onConfirm }: { news: NewsSummary; isDeleting: boolean; onCancel: () => void; onConfirm: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="delete-news-title">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
                <h2 id="delete-news-title" className="text-lg font-bold text-gray-800">Xóa tin nháp?</h2>
                <p className="text-sm text-gray-600">Tin <strong>{news.title}</strong> sẽ bị xóa và không khôi phục được.</p>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onCancel} autoFocus className="px-5 min-h-11 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">Hủy</button>
                    <button type="button" onClick={onConfirm} disabled={isDeleting}
                        className="px-5 min-h-11 inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50">
                        {isDeleting && <Loader2 size={14} className="animate-spin" />}Xóa tin
                    </button>
                </div>
            </div>
        </div>
    );
}

/** Danh sách tin tức (lọc + phân trang phía server). Sửa ở trang riêng; chỉ xóa được tin Nháp. */
export default function NewsList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<NewsStatus | "">("");
    const [search, setSearch] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const [tag, setTag] = useState("");
    const [page, setPage] = useState(0);
    const [deleting, setDeleting] = useState<NewsSummary | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setKeyword(search.trim());
            setTag(tagInput.trim());
            setPage(0);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [search, tagInput]);

    const notify = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), TOAST_DURATION_MS);
    };

    const params = { status: status || undefined, keyword: keyword || undefined, tag: tag || undefined, page, size: PAGE_SIZE };
    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: [...NEWS_QUERY_KEY, "list", params],
        queryFn: () => NewsApi.list(params),
        placeholderData: keepPreviousData,
    });
    const { data: counts } = useQuery({
        queryKey: [...NEWS_QUERY_KEY, "counts"],
        queryFn: async () => {
            const [total, draft, published] = await Promise.all([NewsApi.count(), NewsApi.count("DRAFT"), NewsApi.count("PUBLISHED")]);
            return { total, draft, published };
        },
    });

    const refresh = () => queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });
    const onActionError = (err: unknown) => notify(getErrorMessage(err, "Thao tác thất bại"), false);

    const publish = useMutation({
        mutationFn: NewsApi.publish,
        onSuccess: () => notify("Đã đăng tin"),
        onError: onActionError,
        onSettled: refresh,
    });
    const unpublish = useMutation({
        mutationFn: NewsApi.unpublish,
        onSuccess: () => notify("Đã gỡ tin khỏi trang công khai"),
        onError: onActionError,
        onSettled: refresh,
    });
    const remove = useMutation({
        mutationFn: NewsApi.remove,
        onSuccess: () => notify("Đã xóa tin"),
        onError: onActionError,
        onSettled: () => {
            setDeleting(null);
            refresh();
        },
    });

    const newsList = data?.items ?? [];
    const totalPages = Math.max(1, data?.totalPages ?? 1);
    const isBusy = publish.isPending || unpublish.isPending;

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Tổng số tin" value={counts?.total} color="text-gray-800" />
                <StatCard label="Nháp" value={counts?.draft} color="text-gray-500" />
                <StatCard label="Đã đăng" value={counts?.published} color="text-green-600" />
            </div>

            {data?.isMock && (
                <p role="status" className="flex items-start gap-2 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-800">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    Chưa gọi được API tin tức, đang hiện tin mẫu. Tin mẫu chỉ để xem, không sửa, đăng hay xóa được.
                </p>
            )}

            <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                <div role="tablist" aria-label="Lọc trạng thái" className="flex gap-1 bg-gray-100 p-1 rounded-xl self-start">
                    {TABS.map((tab) => (
                        <button key={tab.value} type="button" role="tab" aria-selected={status === tab.value}
                            onClick={() => { setStatus(tab.value); setPage(0); }}
                            className={`px-4 min-h-9 rounded-lg text-sm font-semibold transition-colors ${status === tab.value ? "bg-white text-[#0092B8] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <label className={`${INPUT_CLASS} flex-1`}>
                    <Search size={16} className="text-gray-400 shrink-0" aria-hidden="true" />
                    <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tiêu đề"
                        aria-label="Tìm tin tức" className="text-sm outline-none bg-transparent w-full" />
                </label>
                <label className={`${INPUT_CLASS} xl:w-56`}>
                    <Tag size={16} className="text-gray-400 shrink-0" aria-hidden="true" />
                    <input type="search" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Lọc theo thẻ"
                        aria-label="Lọc theo thẻ" className="text-sm outline-none bg-transparent w-full" />
                </label>
                <button type="button" onClick={() => navigate("/content-management/news/new")}
                    className="inline-flex items-center justify-center gap-2 bg-[#0092B8] text-white px-5 min-h-11 rounded-xl hover:bg-[#007a99] font-semibold text-sm">
                    <Plus size={16} aria-hidden="true" />Tạo tin
                </button>
            </div>

            {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                {isFetching && !isLoading && <Loader2 size={16} className="absolute top-4 right-4 animate-spin text-[#0092B8]" aria-label="Đang tải lại" />}
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#0092B8] animate-spin" /></div>
                ) : error ? (
                    <p role="alert" className="px-6 py-16 text-center text-sm font-medium text-red-500">{getErrorMessage(error, "Không tải được danh sách tin tức")}</p>
                ) : newsList.length === 0 ? (
                    <div className="px-6 py-16 flex flex-col items-center gap-2 text-sm text-gray-400">
                        <Newspaper size={32} className="text-gray-300" aria-hidden="true" /> Không có tin tức nào
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-5 py-4">Tin tức</th>
                                    <th className="px-5 py-4">Thẻ</th>
                                    <th className="px-5 py-4">Trạng thái</th>
                                    <th className="px-5 py-4 text-right">Lượt xem</th>
                                    <th className="px-5 py-4">Ngày đăng</th>
                                    <th className="px-5 py-4">Cập nhật</th>
                                    <th className="px-5 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {newsList.map((news) => {
                                    const banner = safeHttpsUrl(news.bannerUrl ?? "");
                                    const isMock = isMockNewsId(news.id);
                                    const editPath = `/content-management/news/${news.id}`;
                                    return (
                                        <tr key={news.id} className="align-middle hover:bg-blue-50/30 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3 min-w-[260px] max-w-md">
                                                    <div className="w-16 h-11 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-100 flex items-center justify-center">
                                                        {banner ? <img src={banner} alt="" loading="lazy" className="w-full h-full object-cover" /> : <ImageOff size={16} className="text-gray-300" aria-hidden="true" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <Link to={editPath} className="font-bold text-gray-800 hover:text-[#0092B8] line-clamp-2">{news.title}</Link>
                                                        <p className="text-xs text-gray-400 truncate">/{news.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                {news.tag ? <span className="px-2 py-0.5 bg-blue-50 text-[#0092B8] border border-blue-100 rounded text-[11px] font-bold">{news.tag}</span> : <span className="text-gray-300 text-xs">—</span>}
                                            </td>
                                            <td className="px-5 py-3"><StatusBadge status={news.status} /></td>
                                            <td className="px-5 py-3 text-right font-semibold text-gray-700 tabular-nums">{news.viewCount.toLocaleString("vi-VN")}</td>
                                            <td className="px-5 py-3 text-xs text-gray-600 whitespace-nowrap">{formatNewsDate(news.publishedAt)}</td>
                                            <td className="px-5 py-3 text-xs text-gray-600 whitespace-nowrap">{formatNewsDate(news.updatedAt)}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button type="button" onClick={() => navigate(editPath)} title={isMock ? "Xem" : "Sửa"} aria-label={`Sửa ${news.title}`}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-[#0092B8] hover:bg-blue-50"><Pencil size={16} /></button>
                                                    {news.status === "DRAFT" ? (
                                                        <button type="button" onClick={() => publish.mutate(news.id)} disabled={isMock || isBusy} title="Đăng tin" aria-label={`Đăng ${news.title}`}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:hover:bg-transparent"><Send size={16} /></button>
                                                    ) : (
                                                        <button type="button" onClick={() => unpublish.mutate(news.id)} disabled={isMock || isBusy} title="Gỡ đăng" aria-label={`Gỡ đăng ${news.title}`}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-40 disabled:hover:bg-transparent"><EyeOff size={16} /></button>
                                                    )}
                                                    {news.status === "DRAFT" && (
                                                        <button type="button" onClick={() => setDeleting(news)} disabled={isMock} title="Xóa" aria-label={`Xóa ${news.title}`}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"><Trash2 size={16} /></button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-500">
                    <span>{data?.totalElements ?? 0} tin · mới cập nhật trước</span>
                    <div className="flex items-center gap-2">
                        <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-3 min-h-10 border border-gray-200 rounded-lg disabled:opacity-40">Trước</button>
                        <span>Trang {page + 1} / {totalPages}</span>
                        <button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 min-h-10 border border-gray-200 rounded-lg disabled:opacity-40">Sau</button>
                    </div>
                </div>
            </div>

            {deleting && (
                <ConfirmDeleteDialog news={deleting} isDeleting={remove.isPending}
                    onCancel={() => setDeleting(null)} onConfirm={() => remove.mutate(deleting.id)} />
            )}
        </div>
    );
}
