import { CardInfo } from "../../../user-management/user/data/UserMockData";

// ─── DB Schema (khớp với backend) ─────────────────────────────────────
// Table: categories       → category_id, name, type
// Table: category_options → category_option_id, value, category_id

export interface CategoryOption {
    category_option_id: string;
    category_id: string;
    value: string;
}

export interface CategoryItem {
    category_id: string;
    name: string;
    type: string;
    // Runtime-only: options được fetch riêng theo category_id
    options: CategoryOption[];
}

// ─── Mock Data ────────────────────────────────────────────────────────
export const MockCategories: CategoryItem[] = [
    {
        category_id: "1020",
        name: "Địa điểm",
        type: "LOCATION",
        options: [
            { category_option_id: "1102", category_id: "1020", value: "ĐH Kinh Tế TP.HCM" },
            { category_option_id: "1103", category_id: "1020", value: "ĐH Bách Khoa Hà Nội" },
            { category_option_id: "1104", category_id: "1020", value: "ĐH Ngoại Thương" },
        ],
    },
    {
        category_id: "1001",
        name: "Lĩnh vực",
        type: "FIELD",
        options: [
            { category_option_id: "1001", category_id: "1001", value: "Công nghệ thông tin" },
            { category_option_id: "1002", category_id: "1001", value: "Kinh doanh & Khởi nghiệp" },
            { category_option_id: "1003", category_id: "1001", value: "Nghệ thuật & Văn hóa" },
        ],
    },
    {
        category_id: "1002",
        name: "Quy mô",
        type: "SCALE",
        options: [
            { category_option_id: "1010", category_id: "1002", value: "Dưới 50 người" },
            { category_option_id: "1011", category_id: "1002", value: "50 - 200 người" },
            { category_option_id: "1012", category_id: "1002", value: "Trên 200 người" },
        ],
    },
    {
        category_id: "1003",
        name: "Hình thức",
        type: "FORMAT",
        options: [
            { category_option_id: "1020", category_id: "1003", value: "Offline" },
            { category_option_id: "1021", category_id: "1003", value: "Online" },
            { category_option_id: "1022", category_id: "1003", value: "Hybrid" },
        ],
    },
    {
        category_id: "1004",
        name: "Đối tượng",
        type: "TARGET",
        options: [
            { category_option_id: "1030", category_id: "1004", value: "Sinh viên" },
            { category_option_id: "1031", category_id: "1004", value: "Doanh nghiệp" },
            { category_option_id: "1032", category_id: "1004", value: "Tất cả" },
        ],
    },
    {
        category_id: "1005",
        name: "Ngành học",
        type: "MAJOR",
        options: [],
    },
];

// ─── Card summary ─────────────────────────────────────────────────────
export const CategoryCardData: CardInfo[] = [
    { title: "Tổng danh mục", value: MockCategories.length },
    { title: "Có options",    value: MockCategories.filter(c => c.options.length > 0).length, color: "text-green-500" },
    { title: "Chưa có options", value: MockCategories.filter(c => c.options.length === 0).length, color: "text-amber-500" },
    { title: "Tổng options",  value: MockCategories.reduce((sum, c) => sum + c.options.length, 0), color: "text-blue-600" },
];
