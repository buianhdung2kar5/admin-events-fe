import { CardInfo } from "../../../user-management/user/data/UserMockData";

export interface CategoryOption {
    id: string;
    categoryId: string;
    name: string;
}

export interface CategoryItem {
    id: string;
    name: string;
    description: string;
    slug: string;
    eventCount: number;
    options: CategoryOption[];
    status: "Active" | "Paused";
}

export const MockCategories: CategoryItem[] = [
    {
        id: "1",
        name: "Công nghệ",
        description: "Hội thảo, workshop về lập trình, AI, Blockchain...",
        slug: "cong-nghe",
        eventCount: 24,
        options: [
            { id: "o1-1", categoryId: "1", name: "Trí tuệ nhân tạo (AI)" },
            { id: "o1-2", categoryId: "1", name: "Blockchain" },
            { id: "o1-3", categoryId: "1", name: "Web Development" }
        ],
        status: "Active"
    },
    {
        id: "2",
        name: "Kinh doanh",
        description: "Khởi nghiệp, marketing, tài chính sinh viên...",
        slug: "kinh-doanh",
        eventCount: 18,
        options: [
            { id: "o2-1", categoryId: "2", name: "Khởi nghiệp" },
            { id: "o2-2", categoryId: "2", name: "Marketing" }
        ],
        status: "Active"
    },
    {
        id: "3",
        name: "Văn hóa - Nghệ thuật",
        description: "Âm nhạc, nhiếp ảnh, hội họa, triển lãm...",
        slug: "van-hoa",
        eventCount: 12,
        options: [],
        status: "Active"
    },
    {
        id: "4",
        name: "Thể thao",
        description: "Giải đấu, hội thao sinh viên, rèn luyện thể chất...",
        slug: "the-thao",
        eventCount: 9,
        options: [],
        status: "Active"
    },
    {
        id: "5",
        name: "Học thuật",
        description: "Nghiên cứu khoa học, thi Olympiad, tọa đàm...",
        slug: "hoc-thuat",
        eventCount: 15,
        options: [
            { id: "o5-1", categoryId: "5", name: "Nghiên cứu khoa học" },
            { id: "o5-2", categoryId: "5", name: "Thi học thuật" }
        ],
        status: "Active"
    },
    {
        id: "6",
        name: "Tình nguyện",
        description: "Hoạt động cộng đồng, từ thiện, mùa hè xanh...",
        slug: "tinh-nguyen",
        eventCount: 7,
        options: [],
        status: "Active"
    },
    {
        id: "7",
        name: "Kỹ năng mềm",
        description: "Giao tiếp, lãnh đạo, thuyết trình, làm việc nhóm...",
        slug: "ky-nang-mem",
        eventCount: 11,
        options: [],
        status: "Paused"
    },
    {
        id: "8",
        name: "Ngoại ngữ",
        description: "CLB tiếng Anh, Nhật, Hàn, Trung, giao lưu quốc tế...",
        slug: "ngoai-ngu",
        eventCount: 6,
        options: [],
        status: "Active"
    }
];

export const CategoryCardData: CardInfo[] = [
    { title: "Tổng danh mục", value: 8 },
    { title: "Đang hoạt động", value: 7, color: "text-green-500" },
    { title: "Tạm dừng", value: 1, color: "text-amber-500" },
    { title: "Tổng sự kiện", value: 102, color: "text-blue-600" }
];
