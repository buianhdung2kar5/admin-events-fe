export interface PackageItem {
    id: string;
    name: string;
    description: string;
    price: number;
    durationDays: number;
    isActive: boolean;
    soldCount: number;
    revenue: number;
}

export interface UserPackageItem {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    packageName: string;
    purchasedAt: string;
    expiresAt: string;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

export const MockPackages: PackageItem[] = [
    {
        id: "pkg001",
        name: "Basic 30 ngày",
        description: "Gói cơ bản cho tổ chức mới, tổ chức tối đa 3 sự kiện",
        price: 299000,
        durationDays: 30,
        isActive: true,
        soldCount: 214,
        revenue: 63986000
    },
    {
        id: "pkg002",
        name: "Premium 90 ngày",
        description: "Gói phổ biến — tổ chức tối đa 10 sự kiện, ưu tiên hiển thị",
        price: 799000,
        durationDays: 90,
        isActive: true,
        soldCount: 521,
        revenue: 416279000
    },
    {
        id: "pkg003",
        name: "Enterprise 365 ngày",
        description: "Không giới hạn sự kiện, hỗ trợ ưu tiên 24/7, badge xác nhận",
        price: 2499000,
        durationDays: 365,
        isActive: true,
        soldCount: 88,
        revenue: 219912000
    },
    {
        id: "pkg004",
        name: "Student Club 60 ngày",
        description: "Dành riêng cho CLB sinh viên — giảm 50%, tổ chức tối đa 5 sự kiện",
        price: 149000,
        durationDays: 60,
        isActive: true,
        soldCount: 342,
        revenue: 50958000
    },
    {
        id: "pkg005",
        name: "Trial 7 ngày",
        description: "Dùng thử 7 ngày miễn phí, tổ chức 1 sự kiện",
        price: 0,
        durationDays: 7,
        isActive: false,
        soldCount: 1204,
        revenue: 0
    }
];

export const MockUserPackages: UserPackageItem[] = [
    {
        id: "up001",
        userId: "u-023",
        userName: "CLB IT UIT",
        userEmail: "cluuit@edu.vn",
        packageName: "Premium 90 ngày",
        purchasedAt: "2026-02-15T09:00:00Z",
        expiresAt: "2026-05-15T09:00:00Z",
        status: "ACTIVE"
    },
    {
        id: "up002",
        userId: "u-041",
        userName: "Startup Hub HCM",
        userEmail: "contact@startuphhcm.vn",
        packageName: "Enterprise 365 ngày",
        purchasedAt: "2026-01-01T08:00:00Z",
        expiresAt: "2027-01-01T08:00:00Z",
        status: "ACTIVE"
    },
    {
        id: "up003",
        userId: "u-055",
        userName: "CLB Tiếng Anh FTU",
        userEmail: "english.ftu@edu.vn",
        packageName: "Student Club 60 ngày",
        purchasedAt: "2026-02-01T10:00:00Z",
        expiresAt: "2026-04-01T10:00:00Z",
        status: "EXPIRED"
    },
    {
        id: "up004",
        userId: "u-072",
        userName: "Tech Events VN",
        userEmail: "hello@techevents.vn",
        packageName: "Basic 30 ngày",
        purchasedAt: "2026-04-01T08:00:00Z",
        expiresAt: "2026-05-01T08:00:00Z",
        status: "ACTIVE"
    },
    {
        id: "up005",
        userId: "u-088",
        userName: "Music Club HUST",
        userEmail: "music@hust.edu.vn",
        packageName: "Student Club 60 ngày",
        purchasedAt: "2026-03-10T11:00:00Z",
        expiresAt: "2026-05-10T11:00:00Z",
        status: "ACTIVE"
    }
];

export const PackageCardData = [
    { title: "Tổng gói", value: 5 },
    { title: "Đang bán", value: 4, color: "text-green-500" },
    { title: "Đã bán", value: "2,369", color: "text-[#0092B8]" },
    { title: "Doanh thu", value: "751tr₫", color: "text-amber-500" },
];
