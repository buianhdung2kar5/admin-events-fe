import type { PageResponse } from "../../types/api.types";
import type { News, NewsListParams, NewsSummary } from "../../types/news.types";

/** Id tin mẫu có tiền tố này — dùng để khóa thao tác ghi. */
export const MOCK_NEWS_ID_PREFIX = "mock-";

export const isMockNewsId = (id: string): boolean => id.startsWith(MOCK_NEWS_ID_PREFIX);

/** Tin mẫu hiển thị khi API tin tức trả 404 / 5xx / không kết nối được (backend chưa restart). */
const MOCK_NEWS: News[] = [
    {
        id: `${MOCK_NEWS_ID_PREFIX}1`,
        slug: "khai-mac-ngay-hoi-viec-lam-sinh-vien-2026",
        title: "Khai mạc Ngày hội việc làm sinh viên 2026",
        summary: "Hơn 80 doanh nghiệp tham gia, mang đến hàng nghìn vị trí thực tập và việc làm cho sinh viên.",
        content: "<h2>Ngày hội việc làm 2026</h2><p>Sự kiện diễn ra tại <strong>hội trường A</strong> với hơn 80 doanh nghiệp.</p><ul><li>Phỏng vấn trực tiếp</li><li>Tư vấn CV</li></ul>",
        bannerUrl: null,
        tag: "Việc làm",
        status: "PUBLISHED",
        viewCount: 1250,
        publishedAt: "2026-10-28T08:00:00Z",
        createdAt: "2026-10-27T03:00:00Z",
        updatedAt: "2026-10-28T08:00:00Z",
    },
    {
        id: `${MOCK_NEWS_ID_PREFIX}2`,
        slug: "huong-dan-dang-ky-tinh-nguyen-vien-mua-he-xanh",
        title: "Hướng dẫn đăng ký tình nguyện viên Mùa hè xanh",
        summary: "Các bước đăng ký, giấy tờ cần chuẩn bị và lịch phỏng vấn.",
        content: "<p>Bước 1: Đăng nhập hệ thống.</p><p>Bước 2: Chọn chiến dịch và nộp đơn.</p>",
        bannerUrl: null,
        tag: "Tình nguyện",
        status: "PUBLISHED",
        viewCount: 640,
        publishedAt: "2026-10-20T02:00:00Z",
        createdAt: "2026-10-19T09:00:00Z",
        updatedAt: "2026-10-21T04:30:00Z",
    },
    {
        id: `${MOCK_NEWS_ID_PREFIX}3`,
        slug: "thong-bao-bao-tri-he-thong-thang-11",
        title: "Thông báo bảo trì hệ thống tháng 11",
        summary: null,
        content: "<p>Hệ thống sẽ bảo trì từ 22h đến 23h ngày 15/11.</p>",
        bannerUrl: null,
        tag: "Thông báo",
        status: "DRAFT",
        viewCount: 0,
        publishedAt: null,
        createdAt: "2026-11-03T07:00:00Z",
        updatedAt: "2026-11-04T01:15:00Z",
    },
];

const toSummary = ({ content: _content, ...summary }: News): NewsSummary => summary;

export function mockNewsPage(params: NewsListParams): PageResponse<NewsSummary> {
    const keyword = params.keyword?.toLowerCase();
    const tag = params.tag?.toLowerCase();
    const filtered = MOCK_NEWS
        .filter((news) => !params.status || news.status === params.status)
        .filter((news) => !keyword || news.title.toLowerCase().includes(keyword))
        .filter((news) => !tag || (news.tag ?? "").toLowerCase().includes(tag))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const start = params.page * params.size;
    return {
        items: filtered.slice(start, start + params.size).map(toSummary),
        page: params.page,
        size: params.size,
        totalElements: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / params.size)),
    };
}

export const findMockNews = (id: string): News | undefined => MOCK_NEWS.find((news) => news.id === id);
