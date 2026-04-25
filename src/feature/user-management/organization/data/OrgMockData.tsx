import { CardInfo } from '../../user/data/UserMockData';

// ─── API stubs (comment khi chưa có backend) ───────────────────────
// GET  /api/organizations          → fetchOrganizations()
// GET  /api/organizations/{id}     → fetchOrganizationById(id)
// GET  /api/organizations/me/dashboard → fetchOrgDashboard(id)
// ──────────────────────────────────────────────────────────────────

export type OrgType = "University" | "Club" | "Business" | "NonProfit";
export type OrgStatus = "Active" | "Blocked";
export type VerificationStatus = "Verified" | "Unverified" | "Pending";

export interface OrgDashboard {
    totalEvents: number;
    totalRegistrations: number;
    totalViews: number;
    averageAttendanceRate: number;
}

export interface OrgEvent {
    id: string;
    name: string;
    date: string;
    registrations: number;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface OrgActionLog {
    id: string;
    action: string;
    performedBy: string;
    timestamp: string;
}

export interface OrganizationItem {
    id: string;
    logoUrl: string;
    name: string;
    email: string;
    phone: string;
    website: string;
    isVerified: boolean;
    type: OrgType;
    unit: string;
    description: string;
    eventCount: number;
    memberCount: number;
    status: OrgStatus;
    verificationStatus: VerificationStatus;
    createdDate: string;
    dashboard: OrgDashboard;
    events: OrgEvent[];
    logs: OrgActionLog[];
}

export const MockOrganizations: OrganizationItem[] = [
    {
        id: "org-001",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=NEU&backgroundColor=0092B8",
        name: "ĐH Kinh tế Quốc dân",
        email: "events@neu.edu.vn",
        phone: "024 3869 1805",
        website: "https://neu.edu.vn",
        isVerified: true,
        type: "University",
        unit: "Đại học Kinh tế Quốc dân",
        description: "Trường đại học hàng đầu Việt Nam về đào tạo kinh tế và quản trị kinh doanh.",
        eventCount: 32,
        memberCount: 480,
        status: "Active",
        verificationStatus: "Verified",
        createdDate: "2023-05-10",
        dashboard: { totalEvents: 32, totalRegistrations: 12400, totalViews: 58000, averageAttendanceRate: 87 },
        events: [
            { id: "e1", name: "NEU Business Summit 2024", date: "2024-04-15", registrations: 850, status: "completed" },
            { id: "e2", name: "Career Fair NEU 2024", date: "2024-05-20", registrations: 1200, status: "upcoming" },
            { id: "e3", name: "Hackathon Finance 2024", date: "2024-03-10", registrations: 320, status: "completed" },
        ],
        logs: [
            { id: "l1", action: "Đã được duyệt xác thực", performedBy: "Admin Hệ thống", timestamp: "2023-06-01T09:00:00Z" },
            { id: "l2", action: "Cập nhật thông tin tổ chức", performedBy: "Nguyễn Hải Anh", timestamp: "2024-01-15T14:30:00Z" },
        ]
    },
    {
        id: "org-002",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=BK&backgroundColor=3b82f6",
        name: "CLB Công nghệ BK",
        email: "techclub@bk.edu.vn",
        phone: "024 3623 8282",
        website: "https://techclub.bk.edu.vn",
        isVerified: true,
        type: "Club",
        unit: "ĐHBK Hà Nội",
        description: "Câu lạc bộ công nghệ lớn nhất Đại học Bách Khoa Hà Nội, nơi kết nối các sinh viên đam mê CNTT.",
        eventCount: 24,
        memberCount: 156,
        status: "Active",
        verificationStatus: "Verified",
        createdDate: "2023-08-22",
        dashboard: { totalEvents: 24, totalRegistrations: 5600, totalViews: 22000, averageAttendanceRate: 78 },
        events: [
            { id: "e4", name: "TechDay BK 2024", date: "2024-04-20", registrations: 500, status: "upcoming" },
            { id: "e5", name: "Workshop AI cơ bản", date: "2024-02-14", registrations: 180, status: "completed" },
        ],
        logs: [
            { id: "l3", action: "Đã được duyệt xác thực", performedBy: "Admin Hệ thống", timestamp: "2023-09-05T10:00:00Z" },
        ]
    },
    {
        id: "org-003",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=FTU&backgroundColor=8b5cf6",
        name: "Hội SV Ngoại Thương",
        email: "hoisv@ftu.edu.vn",
        phone: "024 3832 7904",
        website: "https://hoisv.ftu.edu.vn",
        isVerified: true,
        type: "Club",
        unit: "ĐH Ngoại Thương",
        description: "Hội sinh viên ĐH Ngoại Thương, tổ chức các hoạt động học thuật và giao lưu quốc tế.",
        eventCount: 18,
        memberCount: 220,
        status: "Active",
        verificationStatus: "Verified",
        createdDate: "2023-07-01",
        dashboard: { totalEvents: 18, totalRegistrations: 3800, totalViews: 14500, averageAttendanceRate: 82 },
        events: [
            { id: "e6", name: "FTU Trade Summit 2024", date: "2024-05-10", registrations: 300, status: "upcoming" },
        ],
        logs: [
            { id: "l4", action: "Đã được duyệt xác thực", performedBy: "Admin Hệ thống", timestamp: "2023-07-20T08:00:00Z" },
        ]
    },
    {
        id: "org-004",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=NEU-E&backgroundColor=f59e0b",
        name: "CLB Entrepreneur NEU",
        email: "entrepreneur@neu.edu.vn",
        phone: "090 1234 567",
        website: "",
        isVerified: false,
        type: "Club",
        unit: "ĐH Kinh tế Quốc dân",
        description: "Câu lạc bộ khởi nghiệp và kinh doanh cho sinh viên NEU.",
        eventCount: 11,
        memberCount: 89,
        status: "Active",
        verificationStatus: "Pending",
        createdDate: "2024-01-15",
        dashboard: { totalEvents: 11, totalRegistrations: 1200, totalViews: 5200, averageAttendanceRate: 71 },
        events: [
            { id: "e7", name: "Startup Weekend NEU", date: "2024-04-28", registrations: 120, status: "upcoming" },
        ],
        logs: [
            { id: "l5", action: "Gửi hồ sơ xác thực", performedBy: "Phạm Minh Hùng", timestamp: "2024-02-01T11:00:00Z" },
        ]
    },
    {
        id: "org-005",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=ABC&backgroundColor=10b981",
        name: "Công ty TNHH ABC Tech",
        email: "hr@abctech.vn",
        phone: "028 3820 5555",
        website: "https://abctech.vn",
        isVerified: true,
        type: "Business",
        unit: "Doanh nghiệp",
        description: "Công ty công nghệ chuyên tổ chức các sự kiện tuyển dụng và đào tạo nhân lực CNTT.",
        eventCount: 5,
        memberCount: 12,
        status: "Active",
        verificationStatus: "Verified",
        createdDate: "2023-11-01",
        dashboard: { totalEvents: 5, totalRegistrations: 950, totalViews: 4800, averageAttendanceRate: 91 },
        events: [
            { id: "e8", name: "ABC Tech Hiring Day Q2", date: "2024-05-15", registrations: 200, status: "upcoming" },
        ],
        logs: [
            { id: "l6", action: "Đã được duyệt xác thực", performedBy: "Admin Hệ thống", timestamp: "2023-11-20T09:30:00Z" },
        ]
    },
    {
        id: "org-006",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=ULIS&backgroundColor=ef4444",
        name: "CLB Nghệ thuật ULIS",
        email: "artsclub@ulis.edu.vn",
        phone: "024 3754 7989",
        website: "",
        isVerified: false,
        type: "Club",
        unit: "ĐH Ngoại ngữ - ĐHQGHN",
        description: "Câu lạc bộ nghệ thuật của Đại học Ngoại ngữ, thúc đẩy hoạt động văn hóa và nghệ thuật.",
        eventCount: 8,
        memberCount: 134,
        status: "Blocked",
        verificationStatus: "Unverified",
        createdDate: "2023-09-10",
        dashboard: { totalEvents: 8, totalRegistrations: 620, totalViews: 2100, averageAttendanceRate: 55 },
        events: [],
        logs: [
            { id: "l7", action: "Tài khoản bị khóa do vi phạm điều khoản", performedBy: "Admin Hệ thống", timestamp: "2024-01-10T16:00:00Z" },
        ]
    }
];

export const OrgCardData: CardInfo[] = [
    { title: "Tổng tổ chức", value: 6 },
    { title: "Đã xác thực", value: 4, color: "text-green-500" },
    { title: "Đang hoạt động", value: 5, color: "text-blue-500" },
    { title: "Tổng sự kiện", value: 98, color: "text-purple-600" }
];

export const getOrgTypeStyles = (type: string) => {
    switch (type) {
        case "University": return { label: "Trường ĐH", color: "bg-blue-50 text-blue-600 border-blue-100" };
        case "Club":       return { label: "CLB / Hội SV", color: "bg-purple-50 text-purple-600 border-purple-100" };
        case "Business":   return { label: "Doanh nghiệp", color: "bg-orange-50 text-orange-600 border-orange-100" };
        case "NonProfit":  return { label: "Phi lợi nhuận", color: "bg-green-50 text-green-600 border-green-100" };
        default:           return { label: type, color: "bg-gray-50 text-gray-600 border-gray-100" };
    }
};

export const getVerificationStyles = (status: VerificationStatus) => {
    switch (status) {
        case "Verified":   return { label: "Đã xác thực", color: "bg-cyan-50 text-cyan-600" };
        case "Pending":    return { label: "Chờ duyệt",   color: "bg-amber-50 text-amber-600" };
        case "Unverified": return { label: "Chưa xác thực", color: "bg-gray-50 text-gray-400" };
        default:           return { label: status, color: "bg-gray-50 text-gray-400" };
    }
};
