import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EventsApi } from "../../../../services/events-management/EventsApi";
import FeedbackPanel from "./FeedbackPanel";

export default function FeedbackList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const eventId = searchParams.get("eventId");
    
    const { data: event, isLoading } = useQuery({
        queryKey: ["event", eventId],
        queryFn: async () => {
            if (!eventId) return null;
            const res = await EventsApi.getById(eventId);
            if (res.statusCode === 200) {
                return res.object;
            }
            throw new Error(res.message || "Failed to fetch event");
        },
        enabled: !!eventId
    });

    if (!eventId) {
        return <Navigate to="/content-management/event" replace />;
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-16 gap-4">
                <div className="w-8 h-8 border-4 border-[#0092B8]/30 border-t-[#0092B8] rounded-full animate-spin" />
                <p className="text-gray-500 font-medium text-sm animate-pulse">Đang tải dữ liệu sự kiện...</p>
            </div>
        );
    }

    if (!event) {
        return <div className="p-8 text-center text-red-500 font-medium">Không tìm thấy sự kiện.</div>;
    }

    return <FeedbackPanel event={event} onBack={() => navigate("/content-management/event")} />;
}
