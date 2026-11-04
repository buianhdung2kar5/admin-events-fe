import { useEffect, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { AlertCircle, AlertTriangle, EyeOff, ImagePlus, Loader2, RotateCcw, Save, Send, X } from "lucide-react";
import { ApiError, getErrorMessage } from "../../../../services/apiError";
import { UploadService } from "../../../../services/UploadService";
import { safeHttpsUrl } from "../../../user-management/verify-document/DTO/VerificationInterface";
import type { News, NewsUpsertBody } from "../../../../types/news.types";
import { toSlug } from "../../../../utils/slug";
import {
    NEWS_CONTENT_MAX_LENGTH,
    NEWS_SUMMARY_MAX_LENGTH,
    NEWS_TAG_MAX_LENGTH,
    NEWS_TITLE_MAX_LENGTH,
    buildNewsSchema,
    toNewsBody,
    type NewsFormField,
    type NewsFormValues,
} from "../newsForm.schema";
import { NEWS_STATUS_META, formatNewsDate, newsPublicPath } from "../newsDisplay";
import NewsEditor from "./NewsEditor";

export type NewsSubmitAction = "save" | "publish";

interface Props {
    /** undefined = tạo mới */
    news?: News;
    /** Tin mẫu (API lỗi) — chỉ xem */
    readOnly?: boolean;
    onSubmit: (body: NewsUpsertBody, action: NewsSubmitAction) => Promise<unknown>;
    onUnpublish: () => Promise<unknown>;
    onCancel: () => void;
    /** Tải lại tin từ server (sau lỗi CONCURRENT_MODIFICATION) */
    onReload: () => void;
    onDirtyChange: (dirty: boolean) => void;
}

const INPUT_CLASS = "w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500";
const inputClass = (invalid: boolean) => `${INPUT_CLASS} ${invalid ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-[#0092B8]"}`;
const FIELD_NAMES: NewsFormField[] = ["title", "summary", "tag", "bannerUrl", "content"];
const isFormField = (field: string): field is NewsFormField => (FIELD_NAMES as string[]).includes(field);

const toFormValues = (news?: News): NewsFormValues => ({
    title: news?.title ?? "",
    summary: news?.summary ?? "",
    tag: news?.tag ?? "",
    bannerUrl: news?.bannerUrl ?? "",
    content: news?.content ?? "",
    contentEmpty: !news?.content?.replace(/<p>\s*<\/p>/g, "").trim(),
});

function Field({ label, hint, error, children }: { label: string; hint?: ReactNode; error?: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-end justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</span>
                {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
            </div>
            {children}
            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        </div>
    );
}

/** Form tạo / sửa tin. Tin đã đăng không đổi được tiêu đề (giữ slug — backend sẽ chặn sau, mục 11). */
export default function NewsForm({ news, readOnly = false, onSubmit, onUnpublish, onCancel, onReload, onDirtyChange }: Props) {
    const [values, setValues] = useState<NewsFormValues>(() => toFormValues(news));
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<NewsFormField, string>>>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isConflict, setIsConflict] = useState(false);
    const [pending, setPending] = useState<NewsSubmitAction | "unpublish" | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const isPublished = news?.status === "PUBLISHED";
    const disabled = readOnly || pending !== null;
    const slug = isPublished && news ? news.slug : toSlug(values.title);
    const banner = safeHttpsUrl(values.bannerUrl);

    useEffect(() => onDirtyChange(isDirty), [isDirty, onDirtyChange]);

    const update = (patch: Partial<NewsFormValues>) => {
        setValues((prev) => ({ ...prev, ...patch }));
        setIsDirty(true);
    };
    const change = (key: "title" | "summary" | "tag") => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update({ [key]: e.target.value });

    const uploadBanner = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        setIsUploading(true);
        setFieldErrors((prev) => ({ ...prev, bannerUrl: undefined }));
        try {
            const { fileUrl } = await UploadService.uploadImage(file, "news");
            update({ bannerUrl: fileUrl });
        } catch (err: unknown) {
            setFieldErrors((prev) => ({ ...prev, bannerUrl: getErrorMessage(err, "Không tải được ảnh banner") }));
        } finally {
            setIsUploading(false);
        }
    };

    const showServerError = (err: unknown) => {
        if (err instanceof ApiError) {
            if (err.code === "NEWS_SLUG_TAKEN") {
                setFieldErrors({ title: "Tiêu đề này trùng với tin đã có, hãy đổi tiêu đề" });
                return;
            }
            if (err.code === "CONCURRENT_MODIFICATION") {
                setIsConflict(true);
                return;
            }
            const mapped = err.fieldErrors.filter((item) => isFormField(item.field));
            if (mapped.length > 0) {
                setFieldErrors(Object.fromEntries(mapped.map((item) => [item.field, item.message])));
                if (mapped.length === err.fieldErrors.length) return;
            }
        }
        setFormError(getErrorMessage(err, "Không lưu được tin"));
    };

    const submit = async (action: NewsSubmitAction) => {
        const parsed = buildNewsSchema(action === "publish" || isPublished).safeParse(values);
        setFormError(null);
        setIsConflict(false);
        if (!parsed.success) {
            const errors: Partial<Record<NewsFormField, string>> = {};
            parsed.error.issues.forEach((issue) => {
                const field = String(issue.path[0]);
                if (isFormField(field) && !errors[field]) errors[field] = issue.message;
            });
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});
        setPending(action);
        try {
            await onSubmit(toNewsBody(values, isPublished ? news?.slug : undefined), action);
            setIsDirty(false);
        } catch (err: unknown) {
            showServerError(err);
        } finally {
            setPending(null);
        }
    };

    const unpublish = async () => {
        setFormError(null);
        setPending("unpublish");
        try {
            await onUnpublish();
        } catch (err: unknown) {
            showServerError(err);
        } finally {
            setPending(null);
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                <Field label="Tiêu đề *" hint={`${values.title.length}/${NEWS_TITLE_MAX_LENGTH}`} error={fieldErrors.title}>
                    <input type="text" value={values.title} onChange={change("title")} disabled={disabled || isPublished} maxLength={NEWS_TITLE_MAX_LENGTH}
                        placeholder="Nhập tiêu đề bài viết" aria-invalid={Boolean(fieldErrors.title)} className={inputClass(Boolean(fieldErrors.title))} />
                    <p className="text-xs text-gray-400 break-all">
                        Đường dẫn: <span className="font-medium text-gray-600">{slug ? newsPublicPath(slug) : "— (tiêu đề cần có chữ hoặc số)"}</span>
                    </p>
                    {isPublished && (
                        <p className="flex items-start gap-1.5 text-xs text-amber-700">
                            <AlertTriangle size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                            Tin đang đăng không đổi được tiêu đề (đổi tiêu đề sẽ đổi đường dẫn). Gỡ đăng để sửa tiêu đề.
                        </p>
                    )}
                </Field>

                <Field label="Mô tả ngắn" hint={`${values.summary.length}/${NEWS_SUMMARY_MAX_LENGTH}`} error={fieldErrors.summary}>
                    <textarea value={values.summary} onChange={change("summary")} disabled={disabled} rows={3} maxLength={NEWS_SUMMARY_MAX_LENGTH}
                        placeholder="Hiện trên thẻ danh sách tin" className={`${inputClass(Boolean(fieldErrors.summary))} resize-none`} />
                </Field>

                <Field label={isPublished ? "Nội dung *" : "Nội dung"} hint={`${values.content.length.toLocaleString("vi-VN")}/${NEWS_CONTENT_MAX_LENGTH.toLocaleString("vi-VN")}`} error={fieldErrors.content}>
                    <NewsEditor initialContent={values.content} disabled={disabled} invalid={Boolean(fieldErrors.content)}
                        onChange={(html, isEmpty) => update({ content: html, contentEmpty: isEmpty })} />
                </Field>
            </section>

            <aside className="flex flex-col gap-4 xl:sticky xl:top-4">
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Trạng thái</span>
                        <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${NEWS_STATUS_META[news?.status ?? "DRAFT"].className}`}>
                            {news ? NEWS_STATUS_META[news.status].label : "Tin mới"}
                        </span>
                    </div>
                    {news && (
                        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                            <dt className="text-gray-400">Lượt xem</dt><dd className="text-gray-700 font-semibold">{news.viewCount.toLocaleString("vi-VN")}</dd>
                            <dt className="text-gray-400">Ngày đăng</dt><dd className="text-gray-700">{formatNewsDate(news.publishedAt)}</dd>
                            <dt className="text-gray-400">Cập nhật</dt><dd className="text-gray-700">{formatNewsDate(news.updatedAt)}</dd>
                        </dl>
                    )}

                    {isConflict && (
                        <div role="alert" className="flex flex-col gap-2 px-3 py-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-800">
                            Người khác vừa sửa tin này. Tải lại để lấy bản mới nhất (thay đổi chưa lưu sẽ mất).
                            <button type="button" onClick={onReload} className="self-start inline-flex items-center gap-1.5 px-3 min-h-9 rounded-lg bg-white border border-amber-200 font-semibold hover:bg-amber-100">
                                <RotateCcw size={13} aria-hidden="true" />Tải lại
                            </button>
                        </div>
                    )}
                    {formError && (
                        <p role="alert" className="flex items-start gap-2 px-3 py-2.5 bg-red-50 rounded-xl border border-red-100 text-xs font-medium text-red-600">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />{formError}
                        </p>
                    )}

                    {!readOnly && (
                        <div className="flex flex-col gap-2 pt-1">
                            {isPublished ? (
                                <>
                                    <button type="button" onClick={() => submit("save")} disabled={disabled || isUploading}
                                        className="inline-flex items-center justify-center gap-2 min-h-11 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] disabled:opacity-50">
                                        {pending === "save" ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} aria-hidden="true" />}Lưu thay đổi
                                    </button>
                                    <button type="button" onClick={unpublish} disabled={disabled}
                                        className="inline-flex items-center justify-center gap-2 min-h-11 rounded-xl text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 disabled:opacity-50">
                                        {pending === "unpublish" ? <Loader2 size={15} className="animate-spin" /> : <EyeOff size={15} aria-hidden="true" />}Gỡ đăng
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button type="button" onClick={() => submit("publish")} disabled={disabled || isUploading}
                                        className="inline-flex items-center justify-center gap-2 min-h-11 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] disabled:opacity-50">
                                        {pending === "publish" ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} aria-hidden="true" />}Lưu &amp; đăng
                                    </button>
                                    <button type="button" onClick={() => submit("save")} disabled={disabled || isUploading}
                                        className="inline-flex items-center justify-center gap-2 min-h-11 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
                                        {pending === "save" ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} aria-hidden="true" />}Lưu nháp
                                    </button>
                                </>
                            )}
                            <button type="button" onClick={onCancel} disabled={pending !== null} className="min-h-11 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 disabled:opacity-50">Hủy</button>
                        </div>
                    )}
                </section>

                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                    <Field label="Ảnh banner" error={fieldErrors.bannerUrl}>
                        <div className="relative aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                            {banner ? (
                                <>
                                    <img src={banner} alt="Banner tin" className="w-full h-full object-cover" />
                                    {!disabled && (
                                        <button type="button" onClick={() => update({ bannerUrl: "" })} aria-label="Gỡ banner"
                                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-gray-600 hover:text-red-500 shadow-sm"><X size={14} /></button>
                                    )}
                                </>
                            ) : (
                                <label className={`flex flex-col items-center gap-2 text-xs font-semibold text-gray-400 ${disabled ? "" : "cursor-pointer hover:text-[#0092B8]"}`}>
                                    {isUploading ? <Loader2 size={22} className="animate-spin text-[#0092B8]" /> : <ImagePlus size={22} aria-hidden="true" />}
                                    {isUploading ? "Đang tải ảnh…" : "Chọn ảnh (16:9)"}
                                    <input type="file" accept="image/*" onChange={uploadBanner} disabled={disabled || isUploading} className="sr-only" />
                                </label>
                            )}
                        </div>
                    </Field>
                    <Field label="Thẻ" hint={`${values.tag.length}/${NEWS_TAG_MAX_LENGTH}`} error={fieldErrors.tag}>
                        <input type="text" value={values.tag} onChange={change("tag")} disabled={disabled} maxLength={NEWS_TAG_MAX_LENGTH}
                            placeholder="VD: Việc làm" className={inputClass(Boolean(fieldErrors.tag))} />
                    </Field>
                </section>
            </aside>
        </div>
    );
}
