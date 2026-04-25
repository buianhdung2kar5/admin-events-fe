import { CardInfo } from "../../../user-management/user/data/UserMockData";

export type EventStatus = "DRAFT" | "PUBLISHED" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface Demographics {
    gender: { male: number; female: number; other: number };
    age: { "18-20": number; "21-23": number; "24+": number };
    major: { it: number; economics: number; marketing: number; other: number };
}

export interface EventStatistics {
    totalRegistered: number;
    totalCheckedIn: number;
    totalCheckedOut: number;
    totalAttendees: number;
    totalCtv: number;
    totalTicketsSold: number;
    totalFeedbacks: number;
}

export interface EventAnalytics {
    demographics: Demographics;
    checkInTimeline: { time: string; count: number }[];
}

export interface EventCategoryOption {
    id: string;
    name: string;
}

export interface EventItem {
    id: string;
    title: string;
    bannerUrl: string;
    description: string;
    venue: string;
    price: number;
    categories: EventCategoryOption[];
    capacity: number;
    rewardCoin: number;
    youthUnionPoint: number;
    certificateName: string;
    recruitmentType: "CTV" | "Volunteer" | "None";
    registerOpenTime: string;
    startTime: string;
    endTime: string;
    status: EventStatus;
    organization: string;
    statistics: EventStatistics;
    analytics: EventAnalytics;
}

export const MockCategories: EventCategoryOption[] = [
    { id: "cat1", name: "Hội thảo học thuật" },
    { id: "cat2", name: "Công nghệ - IT" },
    { id: "cat3", name: "Khởi nghiệp" },
    { id: "cat4", name: "Giải trí - Âm nhạc" },
    { id: "cat5", name: "Tuyển dụng" }
];

