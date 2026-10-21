import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { VerificationDocumentApi, PENDING_DOCS_QUERY_KEY } from "../../../../services/user-management/DocumentApi";
import type { VerificationDocument } from "../DTO/VerificationInterface";

interface StatCard {
    title: string;
    value: number;
}

const isToday = (iso: string): boolean => new Date(iso).toDateString() === new Date().toDateString();

/** Backend chỉ có danh sách PENDING → các chỉ số đều suy ra từ danh sách đó. */
const toStats = (docs: VerificationDocument[]): StatCard[] => [
    { title: "Chờ duyệt", value: docs.length },
    { title: "Tổ chức đang chờ", value: new Set(docs.map((d) => d.userId)).size },
    { title: "Nộp hôm nay", value: docs.filter((d) => isToday(d.createdAt)).length },
];

export default function VerifyDocumentStatsCards() {
    const { data: docs, isLoading } = useQuery({
        queryKey: PENDING_DOCS_QUERY_KEY,
        queryFn: VerificationDocumentApi.getPendingDocuments,
    });
    const data = docs ? toStats(docs) : undefined;

    const cards = data || toStats([]);

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4`}>
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
