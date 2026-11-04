import { z } from "zod";
import { SLUG_MAX_LENGTH, toSlug } from "../../../utils/slug";
import type { NewsUpsertBody } from "../../../types/news.types";

export const NEWS_TITLE_MAX_LENGTH = 255;
export const NEWS_SUMMARY_MAX_LENGTH = 500;
export const NEWS_TAG_MAX_LENGTH = 50;
export const NEWS_BANNER_MAX_LENGTH = 500;
export const NEWS_CONTENT_MAX_LENGTH = 100000;

export interface NewsFormValues {
    title: string;
    summary: string;
    tag: string;
    bannerUrl: string;
    content: string;
    /** Editor không có chữ/ảnh nào (HTML rỗng kiểu "<p></p>") */
    contentEmpty: boolean;
}

export type NewsFormField = "title" | "summary" | "tag" | "bannerUrl" | "content";

const optionalText = (max: number, label: string) => z.string().trim().max(max, `${label} tối đa ${max} ký tự`);

/** requireContent: khi đăng, hoặc khi sửa tin đang đăng (backend trả 422 nếu trống). */
export const buildNewsSchema = (requireContent: boolean) =>
    z
        .object({
            title: z.string().trim().min(1, "Vui lòng nhập tiêu đề").max(NEWS_TITLE_MAX_LENGTH, `Tiêu đề tối đa ${NEWS_TITLE_MAX_LENGTH} ký tự`),
            summary: optionalText(NEWS_SUMMARY_MAX_LENGTH, "Mô tả ngắn"),
            tag: optionalText(NEWS_TAG_MAX_LENGTH, "Thẻ"),
            bannerUrl: z
                .string()
                .trim()
                .max(NEWS_BANNER_MAX_LENGTH, `Link banner tối đa ${NEWS_BANNER_MAX_LENGTH} ký tự`)
                .refine((url) => url === "" || url.startsWith("https://"), "Banner phải là link https://"),
            content: z.string().max(NEWS_CONTENT_MAX_LENGTH, `Nội dung tối đa ${NEWS_CONTENT_MAX_LENGTH.toLocaleString("vi-VN")} ký tự (tính cả định dạng)`),
            contentEmpty: z.boolean(),
        })
        .superRefine((values, ctx) => {
            if (values.title.trim() && !toSlug(values.title)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["title"], message: "Tiêu đề phải có ít nhất một chữ cái hoặc chữ số" });
            }
            if (requireContent && values.contentEmpty) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["content"], message: "Tin đăng công khai phải có nội dung" });
            }
        });

const orNull = (value: string): string | null => (value.trim() ? value.trim() : null);

/** PUT gửi đủ trường: ô trống → null (xóa giá trị cũ). slug giữ nguyên khi tin đã đăng (không đổi tiêu đề). */
export const toNewsBody = (values: NewsFormValues, fixedSlug?: string): NewsUpsertBody => ({
    title: values.title.trim(),
    slug: fixedSlug ?? toSlug(values.title).slice(0, SLUG_MAX_LENGTH),
    summary: orNull(values.summary),
    content: values.contentEmpty ? null : values.content,
    bannerUrl: orNull(values.bannerUrl),
    tag: orNull(values.tag),
});
