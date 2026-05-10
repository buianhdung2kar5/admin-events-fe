import { useQuery } from "@tanstack/react-query";
import { Users, Building2, Calendar, FileText, Briefcase } from "lucide-react";
import UserApi from "../../../services/user-management/UserApi";
import { EventsApi } from "../../../services/events-management/EventsApi";
import { NewApi } from "../../../services/news-management/NewApi";
import { RecruitmentApi } from "../../../services/events-management/Recruitments";

interface StatCard {
    title: string;
    value: string | number | undefined;
    icon: React.ReactNode;
    color: string;
    sub: string;
    isLoading: boolean;
}

const colorMap: Record<string, { bg: string; text: string; main: string; skeleton: string }> = {
    cyan:   { bg: "bg-cyan-50",   text: "text-cyan-500",   main: "text-cyan-700",   skeleton: "bg-cyan-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-500", main: "text-purple-700", skeleton: "bg-purple-100" },
    blue:   { bg: "bg-blue-50",   text: "text-blue-500",   main: "text-blue-700",   skeleton: "bg-blue-100" },
    orange: { bg: "bg-orange-50", text: "text-orange-500", main: "text-orange-600", skeleton: "bg-orange-100" },
    teal:   { bg: "bg-teal-50",   text: "text-teal-500",   main: "text-teal-600",   skeleton: "bg-teal-100" },
};

function StatisticCard({ item }: { item: StatCard }) {
    const colors = colorMap[item.color] || colorMap.blue;

    if (item.isLoading) {
        return (
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 animate-pulse">
                <div className={`w-10 h-10 rounded-full ${colors.skeleton}`} />
                <div className="flex flex-col gap-1.5 mt-1">
                    <div className={`h-7 w-16 rounded-lg ${colors.skeleton}`} />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
                <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.bg} ${colors.text}`}>
                {item.icon}
            </div>
            <div className="flex flex-col gap-0.5">
                <h2 className={`text-2xl font-bold ${colors.main}`}>
                    {item.value == null ? "0" : Number(item.value).toLocaleString()}
                </h2>
                <p className="text-gray-500 text-sm font-medium">{item.title}</p>
            </div>
            <span className="text-xs font-semibold text-gray-400">{item.sub}</span>
        </div>
    );
}

export default function StatisticsRow() {
    const { data: usersData,    isLoading: l1 } = useQuery({ queryKey: ["dash_users"],      queryFn: () => UserApi.getAllUsers(0, 1) });
    const { data: orgsData,     isLoading: l2 } = useQuery({ queryKey: ["dash_orgs"],       queryFn: () => UserApi.getAllUsers(0, 1, undefined, "createdTime", "desc", "ORGANIZATION") });
    const { data: eventsData,   isLoading: l3 } = useQuery({ queryKey: ["dash_events"],     queryFn: () => EventsApi.getAll(0, 1) });
    const { data: newsData,     isLoading: l4 } = useQuery({ queryKey: ["dash_news"],       queryFn: () => NewApi.getAllNews(0, 1, ["createdTime,desc"]) });
    const { data: recruitData,  isLoading: l5 } = useQuery({ queryKey: ["dash_recruit"],   queryFn: () => RecruitmentApi.getAllRecruitment(0, 1, []) });
    const { data: pubEventsData               } = useQuery({ queryKey: ["dash_pub_events"], queryFn: () => EventsApi.getAll(0, 1, undefined, undefined, "PUBLISHED") });

    const cards: StatCard[] = [
        {
            title: "Tổng người dùng",
            value: usersData?.object?.totalElements,
            icon: <Users size={20} />,
            color: "cyan",
            sub: "Tất cả tài khoản",
            isLoading: l1,
        },
        {
            title: "Tổ chức đối tác",
            value: orgsData?.object?.totalElements,
            icon: <Building2 size={20} />,
            color: "purple",
            sub: "Doanh nghiệp, câu lạc bộ",
            isLoading: l2,
        },
        {
            title: "Sự kiện",
            value: eventsData?.object?.totalElements,
            icon: <Calendar size={20} />,
            color: "blue",
            sub: `${pubEventsData?.object?.totalElements ?? 0} đang xuất bản`,
            isLoading: l3,
        },
        {
            title: "Tin tức",
            value: newsData?.object?.totalElements,
            icon: <FileText size={20} />,
            color: "orange",
            sub: "Bài viết đã đăng",
            isLoading: l4,
        },
        {
            title: "Đợt tuyển CTV",
            value: recruitData?.object?.totalElements,
            icon: <Briefcase size={20} />,
            color: "teal",
            sub: "Tổng số đợt tuyển",
            isLoading: l5,
        },
    ];

    return (
        <>
            {cards.map((item, i) => (
                <StatisticCard key={i} item={item} />
            ))}
        </>
    );
}