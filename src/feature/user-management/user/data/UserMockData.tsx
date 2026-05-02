import React from 'react';
import { CheckCircle, Clock, XCircle, GraduationCap, Building2, ShieldCheck, UserCog } from "lucide-react";

// Các loại tài khoản chính
export type UserRole = "USER" | "ORGANIZATION" | "ADMIN" | string;
export type UserRoleFilter = UserRole | string;
export type UserStatus = "ACTIVE" | "PENDING" | "DISABLED";
export type VerifyStatus = "PENDING" | "APPROVED" | "REJECTED";
export type UserRank = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

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
    email?: string;
    phone?: string;
    role?: UserRole;
    status?: UserStatus;
    organization?: string;
    avatarUrl?: string;
    joinedDate?: string;
    // Detail fields
    rank?: UserRank;
    coinBalance?: number;
    bio?: string;
    portfolios?: Portfolio[];
    eventHistory: EventHistory[];
    verifyDocuments: VerifyDocument[];
    actionLogs: ActionLog[];
    coinHistory: CoinTransaction[];
}

export interface ListUserInterface {
    userId: string;
    fullName: string;
    role: UserRole;
    status: UserStatus;
    avatarUrl?: string;
    createdTime?: string;
}

export interface CardInfo {
    title: string;
    value: number;
    color?: string;
    icon?: any;
}

export const getRoleDetails = (role: string) => {
    switch (role) {
        case "ADMIN":        return { label: "Quản trị viên", icon: <ShieldCheck size={14} />, color: "text-purple-600 bg-purple-50 border-purple-100" };
        case "ORGANIZATION": return { label: "Tổ chức",       icon: <Building2 size={14} />,   color: "text-blue-600 bg-blue-50 border-blue-100" };
        case "USER":         return { label: "Người dùng",    icon: <UserCog size={14} />,     color: "text-gray-600 bg-white border-gray-200" };
        default:             return { label: role || "Người dùng", icon: <UserCog size={14} />, color: "text-gray-600 bg-gray-50 border-gray-100" };
    }
};      
export const UserCardData: CardInfo[] = [
    { title: "Tổng số",    value: 4 },
    { title: "Sinh viên",  value: 3, color: "text-blue-600" },
    { title: "Admin",      value: 1, color: "text-sky-500" },
    { title: "Hoạt động",  value: 3, color: "text-green-500" },
    { title: "Chờ duyệt",  value: 1, color: "text-amber-500" },
    { title: "Bị khóa",    value: 1, color: "text-red-500" },
];