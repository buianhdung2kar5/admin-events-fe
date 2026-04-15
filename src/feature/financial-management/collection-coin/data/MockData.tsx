export interface CoinPackage {
    id: string;
    name: string;
    description: string;
    coins: number;
    bonus?: number;
    price: number;
    soldCount: number;
    revenue: number;
    status: 'Selling' | 'Stopped';
    isPopular?: boolean;
    color: string;
}

export const dataCoin: CoinPackage[] = [
    {
        id: "1",
        name: "Gói Starter",
        description: "Gói cơ bản cho sinh viên mới",
        coins: 100,
        price: 20000,
        soldCount: 342,
        revenue: 6840,
        status: "Selling",
        color: "bg-[#0092B8]"
    },
    {
        id: "2",
        name: "Gói Basic",
        description: "Thêm 25 coin bonus",
        coins: 250,
        bonus: 25,
        price: 45000,
        soldCount: 521,
        revenue: 23445,
        status: "Selling",
        color: "bg-[#7C3AED]"
    },
    {
        id: "3",
        name: "Gói Standard",
        description: "Phổ biến nhất - tiết kiệm 15%",
        coins: 500,
        bonus: 75,
        price: 80000,
        soldCount: 1204,
        revenue: 96320,
        status: "Selling",
        isPopular: true,
        color: "bg-[#10B981]"
    },
    {
        id: "4",
        name: "Gói Premium",
        description: "Thêm 200 coin bonus - tiết kiệm 20%",
        coins: 1000,
        bonus: 200,
        price: 150000,
        soldCount: 433,
        revenue: 64950,
        status: "Selling",
        color: "bg-[#F59E0B]"
    }
];

export const SummaryData = [
    { title: "Tổng gói", value: 4 },
    { title: "Đang bán", value: 4, color: "text-green-500" },
    { title: "Đã bán", value: "2,502", color: "text-blue-600" },
    { title: "Doanh thu", value: "191,555Kđ", color: "text-amber-500" }
];