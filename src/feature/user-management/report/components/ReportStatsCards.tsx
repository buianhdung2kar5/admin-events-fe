import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { REPORTS_QUERY_KEY, ReportsApi } from "../../../../services/user-management/ReportsApi";
import type { ReportStatus } from "../../../../types/report.types";
import { REPORT_STATUS_META } from "../reportDisplay";

const STATUSES: ReportStatus[] = ["PENDING", "RESOLVED", "REJECTED"];

export default function ReportStatsCards() {
    const { data, isLoading } = useQuery({
        queryKey: [...REPORTS_QUERY_KEY, "stats"],
        queryFn: () => Promise.all(STATUSES.map((status) => ReportsApi.count(status))),
    });

    return (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {STATUSES.map((status, index) => (
                <div key={status} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1.5">
                    <span className="text-gray-500 text-sm font-medium">{REPORT_STATUS_META[status].label}</span>
                    {isLoading ? (
                        <Loader2 size={24} className="text-gray-300 animate-spin" />
                    ) : (
                        <span className="text-2xl font-bold text-gray-800">{data?.[index] ?? 0}</span>
                    )}
                </div>
            ))}
        </div>
    );
}
