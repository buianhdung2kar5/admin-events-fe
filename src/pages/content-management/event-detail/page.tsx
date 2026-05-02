import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
    ArrowLeft, FileText, BarChart2, PieChart, X
} from 'lucide-react';
import { EventsApi } from '../../../services/events-management/EventsApi';
import EventDetailHeader from '../../../feature/content-management/event/components/EventDetailHeader';
import EventDetailInfo from '../../../feature/content-management/event/components/EventDetailInfo';
import EventDetailStats from '../../../feature/content-management/event/components/EventDetailStats';
import EventDetailAnalytics from '../../../feature/content-management/event/components/EventDetailAnalytics';

export default function EventDetailPage() {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"info" | "stats" | "analytics">("info");

    const { data: eventResponse, isLoading, isError } = useQuery({
        queryKey: ['event', eventId],
        queryFn: () => EventsApi.getById(eventId!),
        enabled: !!eventId
    });

    const { data: statsResponse } = useQuery({
        queryKey: ['event-stats', eventId],
        queryFn: () => EventsApi.getStatisticEvent(eventId!),
        enabled: !!eventId && activeTab === "stats"
    });

    const { data: analyticsResponse } = useQuery({
        queryKey: ['event-analytics', eventId],
        queryFn: () => EventsApi.getAnalyticsEvent(eventId!),
        enabled: !!eventId && activeTab === "analytics"
    });

    const event = eventResponse?.object;
    const stats = statsResponse?.object;
    const analytics = analyticsResponse?.object;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-[#0092B8]/30 border-t-[#0092B8] rounded-full animate-spin" />
                <p className="text-gray-500 font-medium">Đang tải thông tin sự kiện...</p>
            </div>
        );
    }

    if (isError || !event) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                    <X size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Không tìm thấy sự kiện</h3>
                <button onClick={() => navigate(-1)} className="text-[#0092B8] font-semibold flex items-center gap-2">
                    <ArrowLeft size={16} /> Quay lại danh sách
                </button>
            </div>
        );
    }

    const locationCategory = event.categories?.find((c: any) => c.type === "LOCATION");
    const venue = locationCategory?.options?.[0]?.value || "Chưa cập nhật";
    const styleCategory = event.categories?.find((c: any) => c.type === "STYLE");
    const style = styleCategory?.options?.[0]?.value || "Sự kiện";

    return (
        <div className="flex flex-col gap-6 pb-12 max-w-5xl mx-auto">
            <EventDetailHeader event={event} venue={venue} style={style} />

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
                <div className="flex items-center px-6 border-b border-gray-100">
                    {[
                        { id: "info", label: "Thông tin chi tiết", icon: <FileText size={16} /> },
                        { id: "stats", label: "Thống kê đăng ký", icon: <BarChart2 size={16} /> },
                        { id: "analytics", label: "Phân tích người dùng", icon: <PieChart size={16} /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-5 text-sm font-bold border-b-2 transition-all ${
                                activeTab === tab.id 
                                ? 'border-[#0092B8] text-[#0092B8]' 
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 p-8 bg-gray-50/30">
                    {activeTab === "info" && <EventDetailInfo event={event} venue={venue} />}
                    {activeTab === "stats" && <EventDetailStats stats={stats} />}
                    {activeTab === "analytics" && <EventDetailAnalytics analytics={analytics} stats={stats} />}
                </div>
            </div>
        </div>
    );
}
