export type ActionType =
    | 'LOGIN'
    | 'LOGOUT'
    | 'CREATE_EVENT'
    | 'JOIN_EVENT'
    | 'BUY_TICKET'
    | 'COIN_EARN'
    | 'COIN_SPEND'
    | 'PROFILE_UPDATE'
    | 'PASSWORD_CHANGE'
    | 'REPORT_SUBMIT'
    | 'DOCUMENT_UPLOAD'
    | 'SUSPEND_ATTEMPT';

export interface ActivityItem {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    action: ActionType;
    detail: string;
    ipAddress: string;
    device: string;
    status: 'SUCCESS' | 'FAILED' | 'SUSPICIOUS';
    createdAt: string;
}

export const MockActivities: ActivityItem[] = [
    {
        id: "act001",
        userId: "u-023",
        userName: "Nguyễn Văn An",
        userEmail: "an.nguyen@gmail.com",
        action: "LOGIN",
        detail: "Đăng nhập thành công qua Firebase",
        ipAddress: "118.70.45.23",
        device: "Chrome / Windows",
        status: "SUCCESS",
        createdAt: "2026-04-25T23:01:00Z"
    },
    {
        id: "act002",
        userId: "u-041",
        userName: "Trần Thị Bích",
        userEmail: "bich.tran@ftu.edu.vn",
        action: "DOCUMENT_UPLOAD",
        detail: "Nộp tài liệu BUSINESS_LICENSE (fileId: 342)",
        ipAddress: "203.162.55.88",
        device: "Safari / macOS",
        status: "SUCCESS",
        createdAt: "2026-04-25T22:45:00Z"
    },
    {
        id: "act003",
        userId: "u-099",
        userName: "Lê Hoàng Phúc",
        userEmail: "hoangphuc99@gmail.com",
        action: "LOGIN",
        detail: "Thử đăng nhập thất bại 5 lần liên tiếp",
        ipAddress: "14.241.188.105",
        device: "Firefox / Linux",
        status: "SUSPICIOUS",
        createdAt: "2026-04-25T22:30:00Z"
    },
    {
        id: "act004",
        userId: "u-055",
        userName: "Phạm Minh Tuấn",
        userEmail: "tuan.pm@uit.edu.vn",
        action: "CREATE_EVENT",
        detail: "Tạo sự kiện \"Tech Talk 2026\" (eventId: e-201)",
        ipAddress: "14.161.9.48",
        device: "Chrome / Windows",
        status: "SUCCESS",
        createdAt: "2026-04-25T21:15:00Z"
    },
    {
        id: "act005",
        userId: "u-072",
        userName: "Ngô Thanh Hà",
        userEmail: "ha.ngo@gmail.com",
        action: "BUY_TICKET",
        detail: "Mua vé sự kiện \"Spring Festival 2026\" — 150,000₫",
        ipAddress: "42.112.105.22",
        device: "Mobile / iOS",
        status: "SUCCESS",
        createdAt: "2026-04-25T20:50:00Z"
    },
    {
        id: "act006",
        userId: "u-088",
        userName: "Vũ Quốc Bảo",
        userEmail: "bao.vu@hust.edu.vn",
        action: "COIN_EARN",
        detail: "Nhận 100 coin từ đọc tin tức (newsId: n-55)",
        ipAddress: "113.160.44.71",
        device: "Chrome / Android",
        status: "SUCCESS",
        createdAt: "2026-04-25T20:12:00Z"
    },
    {
        id: "act007",
        userId: "u-033",
        userName: "Đinh Thùy Linh",
        userEmail: "linh.dinh@yahoo.com",
        action: "REPORT_SUBMIT",
        detail: "Báo cáo user u-099 (HARASSMENT)",
        ipAddress: "14.232.78.99",
        device: "Chrome / Windows",
        status: "SUCCESS",
        createdAt: "2026-04-25T19:45:00Z"
    },
    {
        id: "act008",
        userId: "u-099",
        userName: "Lê Hoàng Phúc",
        userEmail: "hoangphuc99@gmail.com",
        action: "SUSPEND_ATTEMPT",
        detail: "Tài khoản bị khóa sau khi vi phạm nhiều lần",
        ipAddress: "14.241.188.105",
        device: "Firefox / Linux",
        status: "FAILED",
        createdAt: "2026-04-25T19:00:00Z"
    },
    {
        id: "act009",
        userId: "u-023",
        userName: "Nguyễn Văn An",
        userEmail: "an.nguyen@gmail.com",
        action: "PROFILE_UPDATE",
        detail: "Cập nhật số điện thoại và ảnh đại diện",
        ipAddress: "118.70.45.23",
        device: "Chrome / Windows",
        status: "SUCCESS",
        createdAt: "2026-04-25T18:30:00Z"
    },
    {
        id: "act010",
        userId: "u-041",
        userName: "Trần Thị Bích",
        userEmail: "bich.tran@ftu.edu.vn",
        action: "JOIN_EVENT",
        detail: "Đăng ký tham gia sự kiện \"FTU English Camp\" (eventId: e-188)",
        ipAddress: "203.162.55.88",
        device: "Safari / macOS",
        status: "SUCCESS",
        createdAt: "2026-04-25T17:00:00Z"
    }
];
