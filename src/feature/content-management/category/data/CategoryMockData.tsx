import { CardInfo } from "../../../user-management/user/data/UserMockData";

export interface CategoryItem {
    id: string;
    iconUrl: string;
    name: string;
    description: string;
    slug: string;
    eventCount: number;
    optionsCount: number;
    status: "Active" | "Paused";
}

export const MockCategories: CategoryItem[] = [
    {
        id: "1",
        iconUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=tech",
        name: "Công nghệ",
        description: "Hội thảo, workshop về lập trình, AI, Blockchain...",
        slug: "cong-nghe",
        eventCount: 24,
        optionsCount: 3,
        status: "Active"
    },
    {
        id: "2",
        iconUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=business",
        name: "Kinh doanh",
        description: "Khởi nghiệp, marketing, tài chính sinh viên...",
        slug: "kinh-doanh",
        eventCount: 18,
        optionsCount: 2,
        status: "Active"
    },
    {
        id: "3",
        iconUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=arts",
        name: "Văn hóa - Nghệ thuật",
        description: "Âm nhạc, nhiếp ảnh, hội họa, triển lãm...",
        slug: "van-hoa",
        eventCount: 12,
        optionsCount: 0,
        status: "Active"
    },
    {
        id: "4",
        iconUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=sports",
        name: "Thể thao",
        description: "Giải đấu, hội thao sinh viên, rèn luyện thể chất...",
        slug: "the-thao",
        eventCount: 9,
        optionsCount: 0,
        status: "Active"
    },
    {
        id: "5",
        iconUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=academic",
        name: "Học thuật",
        description: "Nghiên cứu khoa học, thi Olympiad, tọa đàm...",
        slug: "hoc-thuat",
        eventCount: 15,
        optionsCount: 0,
        status: "Active"
    },
    {
        id: "6",
        iconUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=volunteer",
        name: "Tình nguyện",
        description: "Hoạt động cộng đồng, từ thiện, mùa hè xanh...",
        slug: "tinh-nguyen",
        eventCount: 7,
        optionsCount: 0,
        status: "Active"
    },
    {
        id: "7",
        iconUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=skills",
        name: "Kỹ năng mềm",
        description: "Giao tiếp, lãnh đạo, thuyết trình, làm việc nhóm...",
        slug: "ky-nang-mem",
        eventCount: 11,
        optionsCount: 0,
        status: "Paused"
    },
    {
        id: "8",
        iconUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=language",
        name: "Ngoại ngữ",
        description: "CLB tiếng Anh, Nhật, Hàn, Trung, giao lưu quốc tế...",
        slug: "ngoai-ngu",
        eventCount: 6,
        optionsCount: 0,
        status: "Active"
    }
];

export const CategoryCardData: CardInfo[] = [
    {
        title: "Tổng danh mục",
        value: 8,
    },
    {
        title: "Đang hoạt động",
        value: 7,
        color: "text-green-500"
    },
    {
        title: "Tạm dừng",
        value: 1,
        color: "text-amber-500"
    },
    {
        title: "Tổng sự kiện",
        value: 102,
        color: "text-blue-600"
    }
];
