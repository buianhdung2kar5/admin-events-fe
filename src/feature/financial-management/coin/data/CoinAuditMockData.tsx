export type CoinReferenceType =
    | 'ADMIN_ADJUST'
    | 'NEWS_READ'
    | 'EVENT_ATTEND'
    | 'TICKET_REFUND'
    | 'PURCHASE';

export interface CoinAuditItem {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;           // dương = cộng, âm = trừ
    balanceBefore: number;
    balanceAfter: number;
    referenceType: CoinReferenceType;
    reason: string;
    adminName?: string;       // chỉ có khi ADMIN_ADJUST
    createdAt: string;
}

export const MockCoinAudit: CoinAuditItem[] = [
    {
        id: "ca001",
        userId: "u-023",
        userName: "Nguyễn Văn An",
        userEmail: "an.nguyen@gmail.com",
        amount: 5000,
        balanceBefore: 2300,
        balanceAfter: 7300,
        referenceType: "ADMIN_ADJUST",
        reason: "Thưởng tham gia sự kiện Spring Festival 2026",
        adminName: "admin@sevents.vn",
        createdAt: "2026-04-25T10:00:00Z"
    },
    {
        id: "ca002",
        userId: "u-099",
        userName: "Lê Hoàng Phúc",
        userEmail: "hoangphuc99@gmail.com",
        amount: -2000,
        balanceBefore: 8500,
        balanceAfter: 6500,
        referenceType: "ADMIN_ADJUST",
        reason: "Khấu trừ coin nhận được do gian lận khuyến mãi",
        adminName: "admin@sevents.vn",
        createdAt: "2026-04-24T15:30:00Z"
    },
    {
        id: "ca003",
        userId: "u-055",
        userName: "Phạm Minh Tuấn",
        userEmail: "tuan.pm@uit.edu.vn",
        amount: 10000,
        balanceBefore: 500,
        balanceAfter: 10500,
        referenceType: "ADMIN_ADJUST",
        reason: "Bồi thường lỗi thanh toán ngày 2026-04-20",
        adminName: "admin@sevents.vn",
        createdAt: "2026-04-23T09:15:00Z"
    },
    {
        id: "ca004",
        userId: "u-041",
        userName: "Trần Thị Bích",
        userEmail: "bich.tran@ftu.edu.vn",
        amount: 100,
        balanceBefore: 1200,
        balanceAfter: 1300,
        referenceType: "NEWS_READ",
        reason: "Đọc tin tức: Công bố kết quả cuộc thi",
        createdAt: "2026-04-25T14:00:00Z"
    },
    {
        id: "ca005",
        userId: "u-088",
        userName: "Vũ Quốc Bảo",
        userEmail: "bao.vu@hust.edu.vn",
        amount: 500,
        balanceBefore: 3000,
        balanceAfter: 3500,
        referenceType: "EVENT_ATTEND",
        reason: "Tham gia sự kiện \"HUST Tech Day 2026\"",
        createdAt: "2026-04-22T16:45:00Z"
    },
    {
        id: "ca006",
        userId: "u-072",
        userName: "Ngô Thanh Hà",
        userEmail: "ha.ngo@gmail.com",
        amount: 150000,
        balanceBefore: 0,
        balanceAfter: 150000,
        referenceType: "TICKET_REFUND",
        reason: "Hoàn tiền vé sự kiện bị hủy: Spring Festival 2026",
        createdAt: "2026-04-21T11:00:00Z"
    },
    {
        id: "ca007",
        userId: "u-033",
        userName: "Đinh Thùy Linh",
        userEmail: "linh.dinh@yahoo.com",
        amount: -1000,
        balanceBefore: 4200,
        balanceAfter: 3200,
        referenceType: "ADMIN_ADJUST",
        reason: "Điều chỉnh lỗi cộng thừa ngày 2026-04-15",
        adminName: "admin@sevents.vn",
        createdAt: "2026-04-20T08:30:00Z"
    },
    {
        id: "ca008",
        userId: "u-023",
        userName: "Nguyễn Văn An",
        userEmail: "an.nguyen@gmail.com",
        amount: -50000,
        balanceBefore: 7300,
        balanceAfter: 7250,
        referenceType: "PURCHASE",
        reason: "Mua gói Basic 30 ngày",
        createdAt: "2026-04-19T09:00:00Z"
    }
];
