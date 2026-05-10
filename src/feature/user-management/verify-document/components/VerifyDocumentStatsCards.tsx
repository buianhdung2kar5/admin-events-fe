import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { VerificationDocumentApi } from "../../../../services/user-management/DocumentApi";

export default function VerifyDocumentStatsCards() {
    const { data, isLoading } = useQuery({
        queryKey: ['doc_stats_dashboard'],
        queryFn: async () => {
            const [all, pending, approved, rejected] = await Promise.all([
                VerificationDocumentApi.getAllDocumentVerify(0, 1, ['createdTime,desc']),
                VerificationDocumentApi.getAllDocumentVerify(0, 1, ['createdTime,desc'], 'PENDING'),
                VerificationDocumentApi.getAllDocumentVerify(0, 1, ['createdTime,desc'], 'APPROVED'),
                VerificationDocumentApi.getAllDocumentVerify(0, 1, ['createdTime,desc'], 'REJECTED'),
            ]);

            return [
                { title: "Tổng hồ sơ", value: all.object?.totalElements || 0 },
                { title: "Chờ duyệt", value: pending.object?.totalElements || 0 },
                { title: "Đã duyệt", value: approved.object?.totalElements || 0 },
                { title: "Từ chối", value: rejected.object?.totalElements || 0 },
            ];
        }
    });

    const cards = data || [
        { title: "Tổng hồ sơ", value: 0 },
        { title: "Chờ duyệt", value: 0 },
        { title: "Đã duyệt", value: 0 },
        { title: "Từ chối", value: 0 },
    ];

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4`}>
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
