import React from 'react';
import { CheckCircle, Clock, XCircle, GraduationCap, Building2, ShieldCheck, UserCog } from "lucide-react";

export interface UserItem {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Member" | "Organization" | "Student" | "Business";
    status: "Active" | "Pending" | "Blocked";
    organization: string;
    eventCount: number;
    avatarUrl: string;
    joinedDate: string;
}

export interface CardInfo {
    title: string,
    value: number,
    color?: string
}

export const MockUsers: UserItem[] = [
    {
        id: "1",
        name: "Nguyễn Hải Anh",
        email: "nguyenhaianh@neu.edu.vn",
        role: "Student",
        status: "Active",
        organization: "ĐH Kinh tế Quốc dân",
        eventCount: 12,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anh",
        joinedDate: "2024-01-15"
    },
    {
        id: "2",
        name: "Trần Thị B",
        email: "tranthib@example.com",
        role: "Business",
        status: "Active",
        organization: "Công ty TNHH Tech",
        eventCount: 5,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=B",
        joinedDate: "2024-02-10"
    },
    {
        id: "3",
        name: "CLB Tech BK",
        email: "techbk@hust.edu.vn",
        role: "Organization",
        status: "Active",
        organization: "ĐH Bách Khoa Hà Nội",
        eventCount: 45,
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=BK",
        joinedDate: "2023-11-20"
    },
    {
        id: "4",
        name: "Lê Văn C",
        email: "levanc@gmail.com",
        role: "Student",
        status: "Pending",
        organization: "ĐH Ngoại Thương",
        eventCount: 0,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=C",
        joinedDate: "2024-04-01"
    },
    {
        id: "5",
        name: "Phạm Minh D",
        email: "minhd@company.com",
        role: "Admin",
        status: "Blocked",
        organization: "Administrator",
        eventCount: 0,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=D",
        joinedDate: "2024-03-12"
    }
];

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
        case "Admin": return { label: "Quản trị viên", icon: <ShieldCheck size={14} />, color: "text-purple-600 bg-purple-50 border-purple-100" };
        case "Organization": return { label: "Tổ chức", icon: <Building2 size={14} />, color: "text-blue-600 bg-blue-50 border-blue-100" };
        case "Student": return { label: "Sinh viên", icon: <GraduationCap size={14} />, color: "text-gray-600 bg-white border-gray-200" };
        case "Business": return { label: "Doanh nghiệp", icon: <Building2 size={14} />, color: "text-orange-600 bg-orange-50 border-orange-100" };
        default: return { label: role, icon: <UserCog size={14} />, color: "text-gray-600 bg-gray-50 border-gray-100" };
    }
};

export const UserCardData: CardInfo[] = [
    {
        title: "Tổng số",
        value: 7,
    },
    {
        title: "Sinh viên",
        value: 4,
        color: "text-blue-600"
    },
    {
        title: "Doanh nghiệp",
        value: 2,
        color: "text-purple-600"
    },
    {
        title: "Admin",
        value: 1,
        color: "text-sky-500"
    },
    {
        title: "Hoạt động",
        value: 6,
        color: "text-green-500"
    },
    {
        title: "Bị khóa",
        value: 1,
        color: "text-red-500"
    }
];