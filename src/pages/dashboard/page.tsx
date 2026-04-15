import ActivityCard from "../../feature/dashboard/components/ActivityCard";
import StatisticCard from "../../feature/dashboard/components/StatisticCard";
import TopEventsCard from "../../feature/dashboard/components/TopEventsCard";
import { DataStatistic, AccessFastData } from "../../feature/dashboard/data/MockData";
import AccessFastBlock from "../../feature/dashboard/components/AccessFastBlock";
export default function Dashboard(){
    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
                <p className="text-gray-500 text-sm">Chào mừng bạn trở lại, sau đây là thống kê mới nhất.</p>
            </header>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 2xl:grid-cols-6 gap-4">
                {DataStatistic.map((item, index) => (
                    <StatisticCard key={index} item={item} />
                ))}
            </div>

            {/* Activities and Top Events Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityCard />
                <TopEventsCard />
            </div>
            <div className="flex w-full items-center justify-between bg-white p-4 rounded-3xl shadow-sm">
                {
                    AccessFastData.map((item, index) => (
                        <AccessFastBlock key={index} item={item} />
                    ))
                }
            </div>
        </div>
    )
}