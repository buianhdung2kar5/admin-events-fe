import React from 'react';
import { Building2, Landmark, Users } from "lucide-react";
import { CardInfo } from '../../user/data/UserMockData';

export interface OrganizationItem {
    id: string;
    logoUrl: string;
    name: string;
    email: string;
    isVerified: boolean;
    type: "University" | "Club" | "Business";
    unit: string;
    eventCount: number;
    memberCount: number;
    status: "Active" | "Blocked";
    verificationStatus: "Verified" | "Unverified";
}

export const MockOrganizations: OrganizationItem[] = [
    {
        id: "1",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=NEU",
        name: "ĐH Kinh tế Quốc dân",
        email: "events@neu.edu.vn",
        isVerified: true,
        type: "University",
        unit: "https://neu.edu.vn",
        eventCount: 32,
        memberCount: 480,
        status: "Active",
        verificationStatus: "Verified"
    },
    {
        id: "2",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=BK",
        name: "CLB Công nghệ BK",
        email: "techclub@bk.edu.vn",
        isVerified: true,
        type: "Club",
        unit: "ĐHBK Hà Nội",
        eventCount: 24,
        memberCount: 156,
        status: "Active",
        verificationStatus: "Verified"
    },
    {
        id: "3",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=FTU",
        name: "Hội SV Ngoại Thương",
        email: "hoisv@ftu.edu.vn",
        isVerified: true,
        type: "Club",
        unit: "ĐH Ngoại Thương",
        eventCount: 18,
        memberCount: 220,
        status: "Active",
        verificationStatus: "Verified"
    },
    {
        id: "4",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=NEU-E",
        name: "CLB Entrepreneur NEU",
        email: "entrepreneur@neu.edu.vn",
        isVerified: false,
        type: "Club",
        unit: "ĐH Kinh tế Quốc dân",
        eventCount: 11,
        memberCount: 89,
        status: "Active",
        verificationStatus: "Unverified"
    },
    {
        id: "5",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=ABC",
        name: "Công ty TNHH ABC Tech",
        email: "hr@abctech.vn",
        isVerified: true,
        type: "Business",
        unit: "https://abctech.vn",
        eventCount: 5,
        memberCount: 12,
        status: "Active",
        verificationStatus: "Verified"
    },
    {
        id: "6",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=ULIS",
        name: "CLB Nghệ thuật ULIS",
        email: "artsclub@ulis.edu.vn",
        isVerified: false,
        type: "Club",
        unit: "ĐH Ngoại ngữ - ĐHQGHN",
        eventCount: 8,
        memberCount: 134,
        status: "Blocked",
        verificationStatus: "Unverified"
    }
];


export const OrgCardData: CardInfo[] = [
    {
        title: "Tổng tổ chức",
        value: 6,
    },
    {
        title: "Đã xác thực",
        value: 4,
        color: "text-green-500"
    },
    {
        title: "Đang hoạt động",
        value: 5,
        color: "text-blue-500"
    },
    {
        title: "Tổng sự kiện",
        value: 98,
        color: "text-purple-600"
    }
];

export const getOrgTypeStyles = (type: string) => {
    switch (type) {
        case "University": return { label: "Trường ĐH", color: "bg-blue-50 text-blue-600 border-blue-100" };
        case "Club": return { label: "CLB / Hội SV", color: "bg-purple-50 text-purple-600 border-purple-100" };
        case "Business": return { label: "Doanh nghiệp", color: "bg-orange-50 text-orange-600 border-orange-100" };
        default: return { label: type, color: "bg-gray-50 text-gray-600 border-gray-100" };
    }
};

