import React from 'react';
import { CheckCircle, Clock, XCircle, GraduationCap, Building2, ShieldCheck, UserCog } from "lucide-react";

// Chỉ bao gồm người dùng cá nhân (không phải doanh nghiệp/tổ chức — đã có quản lý riêng)
export type UserRole = "Member" | "Student";
export type UserRoleFilter = UserRole | "Organization" | "Business"; // dùng cho filter nếu cần
export type UserStatus = "Active" | "Pending" | "Blocked";
export type VerifyStatus = "Pending" | "Approved" | "Rejected";
export type UserRank = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";

export interface Portfolio {
    id: string;
    title: string;
    url: string;
    type: "github" | "behance" | "linkedin" | "website";
}

export interface EventHistory {
    id: string;
    eventName: string;
    role: "Participant" | "Organizer" | "Speaker" | "Volunteer";
    date: string;
    status: "Completed" | "Cancelled" | "Upcoming";
}

export interface VerifyDocument {
    id: string;
    type: "CCCD" | "StudentCard" | "BusinessLicense";
    label: string;
    fileUrl: string;
    uploadedAt: string;
    status: VerifyStatus;
}

export interface ActionLog {
    id: string;
    action: string;
    detail: string;
    timestamp: string;
    ip: string;
}

export interface CoinTransaction {
    id: string;
    type: "earn" | "spend" | "adjust";
    amount: number;
    description: string;
    date: string;
}

export interface UserItem {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    organization: string;
    eventCount: number;
    avatarUrl: string;
    joinedDate: string;
    // Detail fields
    rank: UserRank;
    coinBalance: number;
    bio: string;
    portfolios: Portfolio[];
    eventHistory: EventHistory[];
    verifyDocuments: VerifyDocument[];
    actionLogs: ActionLog[];
    coinHistory: CoinTransaction[];
}

export interface CardInfo {
    title: string;
    value: number;
    color?: string;
    icon?: any;
}

