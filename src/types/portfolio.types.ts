/** Portfolio của người dùng — theo docs/BACKEND_API_CONTRACT.md §9, Admin chỉ đọc. */
export type PortfolioItemRole = "ATTENDEE" | "CTV";

export interface PortfolioOwner {
    userId: string;
    fullName: string | null;
    avatarUrl: string | null;
    studentCode: string | null;
    university: string | null;
    faculty: string | null;
    major: string | null;
}

export interface PortfolioItem {
    eventId: string;
    eventSlug: string;
    eventTitle: string;
    organizationName: string;
    role: PortfolioItemRole;
    positionName: string | null;
    startTime: string;
    endTime: string;
    issuedAt: string;
    note: string | null;
}

export interface Portfolio {
    id: string;
    title: string;
    description: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    createdAt: string;
    owner: PortfolioOwner | null;
    items: PortfolioItem[];
}