export const MockEvents: EventItem[] = [
    {
        id: "ev-001",
        title: "NEU Business Summit 2024: Kỷ nguyên AI",
        bannerUrl: "https://picsum.photos/800/400?random=101",
        description: "Hội thảo kinh tế thường niên lớn nhất NEU với chủ đề chuyển đổi số và AI trong doanh nghiệp.",
        venue: "Hội trường A2, ĐH Kinh tế Quốc dân",
        price: 0,
        categories: [MockCategories[0], MockCategories[2]],
        capacity: 1000,
        rewardCoin: 50,
        youthUnionPoint: 5,
        certificateName: "Chứng nhận tham gia NEU Summit",
        recruitmentType: "CTV",
        registerOpenTime: "2024-03-01T00:00:00Z",
        startTime: "2024-04-15T08:00:00Z",
        endTime: "2024-04-15T17:00:00Z",
        status: "COMPLETED",
        organization: "ĐH Kinh tế Quốc dân",
        statistics: {
            totalRegistered: 1200,
            totalCheckedIn: 850,
            totalCheckedOut: 800,
            totalAttendees: 850,
            totalCtv: 50,
            totalTicketsSold: 1200,
            totalFeedbacks: 650
        },
        analytics: {
            demographics: {
                gender: { male: 40, female: 55, other: 5 },
                age: { "18-20": 60, "21-23": 30, "24+": 10 },
                major: { it: 15, economics: 60, marketing: 20, other: 5 }
            },
            checkInTimeline: [
                { time: "07:30", count: 100 },
                { time: "08:00", count: 500 },
                { time: "08:30", count: 250 }
            ]
        }
    },
    {
        id: "ev-002",
        title: "TechDay BK 2024 - Hackathon",
        bannerUrl: "https://picsum.photos/800/400?random=102",
        description: "Cuộc thi Hackathon 48 giờ dành cho sinh viên đam mê công nghệ tại ĐHBK Hà Nội.",
        venue: "Thư viện Tạ Quang Bửu, ĐHBK Hà Nội",
        price: 50000,
        categories: [MockCategories[1]],
        capacity: 300,
        rewardCoin: 200,
        youthUnionPoint: 10,
        certificateName: "Giấy chứng nhận Hackathon BK",
        recruitmentType: "None",
        registerOpenTime: "2024-03-10T00:00:00Z",
        startTime: "2024-04-20T08:00:00Z",
        endTime: "2024-04-22T17:00:00Z",
        status: "UPCOMING",
        organization: "CLB Công nghệ BK",
        statistics: {
            totalRegistered: 280,
            totalCheckedIn: 0,
            totalCheckedOut: 0,
            totalAttendees: 0,
            totalCtv: 20,
            totalTicketsSold: 280,
            totalFeedbacks: 0
        },
        analytics: {
            demographics: {
                gender: { male: 80, female: 18, other: 2 },
                age: { "18-20": 40, "21-23": 50, "24+": 10 },
                major: { it: 90, economics: 2, marketing: 0, other: 8 }
            },
            checkInTimeline: []
        }
    },
    {
        id: "ev-003",
        title: "Music Festival: Đêm Hội Ngoại Thương",
        bannerUrl: "https://picsum.photos/800/400?random=103",
        description: "Sự kiện âm nhạc thường niên chào tân sinh viên ĐH Ngoại Thương với các ca sĩ khách mời.",
        venue: "Sân nhà G, ĐH Ngoại Thương",
        price: 150000,
        categories: [MockCategories[3]],
        capacity: 3000,
        rewardCoin: 0,
        youthUnionPoint: 0,
        certificateName: "",
        recruitmentType: "Volunteer",
        registerOpenTime: "2024-04-01T00:00:00Z",
        startTime: "2024-05-10T19:00:00Z",
        endTime: "2024-05-10T23:00:00Z",
        status: "PUBLISHED",
        organization: "Hội SV Ngoại Thương",
        statistics: {
            totalRegistered: 1500,
            totalCheckedIn: 0,
            totalCheckedOut: 0,
            totalAttendees: 0,
            totalCtv: 100,
            totalTicketsSold: 1500,
            totalFeedbacks: 0
        },
        analytics: {
            demographics: {
                gender: { male: 30, female: 65, other: 5 },
                age: { "18-20": 80, "21-23": 18, "24+": 2 },
                major: { it: 5, economics: 70, marketing: 15, other: 10 }
            },
            checkInTimeline: []
        }
    },
    {
        id: "ev-004",
        title: "ABC Tech Hiring Day Q2",
        bannerUrl: "https://picsum.photos/800/400?random=104",
        description: "Ngày hội tuyển dụng trực tiếp của Công ty ABC Tech dành cho sinh viên năm cuối.",
        venue: "Tòa nhà ABC Tech, Cầu Giấy",
        price: 0,
        categories: [MockCategories[1], MockCategories[4]],
        capacity: 500,
        rewardCoin: 100,
        youthUnionPoint: 0,
        certificateName: "",
        recruitmentType: "None",
        registerOpenTime: "2024-04-10T00:00:00Z",
        startTime: "2024-05-15T08:30:00Z",
        endTime: "2024-05-15T12:00:00Z",
        status: "DRAFT",
        organization: "Công ty TNHH ABC Tech",
        statistics: {
            totalRegistered: 50,
            totalCheckedIn: 0,
            totalCheckedOut: 0,
            totalAttendees: 0,
            totalCtv: 0,
            totalTicketsSold: 50,
            totalFeedbacks: 0
        },
        analytics: {
            demographics: {
                gender: { male: 60, female: 40, other: 0 },
                age: { "18-20": 5, "21-23": 90, "24+": 5 },
                major: { it: 80, economics: 10, marketing: 5, other: 5 }
            },
            checkInTimeline: []
        }
    }
];

export const EventCardData: CardInfo[] = [
    { title: "Tổng sự kiện", value: 156 },
    { title: "Đang diễn ra", value: 12, color: "text-blue-500" },
    { title: "Sắp diễn ra", value: 45, color: "text-purple-500" },
    { title: "Đã xuất bản", value: 98, color: "text-green-500" },
    { title: "Lưu nháp", value: 24, color: "text-amber-500" },
    { title: "Lượt đăng ký", value: 24500, color: "text-[#0092B8]" }
];

export const getEventStatusStyles = (status: EventStatus) => {
    switch (status) {
        case "DRAFT": return { label: "Lưu nháp", color: "bg-gray-100 text-gray-600 border-gray-200" };
        case "PUBLISHED": return { label: "Đã xuất bản", color: "bg-green-50 text-green-600 border-green-200" };
        case "UPCOMING": return { label: "Sắp diễn ra", color: "bg-purple-50 text-purple-600 border-purple-200" };
        case "ONGOING": return { label: "Đang diễn ra", color: "bg-blue-50 text-blue-600 border-blue-200" };
        case "COMPLETED": return { label: "Đã kết thúc", color: "bg-teal-50 text-teal-600 border-teal-200" };
        case "CANCELLED": return { label: "Đã hủy", color: "bg-red-50 text-red-600 border-red-200" };
        default: return { label: status, color: "bg-gray-50 text-gray-600" };
    }
};