// ─── Mock Users ───────────────────────────────────────────────────
export const MockUsers: UserItem[] = [
    {
        id: "1",
        name: "Nguyễn Hải Anh",
        email: "nguyenhaianh@neu.edu.vn",
        phone: "0912 345 678",
        role: "Student",
        status: "Active",
        organization: "ĐH Kinh tế Quốc dân",
        eventCount: 12,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anh",
        joinedDate: "2024-01-15",
        rank: "Gold",
        coinBalance: 1250,
        bio: "Sinh viên năm 3 ngành Quản trị kinh doanh. Đam mê tổ chức sự kiện và kết nối cộng đồng.",
        portfolios: [
            { id: "p1", title: "LinkedIn", url: "https://linkedin.com/in/haianh", type: "linkedin" },
            { id: "p2", title: "GitHub", url: "https://github.com/haianh", type: "github" },
        ],
        eventHistory: [
            { id: "e1", eventName: "Vietnam Youth Forum 2024", role: "Organizer", date: "2024-03-10", status: "Completed" },
            { id: "e2", eventName: "Tech Summit HN 2024", role: "Participant", date: "2024-05-20", status: "Completed" },
            { id: "e3", eventName: "Lễ hội Ánh sáng 2026", role: "Volunteer", date: "2026-06-15", status: "Upcoming" },
        ],
        verifyDocuments: [
            { id: "d1", type: "StudentCard", label: "Thẻ sinh viên", fileUrl: "https://example.com/card.jpg", uploadedAt: "2024-01-16", status: "Approved" },
        ],
        actionLogs: [
            { id: "l1", action: "Đăng nhập", detail: "Đăng nhập thành công", timestamp: "2026-04-25T08:30:00", ip: "14.241.xxx.xxx" },
            { id: "l2", action: "Đăng ký sự kiện", detail: "Đăng ký Lễ hội Ánh sáng 2026", timestamp: "2026-04-24T14:00:00", ip: "14.241.xxx.xxx" },
            { id: "l3", action: "Nạp coin", detail: "Nạp 500 coin qua SePay", timestamp: "2026-04-20T10:15:00", ip: "14.241.xxx.xxx" },
        ],
        coinHistory: [
            { id: "c1", type: "earn", amount: 500, description: "Nạp SePay", date: "2026-04-20" },
            { id: "c2", type: "spend", amount: -200, description: "Mua vé Vietnam Youth Forum", date: "2026-03-05" },
            { id: "c3", type: "earn", amount: 100, description: "Thưởng hoàn thành hồ sơ", date: "2024-01-20" },
        ],
    },
    // id="4" — Student pending

    {
        id: "4",
        name: "Lê Văn Cường",
        email: "levcuong@ftu.edu.vn",
        phone: "0934 567 890",
        role: "Student",
        status: "Pending",
        organization: "ĐH Ngoại Thương",
        eventCount: 0,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong",
        joinedDate: "2024-04-01",
        rank: "Bronze",
        coinBalance: 0,
        bio: "Sinh viên năm nhất, mới đăng ký tài khoản, chưa hoàn thiện hồ sơ.",
        portfolios: [],
        eventHistory: [],
        verifyDocuments: [
            { id: "d4", type: "CCCD", label: "CCCD", fileUrl: "https://example.com/cccd.jpg", uploadedAt: "2024-04-01", status: "Pending" },
        ],
        actionLogs: [
            { id: "l8", action: "Đăng ký", detail: "Tạo tài khoản mới", timestamp: "2024-04-01T10:00:00", ip: "113.185.xxx.xxx" },
            { id: "l9", action: "Nộp tài liệu", detail: "Nộp CCCD để xác thực", timestamp: "2024-04-01T10:05:00", ip: "113.185.xxx.xxx" },
        ],
        coinHistory: [],
    },
    // id="5" — Admin bị khóa
    {
        id: "5",
        name: "Phạm Minh Đức",
        email: "minhd@admin.sevents.vn",
        phone: "0901 234 567",
        role: "Student",
        status: "Blocked",
        organization: "S-Events Administrator",
        eventCount: 0,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Duc",
        joinedDate: "2024-03-12",
        rank: "Diamond",
        coinBalance: 99999,
        bio: "Tài khoản admin hệ thống. Bị khóa tạm thời để điều tra.",
        portfolios: [],
        eventHistory: [],
        verifyDocuments: [],
        actionLogs: [
            { id: "l10", action: "Đăng nhập thất bại", detail: "Sai mật khẩu 5 lần liên tiếp", timestamp: "2026-04-20T03:00:00", ip: "Unknown" },
            { id: "l11", action: "Tài khoản bị khóa", detail: "Hệ thống tự động khóa tài khoản", timestamp: "2026-04-20T03:01:00", ip: "N/A" },
        ],
        coinHistory: [],
    },
    // id="6" — Student active
    {
        id: "6",
        name: "Hoàng Thị Mai Lan",
        email: "mailan@ueh.edu.vn",
        phone: "0978 123 456",
        role: "Student",
        status: "Active",
        organization: "ĐH Kinh tế TP.HCM",
        eventCount: 8,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MaiLan",
        joinedDate: "2024-06-01",
        rank: "Silver",
        coinBalance: 620,
        bio: "Sinh viên chuyên ngành Marketing, yêu thích tổ chức sự kiện văn hóa.",
        portfolios: [
            { id: "p6", title: "Behance", url: "https://behance.net/mailan", type: "behance" },
        ],
        eventHistory: [
            { id: "e9", eventName: "Music Fest UEH 2024", role: "Volunteer", date: "2024-11-01", status: "Completed" },
            { id: "e10", eventName: "Gala Trao giải Khởi nghiệp", role: "Participant", date: "2025-05-25", status: "Upcoming" },
        ],
        verifyDocuments: [
            { id: "d5", type: "StudentCard", label: "Thẻ sinh viên UEH", fileUrl: "https://example.com/ueh.jpg", uploadedAt: "2024-06-02", status: "Approved" },
        ],
        actionLogs: [
            { id: "l12", action: "Đăng nhập", detail: "Đăng nhập thành công", timestamp: "2026-04-24T20:00:00", ip: "118.70.xxx.xxx" },
        ],
        coinHistory: [
            { id: "c9", type: "earn", amount: 700, description: "Nạp SePay", date: "2026-02-14" },
            { id: "c10", type: "spend", amount: -80, description: "Mua vé Music Fest", date: "2024-10-15" },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────
export const getStatusIcon = (status: string) => {
    switch (status) {
        case "Active": return <CheckCircle size={14} className="text-green-500" />;
        case "Pending": return <Clock size={14} className="text-amber-500" />;
        case "Blocked": return <XCircle size={14} className="text-red-500" />;
        default: return null;
    }
};

export const getRoleDetails = (role: string) => {
    switch (role) {
        case "Admin":        return { label: "Quản trị viên", icon: <ShieldCheck size={14} />, color: "text-purple-600 bg-purple-50 border-purple-100" };
        case "Organization": return { label: "Tổ chức",       icon: <Building2 size={14} />,   color: "text-blue-600 bg-blue-50 border-blue-100" };
        case "Student":      return { label: "Sinh viên",     icon: <GraduationCap size={14} />,color: "text-gray-600 bg-white border-gray-200" };
        case "Business":     return { label: "Doanh nghiệp",  icon: <Building2 size={14} />,   color: "text-orange-600 bg-orange-50 border-orange-100" };
        default:             return { label: role,             icon: <UserCog size={14} />,      color: "text-gray-600 bg-gray-50 border-gray-100" };
    }
};

export const getRankStyle = (rank: UserRank) => {
    const map: Record<UserRank, { color: string; bg: string; label: string }> = {
        Bronze:   { color: "#92400E", bg: "#FEF3C7", label: "🥉 Bronze" },
        Silver:   { color: "#475569", bg: "#F1F5F9", label: "🥈 Silver" },
        Gold:     { color: "#92400E", bg: "#FEF9C3", label: "🥇 Gold" },
        Platinum: { color: "#0E7490", bg: "#ECFEFF", label: "💠 Platinum" },
        Diamond:  { color: "#6D28D9", bg: "#EDE9FE", label: "💎 Diamond" },
    };
    return map[rank] ?? { color: "#6B7280", bg: "#F9FAFB", label: rank };
};

// Card summary — chỉ tính người dùng cá nhân (Student + Admin + Member)
// Organization và Business được quản lý ở module Doanh nghiệp riêng
export const UserCardData: CardInfo[] = [
    { title: "Tổng số",    value: 4 },
    { title: "Sinh viên",  value: 3, color: "text-blue-600" },
    { title: "Admin",      value: 1, color: "text-sky-500" },
    { title: "Hoạt động",  value: 3, color: "text-green-500" },
    { title: "Chờ duyệt",  value: 1, color: "text-amber-500" },
    { title: "Bị khóa",    value: 1, color: "text-red-500" },
];