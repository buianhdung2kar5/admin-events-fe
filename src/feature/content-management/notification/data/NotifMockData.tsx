import { CardInfo } from "../../../user-management/user/data/UserMockData";

export interface NotifItem {
    id: string;
    title: string;
    description: string;
    type: "Warning" | "Info" | "Success";
    target: "All" | "Student" | "Business";
    time: string;
    status: "Sent" | "Scheduled";
    readRate: number;
    readCount: string;
}

export const MockNotifs: NotifItem[] = [
    {
        id: "1",
        title: "Bảo trì hệ thống",
        description: "Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày 26/01/2025.",
        type: "Warning",
        target: "All",
        time: "10:00 25/1/25",
        status: "Sent",
        readRate: 87,
        readCount: "1089/1247"
    },
    {
        id: "2",
        title: "Tính năng mới: Portfolio",
        description: "S-Events đã ra mắt tính năng Portfolio cho sinh viên. Tạo ngay hồ sơ của bạn!",
        type: "Info",
        target: "Student",
        time: "09:00 20/1/25",
        status: "Sent",
        readRate: 83,
        readCount: "743/890"
    },
    {
        id: "3",
        title: "Nhắc nhở: Đăng ký sự kiện",
        description: "Bạn chưa đăng ký sự kiện nào trong tháng này. Khám phá ngay!",
        type: "Info",
        target: "Student", // Segment in image
        time: "14:00 18/1/25",
        status: "Sent",
        readRate: 67,
        readCount: "210/312"
    },
    {
        id: "4",
        title: "Xác minh tổ chức",
        description: "Tài khoản tổ chức của bạn đang chờ xét duyệt. Vui lòng cập nhật hình ảnh con dấu.",
        type: "Warning",
        target: "Business",
        time: "08:00 30/1/25",
        status: "Scheduled",
        readRate: 0,
        readCount: "—"
    },
    {
        id: "5",
        title: "Chào mừng năm học mới",
        description: "Chào mừng tất cả sinh viên quay lại năm học 2025! Hàng loạt sự kiện hấp dẫn đang chờ bạn.",
        type: "Success",
        target: "All",
        time: "08:00 10/1/25",
        status: "Sent",
        readRate: 92,
        readCount: "1100/1200"
    }
];

export const NotifCardData: CardInfo[] = [
    { title: "Tổng thông báo", value: 5 },
    { title: "Đã gửi", value: 4, color: "text-green-500" },
    { title: "Lên lịch", value: 1, color: "text-blue-500" },
    { title: "Tỉ lệ đọc TB", value: 82, color: "text-cyan-500" }
];

export const AudienceData = [
    { label: "Tất cả người dùng", count: "1,247", sub: "Sinh viên + Doanh nghiệp + Admin", color: "bg-blue-50 text-blue-500", icon: "Users" },
    { label: "Sinh viên", count: "890", sub: "Đã xác thực tài khoản", color: "bg-purple-50 text-purple-500", icon: "GraduationCap" },
    { label: "Doanh nghiệp / Tổ chức", count: "312", sub: "Tổ chức + Doanh nghiệp", color: "bg-orange-50 text-orange-500", icon: "Building2" }
];
