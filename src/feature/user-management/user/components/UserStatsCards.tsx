import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import UserApi from "../../../../services/user-management/UserApi";

export default function UserStatsCards() {
    const { data, isLoading } = useQuery({
        queryKey: ['user_stats_dashboard'],
        queryFn: async () => {
            const [all, users, orgs, admins, active, disabled] = await Promise.all([
                UserApi.getAllUsers(0, 1),
                UserApi.getAllUsers(0, 1, undefined, 'createdTime', 'desc', 'USER'),
                UserApi.getAllUsers(0, 1, undefined, 'createdTime', 'desc', 'ORGANIZATION'),
                UserApi.getAllUsers(0, 1, undefined, 'createdTime', 'desc', 'ADMIN'),
                UserApi.getAllUsers(0, 1, undefined, 'createdTime', 'desc', undefined, 'ACTIVE'),
                UserApi.getAllUsers(0, 1, undefined, 'createdTime', 'desc', undefined, 'DISABLED'),
            ]);

            return [
                { title: "Tổng người dùng", value: all.object?.totalElements || 0 },
                { title: "Người dùng (User)", value: users.object?.totalElements || 0 },
                { title: "Tổ chức (Org)", value: orgs.object?.totalElements || 0 },
                { title: "Admin", value: admins.object?.totalElements || 0 },
                { title: "Hoạt động", value: active.object?.totalElements || 0 },
                { title: "Bị khóa", value: disabled.object?.totalElements || 0 },
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
