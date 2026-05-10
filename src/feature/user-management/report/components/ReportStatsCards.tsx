import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ReportsApi } from "../../../../services/user-management/ReportsApi";

export default function ReportStatsCards() {
    const { data, isLoading } = useQuery({
        queryKey: ['report_stats_dashboard'],
        queryFn: async () => {
            const [all, pending, resolved] = await Promise.all([
                ReportsApi.getAllReports(0, 1, 'createdTime,desc'),
                ReportsApi.getAllReports(0, 1, 'createdTime,desc', 'PENDING'),
                ReportsApi.getAllReports(0, 1, 'createdTime,desc', 'RESOLVED'),
            ]);

            const getElements = (res: any) => res?.object?.totalElements || res?.data?.object?.totalElements || 0;

            return [
                { title: "Tổng báo cáo", value: getElements(all) },
                { title: "Chờ xử lý", value: getElements(pending) },
                { title: "Đã xử lý", value: getElements(resolved) },
            ];
        }
    });

    const cards = data || [
        { title: "Tổng báo cáo", value: 0 },
        { title: "Chờ xử lý", value: 0 },
        { title: "Đã xử lý", value: 0 },
    ];

    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4`}>
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-gray-500 text-sm font-medium">{card.title}</span>
                        <div className="flex items-center gap-2">
                            {isLoading ? (
                                <Loader2 size={24} className="text-gray-300 animate-spin" />
                            ) : (
                                <span className="text-2xl font-bold text-gray-800 group-hover:text-[#0092B8] transition-colors">
                                    {card.value}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
