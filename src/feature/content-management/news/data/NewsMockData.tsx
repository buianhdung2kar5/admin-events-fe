import { CardInfo } from "../../../user-management/user/data/UserMockData";

export interface NewsItem {
    id: string;
    thumbnailUrl: string;
    title: string;
    description: string;
    category: string;
    author: string;
    date: string;
    status: "Published" | "Pending";
    views: number;
    isFeatured?: boolean;
}

export const MockNews: NewsItem[] = [
    {
        id: "1",
        thumbnailUrl: "https://images.unsplash.com/photo-1591115765373-520b7a42616f?w=400&q=80",
        title: "Sự kiện Công nghệ AI 2025 thu hút hàng nghìn sinh viên",
        description: "Hội thảo về trí tuệ nhân tạo đã diễn ra thành công với sự góp mặt của các chuyên gia hàng đầu.",
        category: "Tin tức",
        author: "Nguyễn Văn A",
        date: "15/10/2025",
        status: "Published",
        views: 489,
        isFeatured: true
    },
    {
        id: "2",
        thumbnailUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80",
        title: "Đêm nhạc Acoustic đã để lại nhiều ấn tượng đẹp",
        description: "Không khí ấm áp và những giai điệu du dương đã mang đến một buổi tối đáng nhớ.",
        category: "Tin tức",
        author: "Trần Thị B",
        date: "18/10/2025",
        status: "Pending",
        views: 391
    },
    {
        id: "3",
        thumbnailUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
        title: "Workshop Nhiếp ảnh: Cơ hội học hỏi từ các chuyên gia",
        description: "Học viên đã được thực hành và nhận phản hồi trực tiếp từ những nhiếp ảnh gia nổi tiếng.",
        category: "Tin tức",
        author: "Lê Văn C",
        date: "20/10/2025",
        status: "Published",
        views: 683
    }
];

export const NewsCardData: CardInfo[] = [
    { title: "Tổng tin tức", value: 3 },
    { title: "Đã đăng", value: 2, color: "text-green-500" },
    { title: "Chờ duyệt", value: 1, color: "text-amber-500" },
    { title: "Tổng lượt xem", value: 1563, color: "text-blue-500" }
];
