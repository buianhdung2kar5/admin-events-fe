import { CardInfo } from "../../../user-management/user/data/UserMockData";

export interface FeaturedItem {
    id: string; // The featured event record ID
    eventId: string; // Links to MockEvents in EventMockData
    priority: number; // Smaller = higher priority
    thumbnailUrl: string;
    title: string;
    organization: string;
    startDate: string; // ISO String
    endDate: string;   // ISO String
    status: "Displaying" | "Scheduled" | "Expired";
    clicks: number;
}

export const MockFeatured: FeaturedItem[] = [
    {
        id: "1",
        eventId: "ev-001",
        priority: 1,
        thumbnailUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=80",
        title: "NEU Business Summit 2024: Kỷ nguyên AI",
        organization: "ĐH Kinh tế Quốc dân",
        startDate: "2024-03-01T08:00:00Z",
        endDate: "2024-04-15T17:00:00Z",
        status: "Displaying",
        clicks: 1240
    },
    {
        id: "2",
        eventId: "ev-002",
        priority: 2,
        thumbnailUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&q=80",
        title: "TechDay BK 2024 - Hackathon",
        organization: "CLB Công nghệ BK",
        startDate: "2024-03-10T08:00:00Z",
        endDate: "2024-04-22T17:00:00Z",
        status: "Scheduled",
        clicks: 870
    },
    {
        id: "3",
        eventId: "ev-003",
        priority: 3,
        thumbnailUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80",
        title: "Music Festival: Đêm Hội Ngoại Thương",
        organization: "Hội SV Ngoại Thương",
        startDate: "2024-04-01T00:00:00Z",
        endDate: "2024-05-10T23:00:00Z",
        status: "Scheduled",
        clicks: 0
    },
    {
        id: "4",
        eventId: "ev-004",
        priority: 4,
        thumbnailUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80",
        title: "ABC Tech Hiring Day Q2",
        organization: "Công ty TNHH ABC Tech",
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-02-28T23:59:59Z",
        status: "Expired",
        clicks: 3200
    }
];

export const FeaturedCardData: CardInfo[] = [
    { title: "Tổng featured", value: 4 },
    { title: "Đang hiển thị", value: 1, color: "text-green-500" },
    { title: "Lên lịch", value: 2, color: "text-blue-500" },
    { title: "Tổng lượt click", value: 5300, color: "text-purple-600" }
];
