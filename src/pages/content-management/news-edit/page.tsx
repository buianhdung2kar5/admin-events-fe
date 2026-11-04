import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import Toast from "../../../components/common/Toast";
import { getErrorMessage } from "../../../services/apiError";
import { NEWS_QUERY_KEY, NewsApi } from "../../../services/news-management/NewsApi";
import { isMockNewsId } from "../../../services/news-management/newsMock";
import NewsForm, { type NewsSubmitAction } from "../../../feature/content-management/news/components/NewsForm";
import type { News, NewsUpsertBody } from "../../../types/news.types";

const LIST_PATH = "/content-management/news";
const TOAST_DURATION_MS = 3000;
const LEAVE_CONFIRM = "Thay đổi chưa lưu sẽ mất. Rời trang?";

interface LocationState {
    toast?: string;
    ok?: boolean;
}

/** Trang tạo (/content-management/news/new) và sửa (/content-management/news/:newsId) tin tức. */
export default function NewsEditPage() {
    const { newsId } = useParams();
    const isNew = !newsId;
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [isDirty, setIsDirty] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const detailKey = [...NEWS_QUERY_KEY, "detail", newsId] as const;

    const { data: news, isLoading, error, refetch } = useQuery({
        queryKey: detailKey,
        queryFn: () => NewsApi.get(newsId ?? ""),
        enabled: !isNew,
    });

    const notify = useCallback((msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), TOAST_DURATION_MS);
    }, []);

    // Thông báo chuyển từ trang tạo mới sang trang sửa
    useEffect(() => {
        const state = location.state as LocationState | null;
        if (!state?.toast) return;
        notify(state.toast, state.ok ?? true);
        navigate(location.pathname, { replace: true, state: null });
    }, [location.pathname, location.state, navigate, notify]);

    useEffect(() => {
        if (!isDirty) return;
        const warn = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [isDirty]);

    const afterChange = (saved: News) => {
        queryClient.setQueryData([...NEWS_QUERY_KEY, "detail", saved.id], saved);
        queryClient.invalidateQueries({ queryKey: [...NEWS_QUERY_KEY, "list"] });
        queryClient.invalidateQueries({ queryKey: [...NEWS_QUERY_KEY, "counts"] });
    };

    const handleSubmit = async (body: NewsUpsertBody, action: NewsSubmitAction) => {
        let saved = news ? await NewsApi.update(news.id, body) : await NewsApi.create(body);
        afterChange(saved);
        if (action === "publish") {
            try {
                saved = await NewsApi.publish(saved.id);
                afterChange(saved);
            } catch (err: unknown) {
                // Đã lưu nháp nhưng đăng lỗi (422…): tin mới thì chuyển sang trang sửa rồi báo lỗi ở đó
                if (!isNew) throw err;
                const state: LocationState = { toast: `Đã lưu nháp nhưng chưa đăng được: ${getErrorMessage(err, "lỗi máy chủ")}`, ok: false };
                navigate(`${LIST_PATH}/${saved.id}`, { replace: true, state });
                return;
            }
        }
        const message = action === "publish" ? "Đã lưu và đăng tin" : "Đã lưu tin";
        const state: LocationState = { toast: message };
        if (isNew) navigate(`${LIST_PATH}/${saved.id}`, { replace: true, state });
        else notify(message);
    };

    const handleUnpublish = async () => {
        if (!news) return;
        afterChange(await NewsApi.unpublish(news.id));
        notify("Đã gỡ tin khỏi trang công khai");
    };

    const handleReload = async () => {
        await refetch();
        setReloadCount((count) => count + 1);
    };

    const leave = () => {
        if (isDirty && !window.confirm(LEAVE_CONFIRM)) return;
        navigate(LIST_PATH);
    };

    const readOnly = Boolean(newsId && isMockNewsId(newsId));

    return (
        <div className="flex flex-col gap-6 pb-12">
            <header className="flex items-center gap-4">
                <button type="button" onClick={leave} aria-label="Quay lại danh sách tin" className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                    <ArrowLeft size={18} className="text-gray-600" />
                </button>
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-gray-800">{isNew ? "Tạo tin tức" : "Sửa tin tức"}</h1>
                    <p className="text-sm text-gray-500 truncate">{news?.title ?? "Soạn nội dung, lưu nháp hoặc đăng ngay"}</p>
                </div>
            </header>

            <Toast toast={toast} onClose={() => setToast(null)} />

            {readOnly && (
                <p role="status" className="flex items-start gap-2 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-800">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    Đây là tin mẫu (chưa gọi được API tin tức) — chỉ xem, không lưu được.
                </p>
            )}

            {!isNew && isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#0092B8] animate-spin" /></div>
            ) : !isNew && (error || !news) ? (
                <div className="flex flex-col items-center gap-3 py-16">
                    <p role="alert" className="text-sm font-medium text-red-500">{getErrorMessage(error, "Không tìm thấy tin tức")}</p>
                    <button type="button" onClick={() => navigate(LIST_PATH)} className="px-5 min-h-11 rounded-xl bg-[#0092B8] text-white text-sm font-semibold">Về danh sách</button>
                </div>
            ) : (
                <NewsForm
                    key={news ? `${news.id}-${news.updatedAt}-${news.status}-${reloadCount}` : "new"}
                    news={news}
                    readOnly={readOnly}
                    onSubmit={handleSubmit}
                    onUnpublish={handleUnpublish}
                    onCancel={leave}
                    onReload={handleReload}
                    onDirtyChange={setIsDirty}
                />
            )}
        </div>
    );
}
