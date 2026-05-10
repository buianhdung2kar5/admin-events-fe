import StatisticsRow from "../../feature/dashboard/components/StatisticCard";
import TopEventsCard from "../../feature/dashboard/components/TopEventsCard";
import { AccessFastData } from "../../feature/dashboard/data/MockData";
import AccessFastBlock from "../../feature/dashboard/components/AccessFastBlock";
import EmergencyCard from "../../feature/dashboard/components/EmergencyCard";
import NewJobCard from "../../feature/dashboard/components/NewJobCard";

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
                <p className="text-gray-500 text-sm">Chào mừng bạn trở lại, sau đây là thống kê mới nhất.</p>
            </header>

            {/* Emergency / Quick alerts */}
            <EmergencyCard />

            {/* Statistics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                <StatisticsRow />
            </div>

            {/* Two card row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NewJobCard />
                <TopEventsCard />
            </div>

            {/* Quick Access */}
            <div className="flex w-full items-center justify-between bg-white p-4 rounded-3xl shadow-sm">
                {AccessFastData.map((item, index) => (
                    <AccessFastBlock key={index} item={item} />
                ))}
            </div>
        </div>
    );
}