import { CardInfo } from "../../../user-management/user/data/UserMockData";

export interface PostItem {
    id: string;
    thumbnailUrl: string;
    title: string;
    description: string;
    type: "Event" | "Job" | "News";
    authorType: "Business" | "Student";
    authorName: string;
    authorOrg: string;
    date: string;
    status: "Approved" | "Pending" | "Rejected";
}

export const MockPosts: PostItem[] = [
    {
        id: "1",
        thumbnailUrl: "https://images.unsplash.com/photo-1540575861501-7ce0e224271a?w=400&q=80",
        title: "NEU Career Fair 2025",
        description: "Ngày hội việc làm lớn nhất năm với hơn 50 doanh nghiệp tham gia.",
        type: "Event",
        authorType: "Business",
        authorName: "Đại học Kinh tế Quốc dân",
        authorOrg: "Phòng CTCT & HSSV",
        date: "8/12/2025",
        status: "Approved"
    },
    {
        id: "2",
        thumbnailUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80",
        title: "Marathon Sinh viên Hà Nội",
        description: "Giải chạy marathon dành cho sinh viên với các cự ly 5km, 10km.",
        type: "Event",
        authorType: "Business",
        authorName: "Hội Sinh viên TP Hà Nội",
        authorOrg: "Thành đoàn Hà Nội",
        date: "10/12/2025",
        status: "Approved"
    },
    {
        id: "3",
        thumbnailUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
        title: "Cuộc thi Lập trình thuật toán liên trường 2026",
        description: "CLB Tin học Đại học Khoa học Tự nhiên phối hợp tổ chức.",
        type: "Event",
        authorType: "Student",
        authorName: "Trần Thị Lan (SV)",
        authorOrg: "CLB IT HUS",
        date: "22/4/2026",
        status: "Pending"
    },
    {
        id: "4",
        thumbnailUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80",
        title: "Kinh nghiệm thực tập tại công ty công nghệ lớn",
        description: "Chia sẻ hành trình thực tập 3 tháng tại một tập đoàn công nghệ lớn.",
        type: "News",
        authorType: "Student",
        authorName: "Phạm Văn Hùng (SV)",
        authorOrg: "ĐH Bách Khoa",
        date: "20/3/2026",
        status: "Pending"
    },
    {
        id: "5",
        thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
        title: "5 kỹ năng mềm sinh viên cần trau dồi trước khi ra trường",
        description: "Tổng hợp các kỹ năng mềm quan trọng nhất giúp sinh viên thành công.",
        type: "News",
        authorType: "Student",
        authorName: "Lê Thị Hoa (SV)",
        authorOrg: "ĐH Ngoại Thương",
        date: "25/3/2026",
        status: "Rejected"
    }
];

export const PostCardData: CardInfo[] = [
    { title: "Tổng số", value: 30 },
    { title: "Sự kiện", value: 19, color: "text-blue-500" },
    { title: "Việc làm", value: 6, color: "text-purple-600" },
    { title: "Tin tức", value: 5, color: "text-green-500" },
    { title: "Đã duyệt", value: 26, color: "text-green-500" },
    { title: "Chờ duyệt", value: 3, color: "text-amber-500" },
    { title: "Từ chối", value: 1, color: "text-red-500" },
    { title: "SV chờ duyệt", value: 3, color: "text-orange-600" } // Highlighted in image
];
