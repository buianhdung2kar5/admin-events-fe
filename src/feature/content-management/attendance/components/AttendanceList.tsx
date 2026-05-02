import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";

import AttendancePanel from "./AttendancePanel";

export default function AttendanceList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const eventId = searchParams.get("eventId");
    
    const [event, setEvent] = useState<any | null>(null);

    useEffect(() => {
        if (eventId) {
            const found = ([] as any[]).find((e: any) => e.id === eventId);
            if (found) {
                setEvent(found);
            }
        }
    }, [eventId]);

    if (!eventId) {
        return <Navigate to="/content-management/event" replace />;
    }

    if (!event) {
        return <div className="p-8 text-center text-gray-500 font-medium">Đang tải dữ liệu điểm danh...</div>;
    }

    return <AttendancePanel event={event} onBack={() => navigate("/content-management/event")} />;
}
