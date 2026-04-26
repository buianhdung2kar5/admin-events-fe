import { CardInfo } from "../../../user-management/user/data/UserMockData";

// --- Types ---
export type RecruitmentStatus = "OPEN" | "CLOSED";
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Recruitment {
    id: string;
    eventId: string;
    eventTitle: string;
    bannerUrl: string;
    role: string; 
    description: string;
    reward: string;
    certificateName: string;
    quantity: number;
    appliedCount: number;
    approvedCount: number;
    status: RecruitmentStatus;
    createdAt: string;
}

export interface Applicant {
    id: string;
    recruitmentId: string;
    eventId: string;
    name: string;
    email: string;
    phone: string;
    studentId: string;
    school: string;
    major: string;
    avatarUrl: string;
    cvUrl: string;
    status: ApplicationStatus;
    appliedAt: string;
    answers: ApplicationAnswer[];
}

export interface ApplicationAnswer {
    questionId: string;
    question: string;
    answer: string;
}

// --- Mock Data ---
export const MockRecruitments: Recruitment[] = [
    {
        id: "r-001",
        eventId: "ev-001",
        eventTitle: "NEU Business Summit 2024",
        bannerUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=80",
        role: "Cộng tác viên",
        description: "Hỗ trợ điều phối chương trình, check-in khách mời, chụp ảnh sự kiện.",
        reward: "Áo CTV, Giấy chứng nhận, bữa ăn trong ngày",
        certificateName: "Chứng nhận CTV NEU Business Summit 2024",
        quantity: 20,
        appliedCount: 35,
        approvedCount: 12,
        status: "OPEN",
        createdAt: "2024-03-01T08:00:00Z"
    },
    {
        id: "r-002",
        eventId: "ev-002",
        eventTitle: "TechDay BK 2024",
        bannerUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&q=80",
        role: "Tình nguyện viên",
        description: "Hỗ trợ ban tổ chức chuẩn bị địa điểm, phục vụ khách hàng VIP.",
        reward: "Bữa ăn miễn phí, Giấy chứng nhận tham gia",
        certificateName: "Chứng nhận TNV TechDay BK 2024",
        quantity: 15,
        appliedCount: 22,
        approvedCount: 15,
        status: "CLOSED",
        createdAt: "2024-03-10T09:00:00Z"
    },
    {
        id: "r-003",
        eventId: "ev-003",
        eventTitle: "Music Festival: Đêm Hội Ngoại Thương",
        bannerUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80",
        role: "Cộng tác viên",
        description: "Hỗ trợ quảng bá, bán vé, setup sân khấu, dẫn chương trình phụ.",
        reward: "150.000 VNĐ/ngày, Vé VIP, Giấy chứng nhận",
        certificateName: "Chứng nhận CTV Music Festival FTU 2024",
        quantity: 30,
        appliedCount: 8,
        approvedCount: 0,
        status: "OPEN",
        createdAt: "2024-04-01T07:00:00Z"
    }
];

export const MockApplicants: Applicant[] = [
    {
        id: "app-001",
        recruitmentId: "r-001",
        eventId: "ev-001",
        name: "Nguyễn Thị Lan",
        email: "lan.nguyen@student.edu.vn",
        phone: "0912345678",
        studentId: "11210123",
        school: "Đại học Kinh tế Quốc dân",
        major: "Quản trị Kinh doanh",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lan",
        cvUrl: "#",
        status: "APPROVED",
        appliedAt: "2024-03-05T10:30:00Z",
        answers: [
            { questionId: "q1", question: "Tại sao bạn muốn tham gia làm CTV?", answer: "Tôi muốn tích lũy kinh nghiệm tổ chức sự kiện và mở rộng mạng lưới quan hệ." },
            { questionId: "q2", question: "Bạn có kinh nghiệm tổ chức sự kiện không?", answer: "Có, tôi đã từng là CTV của 3 sự kiện cấp trường trong năm 2023." }
        ]
    },
    {
        id: "app-002",
        recruitmentId: "r-001",
        eventId: "ev-001",
        name: "Trần Văn Minh",
        email: "minh.tran@student.edu.vn",
        phone: "0987654321",
        studentId: "11210456",
        school: "Đại học Kinh tế Quốc dân",
        major: "Marketing",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
        cvUrl: "#",
        status: "PENDING",
        appliedAt: "2024-03-06T14:00:00Z",
        answers: [
            { questionId: "q1", question: "Tại sao bạn muốn tham gia làm CTV?", answer: "Tôi muốn học hỏi kỹ năng tổ chức và quảng bá sự kiện chuyên nghiệp." },
            { questionId: "q2", question: "Bạn có kinh nghiệm tổ chức sự kiện không?", answer: "Chưa có nhiều kinh nghiệm nhưng tôi rất nhiệt tình và học hỏi nhanh." }
        ]
    },
    {
        id: "app-003",
        recruitmentId: "r-001",
        eventId: "ev-001",
        name: "Lê Thị Hoa",
        email: "hoa.le@student.edu.vn",
        phone: "0905555123",
        studentId: "11210789",
        school: "Đại học Ngoại thương",
        major: "Kinh tế Quốc tế",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoa",
        cvUrl: "#",
        status: "REJECTED",
        appliedAt: "2024-03-07T09:15:00Z",
        answers: [
            { questionId: "q1", question: "Tại sao bạn muốn tham gia làm CTV?", answer: "Tôi thích không khí sôi động của sự kiện và muốn đóng góp." }
        ]
    },
    {
        id: "app-004",
        recruitmentId: "r-002",
        eventId: "ev-002",
        name: "Phạm Quang Huy",
        email: "huy.pham@student.edu.vn",
        phone: "0933111222",
        studentId: "20200123",
        school: "Đại học Bách khoa HN",
        major: "Kỹ thuật Phần mềm",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Huy",
        cvUrl: "#",
        status: "APPROVED",
        appliedAt: "2024-03-12T11:00:00Z",
        answers: [
            { questionId: "q1", question: "Lý do ứng tuyển?", answer: "Tôi là sinh viên IT, muốn hỗ trợ sự kiện công nghệ và mở rộng networking." }
        ]
    }
];

export const RecruitmentCardData: CardInfo[] = [
    { title: "Tổng đợt tuyển", value: 3 },
    { title: "Đang mở", value: 2, color: "text-green-500" },
    { title: "Đã đóng", value: 1, color: "text-gray-400" },
    { title: "Đơn ứng tuyển", value: 65, color: "text-blue-600" }
];
