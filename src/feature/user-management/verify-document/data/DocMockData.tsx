import { CardInfo } from '../../user/data/UserMockData';

// ─── API stubs (comment khi chưa có backend) ───────────────────────
// GET /api/verification-documents          → fetchDocuments()
// GET /api/verification-documents/{id}     → fetchDocumentById(id)
// PUT /api/verification-documents/{id}/approve → approveDocument(id)
// PUT /api/verification-documents/{id}/reject  → rejectDocument(id, reason)
// ──────────────────────────────────────────────────────────────────

export type DocType = "CCCD" | "Permission" | "Payment" | "Contract" | "BusinessLicense";
export type DocStatus = "Pending" | "Approved" | "Rejected";
export type SenderRole = "Student" | "Organization";

export interface DocumentItem {
    id: string;
    profileName: string;
    organization: string;
    orgLogoUrl: string;
    docType: DocType;
    senderName: string;
    senderEmail: string;
    senderRole: SenderRole;
    sentDate: string;
    status: DocStatus;
    rejectionReason?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    // Mock document preview URLs
    documentUrls: string[];
    notes: string;
}

export const MockDocuments: DocumentItem[] = [
    {
        id: "doc-001",
        profileName: "Hồ sơ xác thực ĐH Kinh tế Quốc dân",
        organization: "ĐH Kinh tế Quốc dân",
        orgLogoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=NEU&backgroundColor=0092B8",
        docType: "CCCD",
        senderName: "Nguyễn Hải Anh",
        senderEmail: "anh.nguyen@neu.edu.vn",
        senderRole: "Organization",
        sentDate: "2024-03-15",
        status: "Approved",
        reviewedBy: "Admin Hệ thống",
        reviewedAt: "2024-03-16T09:00:00Z",
        documentUrls: [
            "https://picsum.photos/800/1100?random=1",
            "https://picsum.photos/800/1100?random=2"
        ],
        notes: "Hồ sơ đầy đủ và hợp lệ."
    },
    {
        id: "doc-002",
        profileName: "Đơn xin tổ chức sự kiện TechDay BK",
        organization: "CLB Công nghệ BK",
        orgLogoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=BK&backgroundColor=3b82f6",
        docType: "Permission",
        senderName: "Trần Văn Nam",
        senderEmail: "nam.tv@bk.edu.vn",
        senderRole: "Organization",
        sentDate: "2024-03-20",
        status: "Pending",
        documentUrls: [
            "https://picsum.photos/800/1100?random=3"
        ],
        notes: "Đơn xin tổ chức sự kiện TechDay 2024 tại khuôn viên ĐHBK Hà Nội."
    },
    {
        id: "doc-003",
        profileName: "Biên lai thanh toán tài trợ ABC Tech",
        organization: "Công ty TNHH ABC Tech",
        orgLogoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=ABC&backgroundColor=10b981",
        docType: "Payment",
        senderName: "Lê Thị Hồng",
        senderEmail: "hong.le@abctech.vn",
        senderRole: "Organization",
        sentDate: "2024-03-18",
        status: "Approved",
        reviewedBy: "Admin Hệ thống",
        reviewedAt: "2024-03-19T14:00:00Z",
        documentUrls: [
            "https://picsum.photos/800/1100?random=4",
            "https://picsum.photos/800/1100?random=5",
            "https://picsum.photos/800/1100?random=6"
        ],
        notes: "Biên lai thanh toán hợp lệ, đã xác nhận với ngân hàng."
    },
    {
        id: "doc-004",
        profileName: "Hợp đồng đối tác CLB Entrepreneur NEU",
        organization: "CLB Entrepreneur NEU",
        orgLogoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=NEU-E&backgroundColor=f59e0b",
        docType: "Contract",
        senderName: "Phạm Minh Hùng",
        senderEmail: "hung.pm@neu.edu.vn",
        senderRole: "Organization",
        sentDate: "2024-03-22",
        status: "Pending",
        documentUrls: [
            "https://picsum.photos/800/1100?random=7",
            "https://picsum.photos/800/1100?random=8"
        ],
        notes: "Hợp đồng hợp tác tổ chức chuỗi sự kiện khởi nghiệp học kỳ 2."
    },
    {
        id: "doc-005",
        profileName: "Xác nhận tư cách pháp nhân ULIS",
        organization: "CLB Nghệ thuật ULIS",
        orgLogoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=ULIS&backgroundColor=ef4444",
        docType: "CCCD",
        senderName: "Hoàng Thanh Tâm",
        senderEmail: "tam.ht@ulis.edu.vn",
        senderRole: "Organization",
        sentDate: "2024-03-10",
        status: "Rejected",
        rejectionReason: "Giấy tờ không rõ ràng, hình ảnh mờ và thiếu chữ ký xác nhận.",
        reviewedBy: "Admin Hệ thống",
        reviewedAt: "2024-03-12T10:00:00Z",
        documentUrls: [
            "https://picsum.photos/800/1100?random=9"
        ],
        notes: "Giấy tờ cần được scan lại với chất lượng cao hơn."
    },
    {
        id: "doc-006",
        profileName: "Giấy phép kinh doanh FTU Trading Club",
        organization: "Hội SV Ngoại Thương",
        orgLogoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=FTU&backgroundColor=8b5cf6",
        docType: "BusinessLicense",
        senderName: "Vũ Thị Mai",
        senderEmail: "mai.vt@ftu.edu.vn",
        senderRole: "Organization",
        sentDate: "2024-04-01",
        status: "Pending",
        documentUrls: [
            "https://picsum.photos/800/1100?random=10",
            "https://picsum.photos/800/1100?random=11"
        ],
        notes: "Giấy phép thành lập câu lạc bộ kinh doanh sinh viên."
    }
];

export const DocCardData: CardInfo[] = [
    { title: "Tổng yêu cầu", value: 6 },
    { title: "Chờ duyệt",    value: 3, color: "text-amber-500" },
    { title: "Đã duyệt",     value: 2, color: "text-green-500" },
    { title: "Từ chối",      value: 1, color: "text-red-500" }
];

export const getDocTypeStyles = (type: string) => {
    switch (type) {
        case "CCCD":            return { label: "CMND/CCCD người đại diện", color: "bg-blue-50 text-blue-600 border-blue-100" };
        case "Permission":      return { label: "Quyết định thành lập", color: "bg-purple-50 text-purple-600 border-purple-100" };
        case "BusinessLicense": return { label: "Giấy phép kinh doanh", color: "bg-teal-50 text-teal-600 border-teal-100" };
        case "Payment":         
        case "Contract":        return { label: "Giấy tờ khác", color: "bg-orange-50 text-orange-600 border-orange-100" };
        default:                return { label: "Giấy tờ khác", color: "bg-gray-50 text-gray-600 border-gray-100" };
    }
};
