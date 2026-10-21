import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { AccountApi } from "../../../../services/user-management/AccountApi";
import type { AccountListParams } from "../../../../types/account.types";

/** Chỉ cần tổng số → mỗi nhóm lấy 1 bản ghi rồi đọc totalElements. */
const countAccounts = (params: AccountListParams) =>
    AccountApi.getAccounts({ ...params, page: 0, size: 1 }).then((page) => page.totalElements);

export default function UserStatsCards() {
    const { data, isLoading } = useQuery({
        queryKey: ['user_stats_dashboard'],
        queryFn: async () => {
            const [all, users, orgs, admins, active, blocked] = await Promise.all([
                countAccounts({}),
                countAccounts({ role: "USER" }),
                countAccounts({ role: "ORGANIZATION" }),
                countAccounts({ role: "ADMIN" }),
                countAccounts({ status: "ACTIVE" }),
                countAccounts({ status: "BLOCKED" }),
            ]);

            return [
                { title: "Tổng người dùng", value: all },
                { title: "Người dùng (User)", value: users },
                { title: "Tổ chức (Org)", value: orgs },
                { title: "Admin", value: admins },
                { title: "Hoạt động", value: active },
                { title: "Bị khóa", value: blocked },
            ];
        }
    });

    const cards = data || [
        { title: "Tổng người dùng", value: 0 },
        { title: "Người dùng (User)", value: 0 },
        { title: "Tổ chức (Org)", value: 0 },
        { title: "Admin", value: 0 },
        { title: "Hoạt động", value: 0 },
        { title: "Bị khóa", value: 0 },
    ];

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4`}>
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
