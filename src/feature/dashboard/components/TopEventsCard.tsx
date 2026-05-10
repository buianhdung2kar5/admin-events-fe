import { useQuery } from "@tanstack/react-query";
import { EventsApi } from "../../../services/events-management/EventsApi";
import { Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopEventsCard() {
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ["dashboard_top_events"],
        queryFn: () => EventsApi.getAll(0, 5),
    });

    const events: any[] = data?.object?.content || [];

    // Sort by totalParticipants desc
    const topEvents = [...events].sort((a, b) => b.totalParticipants - a.totalParticipants).slice(0, 5);

    const getRankStyles = (rank: number) => {
        switch (rank) {
            case 1: return "bg-amber-100 text-amber-600 border-amber-200";
            case 2: return "bg-slate-100 text-slate-600 border-slate-200";
            case 3: return "bg-orange-100 text-orange-600 border-orange-200";
            default: return "bg-gray-50 text-gray-400 border-gray-100";
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6 h-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Star className="text-amber-400 fill-amber-400" size={20} />
                    <h3 className="text-xl font-bold text-gray-800">Sự kiện hàng đầu</h3>
                </div>
                <button
                    onClick={() => navigate("/content-management/event")}
                    className="text-sm font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                >
                    Xem tất cả <ArrowRight size={14} />
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col gap-4 animate-pulse">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100" />
                            <div className="w-12 h-12 rounded-xl bg-gray-100" />
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="h-3 bg-gray-100 rounded w-3/4" />
                                <div className="h-2 bg-gray-50 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {topEvents.map((event, idx) => {
                        const rank = idx + 1;
                        const location = event.categories?.find((c: any) => c.type === "LOCATION")?.options?.[0]?.value || "Chưa cập nhật";
                        return (
                            <div key={event.eventId} className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 text-sm font-bold ${getRankStyles(rank)}`}>
                                    {rank}
                                </div>
                                <img
                                    src={event.banner || "https://placehold.co/48x48/f3f4f6/a1a1aa?text=No"}
                                    alt={event.title}
                                    className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-100"
                                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/48x48/f3f4f6/a1a1aa?text=No"; }}
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-800 truncate">{event.title}</h4>
                                    <p className="text-xs text-gray-400 truncate">{location}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-blue-600 leading-none">{event.totalParticipants.toLocaleString()}</p>
                                    <span className="text-[10px] text-gray-400 font-medium">đăng ký</span>
                                </div>
                            </div>
                        );
                    })}
                    {topEvents.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">Chưa có sự kiện nào</p>
                    )}
                </div>
            )}
        </div>
    );
}
