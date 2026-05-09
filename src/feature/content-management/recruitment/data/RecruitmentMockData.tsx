import { CardInfo } from "../../../user-management/user/data/UserMockData";

// --- Types ---
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

// --- Category types from API ---
export interface CategoryOption {
    categoryOptionId: number;
    categoryId: number;
    value: string;
}

export interface Category {
    categoryId: number;
    name: string;
    type: "PRICE" | "STYLE" | "LOCATION" | "FIELD" | string;
    options: CategoryOption[];
}

// --- Recruitment List Item (from GET /recruitment) ---
export interface RecruitmentItem {
    ctvRecruitmentId: number;
    eventId: number;
    categories: Category[];
    title: string;
    banner: string | null;
    startTime: string;
    roleName: string;
    description: string;
    quantity: number;
    youthUnionPoint: number;
    cashRewardAmount: number;
    certificateName: string | null;
    isOpen: boolean;
    appliedCount: number;
    userEventState: string;
    createdTime: string;
}

// --- Question Option ---
export interface QuestionOption {
    optionId: number;
    questionId: number;
    optionValue: string;
}

// --- Requirement Question ---
export interface RequirementQuestion {
    questionId: number;
    ctvRecruitmentId: number;
    questionText: string;
    questionType: "SINGLECHOICE" | "MULTIPLECHOICE" | "TEXT";
    isRequired: boolean;
    options: QuestionOption[];
}

// --- Venue ---
export interface Venue {
    venueId: number;
    name: string;
    address: string;
    capacity: number;
    latitude: number;
    longitude: number;
    mapUrl: string;
    createdTime: string;
}

// --- Recruitment Detail (from GET /recruitment/:id) ---
export interface RecruitmentDetail {
    ctvRecruitmentId: number;
    eventId: number;
    organizerName: string;
    venue: Venue | null;
    categories: Category[];
    recruitmentType: string;
    rewardCoin: number;
    youthUnionPoint: number;
    cashRewardAmount: number;
    certificateName: string | null;
    title: string;
    banner: string | null;
    startTime: string;
    roleName: string;
    description: string;
    quantity: number;
    isOpen: boolean;
    appliedCount: number;
    recruitedCtvCount: number;
    requirementQuestions: RequirementQuestion[];
    userEventState: string;
    createdTime: string;
}

// --- Applicant (giữ lại cho ApplicantList dùng sau) ---
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

// --- Stats Card Data ---
export const RecruitmentCardData: CardInfo[] = [
    { title: "Tổng đợt tuyển", value: 0 },
    { title: "Đang mở", value: 0, color: "text-green-500" },
    { title: "Đã đóng", value: 0, color: "text-gray-400" },
    { title: "Đơn ứng tuyển", value: 0, color: "text-blue-600" },
];
