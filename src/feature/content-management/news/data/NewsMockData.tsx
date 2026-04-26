import { CardInfo } from "../../../user-management/user/data/UserMockData";

export interface NewsItem {
    newsId: number;
    title: string;
    content: string;
    banner: string;
    tag: string;
    targetType: "NONE" | "EVENT";
    targetId: number | null;
    totalRewardCoin: number;
    remainingRewardCoin: number;
    rewardPerMinute: number;
    viewCount: number;
    createdTime: string;
    // UI only
    author: string;
    date: string;
    isFeatured?: boolean;
}

export const MockNews: NewsItem[] = [
    {
        newsId: 1,
        title: "Công bố kết quả cuộc thi quốc tế",
        content: "Những người chiến thắng trong cuộc thi quốc tế năm nay đã được công bố sau nhiều vòng xét tuyển khắt khe. Chúc mừng tất cả các thí sinh đã tham gia và cống hiến hết mình.",
        banner: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80",
        tag: "competition, results",
        targetType: "EVENT",
        targetId: 42,
        totalRewardCoin: 100000,
        remainingRewardCoin: 99500,
        rewardPerMinute: 100,
        viewCount: 5432,
        createdTime: "2026-01-20T08:00:00",
        author: "Nguyễn Văn A",
        date: "20/01/2026",
        isFeatured: true
    },
    {
        newsId: 2,
        title: "Sự kiện Công nghệ AI 2025",
        content: "Tham gia sự kiện công nghệ AI lớn nhất năm với sự góp mặt của hàng trăm chuyên gia hàng đầu trong lĩnh vực trí tuệ nhân tạo.",
        banner: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80",
        tag: "ai, tech, event",
        targetType: "EVENT",
        targetId: 101,
        totalRewardCoin: 50000,
        remainingRewardCoin: 45000,
        rewardPerMinute: 50,
        viewCount: 3912,
        createdTime: "2026-02-10T09:30:00",
        author: "Trần Thị B",
        date: "10/02/2026"
    },
    {
        newsId: 3,
        title: "Workshop Nhiếp ảnh: Học từ chuyên gia",
        content: "Cơ hội học hỏi kỹ năng nhiếp ảnh thực chiến từ các nhiếp ảnh gia nổi tiếng. Chương trình bao gồm lý thuyết, thực hành và phản hồi trực tiếp.",
        banner: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80",
        tag: "workshop, photography",
        targetType: "NONE",
        targetId: null,
        totalRewardCoin: 0,
        remainingRewardCoin: 0,
        rewardPerMinute: 0,
        viewCount: 6830,
        createdTime: "2026-03-05T14:00:00",
        author: "Lê Văn C",
        date: "05/03/2026"
    }
];

export const NewsCardData: CardInfo[] = [
    { title: "Tổng tin tức", value: 3 },
    { title: "Tổng lượt xem", value: 16174, color: "text-blue-500" },
    { title: "Tổng xu thưởng", value: 150000, color: "text-amber-500" },
    { title: "Đính kèm sự kiện", value: 2, color: "text-[#0092B8]" }
];
