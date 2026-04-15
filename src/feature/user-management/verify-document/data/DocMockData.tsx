import React from 'react';
import { FileText, FileCheck, FileClock } from "lucide-react";
import { CardInfo } from '../../user/data/UserMockData';

export interface DocumentItem {
    id: string;
    profileName: string;
    organization: string;
    docType: "CCCD" | "Permission" | "Payment" | "Contract";
    senderName: string;
    senderEmail: string;
    sentDate: string;
    status: "Pending" | "Verified" | "Rejected";
}

export const MockDocuments: DocumentItem[] = [
    {
        id: "1",
        profileName: "Hồ sơ xác thực NEU",
        organization: "ĐH Kinh tế Quốc dân",
        docType: "CCCD",
        senderName: "Nguyễn Hải Anh",
        senderEmail: "anh.nguyen@neu.edu.vn",
        sentDate: "2024-03-15",
        status: "Verified"
    },
    {
        id: "2",
        profileName: "Đơn xin tổ chức sự kiện TechDay",
        organization: "CLB Công nghệ BK",
        docType: "Permission",
        senderName: "Trần Văn Nam",
        senderEmail: "nam.tv@bk.edu.vn",
        sentDate: "2024-03-20",
        status: "Pending"
    },
    {
        id: "3",
        profileName: "Biên lai thanh toán tài trợ",
        organization: "Công ty TNHH ABC Tech",
        docType: "Payment",
        senderName: "Lê Thị Hồng",
        senderEmail: "hong.le@abctech.vn",
        sentDate: "2024-03-18",
        status: "Verified"
    },
    {
        id: "4",
        profileName: "Hợp đồng đối tác CLB",
        organization: "CLB Entrepreneur NEU",
        docType: "Contract",
        senderName: "Phạm Minh Hùng",
        senderEmail: "hung.pm@neu.edu.vn",
        sentDate: "2024-03-22",
        status: "Pending"
    },
    {
        id: "5",
        profileName: "Xác nhận tư cách pháp nhân",
        organization: "CLB Nghệ thuật ULIS",
        docType: "CCCD",
        senderName: "Hoàng Thanh Tâm",
        senderEmail: "tam.ht@ulis.edu.vn",
        sentDate: "2024-03-10",
        status: "Rejected"
    }
];


export const DocCardData: CardInfo[] = [
    {
        title: "Tổng yêu cầu",
        value: 6,
    },
    {
        title: "Chờ duyệt",
        value: 3,
        color: "text-amber-500"
    },
    {
        title: "Đã duyệt",
        value: 2,
        color: "text-green-500"
    },
    {
        title: "Từ chối",
        value: 1,
        color: "text-red-500"
    }
];

export const getDocTypeStyles = (type: string) => {
    switch (type) {
        case "CCCD": return { label: "CCCD", color: "bg-blue-50 text-blue-600 border-blue-100" };
        case "Permission": return { label: "Đơn xin phép", color: "bg-purple-50 text-purple-600 border-purple-100" };
        case "Payment": return { label: "Thanh toán", color: "bg-green-50 text-green-600 border-green-100" };
        case "Contract": return { label: "Hợp đồng", color: "bg-orange-50 text-orange-600 border-orange-100" };
        default: return { label: type, color: "bg-gray-50 text-gray-600 border-gray-100" };
    }
};

