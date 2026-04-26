export interface VenueItem {
    id: string;
    name: string;
    address: string;
    capacity: number;
    latitude: number;
    longitude: number;
    mapUrl: string;
    ownerType: 'ADMIN' | 'ORGANIZATION';
    ownerName: string;
    status: 'ACTIVE' | 'INACTIVE';
    activeEvents: number;
    createdAt: string;
}

export const MockVenues: VenueItem[] = [
    {
        id: "v001",
        name: "Nhà Văn hóa Thanh niên TP.HCM",
        address: "4 Phạm Ngọc Thạch, Bến Nghé",
        capacity: 1500,
        latitude: 10.7828,
        longitude: 106.6961,
        mapUrl: "https://maps.example.com/nvhtn",
        ownerType: "ADMIN",
        ownerName: "Quản trị hệ thống",
        status: "ACTIVE",
        activeEvents: 3,
        createdAt: "2025-10-01T08:00:00Z"
    },
    {
        id: "v002",
        name: "Hội trường ĐH Khoa học Tự nhiên",
        address: "227 Nguyễn Văn Cừ, Q.5",
        capacity: 800,
        latitude: 10.7628,
        longitude: 106.6825,
        mapUrl: "https://maps.example.com/khtn",
        ownerType: "ORGANIZATION",
        ownerName: "CLB IT KHTN",
        status: "ACTIVE",
        activeEvents: 1,
        createdAt: "2025-11-10T09:00:00Z"
    },
    {
        id: "v003",
        name: "Trung tâm Hội nghị Quốc gia",
        address: "57 Đình Tiên Hoàng, Hoàn Kiếm",
        capacity: 5000,
        latitude: 21.0278,
        longitude: 105.8342,
        mapUrl: "https://maps.example.com/ncc",
        ownerType: "ADMIN",
        ownerName: "Quản trị hệ thống",
        status: "ACTIVE",
        activeEvents: 0,
        createdAt: "2025-09-15T07:30:00Z"
    },
    {
        id: "v004",
        name: "Sân vận động Mỹ Đình",
        address: "Đường Lê Đức Thọ, Nam Từ Liêm",
        capacity: 40000,
        latitude: 21.0207,
        longitude: 105.7635,
        mapUrl: "https://maps.example.com/mydinh",
        ownerType: "ADMIN",
        ownerName: "Quản trị hệ thống",
        status: "ACTIVE",
        activeEvents: 0,
        createdAt: "2025-08-01T08:00:00Z"
    },
    {
        id: "v005",
        name: "Không gian sự kiện Cà Phê Sách",
        address: "12 Nguyễn Thị Minh Khai, Q.1",
        capacity: 120,
        latitude: 10.7850,
        longitude: 106.7001,
        mapUrl: "https://maps.example.com/cps",
        ownerType: "ORGANIZATION",
        ownerName: "Startup Hub HCM",
        status: "INACTIVE",
        activeEvents: 0,
        createdAt: "2025-12-01T10:00:00Z"
    },
    {
        id: "v006",
        name: "Amphitheater ĐH FPT Đà Nẵng",
        address: "Khu đô thị FPT, Ngũ Hành Sơn",
        capacity: 600,
        latitude: 15.9753,
        longitude: 108.2533,
        mapUrl: "https://maps.example.com/fpt",
        ownerType: "ORGANIZATION",
        ownerName: "ĐH FPT Đà Nẵng",
        status: "ACTIVE",
        activeEvents: 2,
        createdAt: "2026-01-05T08:00:00Z"
    }
];

export const VenueCardData = [
    { title: "Tổng địa điểm", value: 6 },
    { title: "Đang hoạt động", value: 5, color: "text-green-500" },
    { title: "Tạm ngừng", value: 1, color: "text-red-500" },
    { title: "Có sự kiện đang chạy", value: 3, color: "text-[#0092B8]" },
];
