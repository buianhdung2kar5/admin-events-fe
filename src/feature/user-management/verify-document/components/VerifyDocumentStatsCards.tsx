import { useQueries } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { VerificationDocumentApi, VERIFICATION_QUERY_KEY } from "../../../../services/user-management/DocumentApi";
import type { VerificationStatus } from "../DTO/VerificationInterface";

const CARDS: { status: VerificationStatus; title: string; color: string }[] = [
    { status: "PENDING", title: "Hồ sơ chờ duyệt", color: "text-amber-600" },
    { status: "APPROVED", title: "Đã duyệt", color: "text-green-600" },
    { status: "REJECTED", title: "Bị từ chối", color: "text-red-500" },
];

/** Đếm hồ sơ theo trạng thái bằng totalElements (size=1). */
export default function VerifyDocumentStatsCards() {
    const results = useQueries({
        queries: CARDS.map(({ status }) => ({
            queryKey: [...VERIFICATION_QUERY_KEY, "count", status],
            queryFn: () => VerificationDocumentApi.count(status),
        })),
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CARDS.map((card, index) => {
                const { data, isLoading } = results[index];
                return (
                    <div key={card.status} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1.5 hover:shadow-md transition-all">
                        <span className="text-gray-500 text-sm font-medium">{card.title}</span>
                        {isLoading ? <Loader2 size={24} className="text-gray-300 animate-spin" /> : <span className={`text-2xl font-bold ${card.color}`}>{data ?? 0}</span>}
                    </div>
                );
            })}
        </div>
    );
}
