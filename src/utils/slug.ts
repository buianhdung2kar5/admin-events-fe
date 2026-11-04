export const SLUG_MAX_LENGTH = 100;

/**
 * Sinh slug từ tiêu đề (quy tắc §15): bỏ dấu tiếng Việt (đ → d), chữ thường, ký tự ngoài a-z0-9 → "-",
 * gộp "-", bỏ "-" đầu/cuối, cắt ≤ 100 ký tự ở ranh giới "-". Trả "" khi tiêu đề không còn chữ/số.
 */
export function toSlug(title: string): string {
    const slug = title
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    if (slug.length <= SLUG_MAX_LENGTH) return slug;
    const cut = slug.slice(0, SLUG_MAX_LENGTH + 1);
    const boundary = cut.lastIndexOf("-");
    // Một "từ" dài hơn 100 ký tự thì cắt cứng
    return (boundary > 0 ? cut.slice(0, boundary) : slug.slice(0, SLUG_MAX_LENGTH)).replace(/-+$/, "");
}
