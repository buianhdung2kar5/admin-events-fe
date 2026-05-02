export type EventStatus = "DRAFT" | "PUBLISHED" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED" | "LOCKED" | "CLOSED";
export type RecruitmentType = "CTV_ONLY" | "ATTENDEE_ONLY" | "BOTH" | "NONE";

export interface CategoryOption {
    categoryOptionId: number;
    categoryId: number;
    value: string;
}

export interface Category {
    categoryId: number;
    name: string;
    type: string;
    options: CategoryOption[];
}

export interface EventInterface {
    eventId: number;
    title: string;
    banner: string | null;
    registerOpenTime: string;
    startTime: string;
    endTime: string;
    status: EventStatus;
    price: number;
    categories: Category[];
    capacity: number;
    totalParticipants: number;
    youthUnionPoint: number;
    certificateName: string | null;
    userEventState: string;
    recruitmentType: RecruitmentType;
}

export const getEventStatusStyles = (status: EventStatus) => {
    switch (status) {
        case "DRAFT": return { label: "Lưu nháp", color: "bg-gray-100 text-gray-600 border-gray-200" };
        case "PUBLISHED": return { label: "Đã xuất bản", color: "bg-green-50 text-green-600 border-green-200" };
        case "UPCOMING": return { label: "Sắp diễn ra", color: "bg-purple-50 text-purple-600 border-purple-200" };
        case "ONGOING": return { label: "Đang diễn ra", color: "bg-blue-50 text-blue-600 border-blue-200" };
        case "COMPLETED": return { label: "Đã kết thúc", color: "bg-teal-50 text-teal-600 border-teal-200" };
        case "CLOSED": return { label: "Đã đóng", color: "bg-teal-50 text-teal-600 border-teal-200" };
        case "CANCELLED": return { label: "Đã hủy", color: "bg-red-50 text-red-600 border-red-200" };
        case "LOCKED": return { label: "Bị khóa", color: "bg-amber-50 text-amber-600 border-amber-200" };
        default: return { label: status, color: "bg-gray-50 text-gray-600" };
    }
};
