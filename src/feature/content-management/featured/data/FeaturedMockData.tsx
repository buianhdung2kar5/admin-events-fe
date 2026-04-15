import { CardInfo } from "../../../user-management/user/data/UserMockData";

export interface FeaturedItem {
    id: string;
    order: number;
    thumbnailUrl: string;
    title: string;
    organization: string;
    startTime: string;
    endTime: string;
    status: "Displaying" | "Scheduled" | "Expired";
    clicks: number;
}

export const MockFeatured: FeaturedItem[] = [
    {
        id: "1",
        order: 1,
        thumbnailUrl: "https://images.unsplash.com/photo-1540575861501-7ce0e224271a?w=400&q=80",
        title: "Hội thảo Công nghệ AI 2025",
        organization: "CLB Công nghệ BK",
        startTime: "1/1/2025",
        endTime: "31/3/2025",
        status: "Displaying",
        clicks: 1240
    },
    {
        id: "2",
        order: 2,
        thumbnailUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&q=80",
        title: "Đêm nhạc Sinh viên Acoustic",
        organization: "Đoàn TN ĐHQGHN",
        startTime: "15/1/2025",
        endTime: "15/2/2025",
        status: "Displaying",
        clicks: 870
    },
    {
        id: "3",
        order: 3,
        thumbnailUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80",
        title: "Workshop Kỹ năng Thuyết trình",
        organization: "CLB Kỹ năng mềm NEU",
        startTime: "1/3/2025",
        endTime: "1/4/2025",
        status: "Scheduled",
        clicks: 0
    },
    {
        id: "4",
        order: 4,
        thumbnailUrl: "https://images.unsplash.com/photo-1591115765373-520b7a42616f?w=400&q=80",
        title: "Hội thảo Kinh tế Số & Fintech 2025",
        organization: "Đại học Kinh tế Quốc dân",
        startTime: "1/11/2024",
        endTime: "31/12/2024",
        status: "Expired",
        clicks: 3200
    }
];

export const FeaturedCardData: CardInfo[] = [
    { title: "Tổng featured", value: 4 },
    { title: "Đang hiển thị", value: 2, color: "text-green-500" },
    { title: "Lên lịch", value: 1, color: "text-blue-500" },
    { title: "Tổng lượt click", value: 5310, color: "text-purple-600" }
];
