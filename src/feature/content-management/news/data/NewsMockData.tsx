import { CardInfo } from "../../../user-management/user/data/UserMockData";

export interface NewsItem {
    newsId: number;
    title: string;
    content: string;
    banner: string;
    tag: string;
    targetType: string;
    targetId: number | null;
    totalRewardCoin: number;
    remainingRewardCoin: number;
    rewardPerMinute: number;
    viewCount: number;
    createdTime: string;
}

export const MockNews: NewsItem[] = [];

export const NewsCardData: CardInfo[] = [
    { title: "Tổng tin tức", value: 0 },
    { title: "Tổng lượt xem", value: 0, color: "text-blue-500" },
    { title: "Tổng xu thưởng", value: 0, color: "text-amber-500" },
    { title: "Đính kèm sự kiện", value: 0, color: "text-[#0092B8]" }
];
