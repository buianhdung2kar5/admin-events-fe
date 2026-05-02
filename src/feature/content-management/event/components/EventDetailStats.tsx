import React from 'react';
import { Users, Activity, MessageSquare, BarChart2 } from 'lucide-react';

interface Props {
    stats: any;
}

export default function EventDetailStats({ stats }: Props) {
    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <BarChart2 size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-500">Đang tải dữ liệu thống kê...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Đăng ký" value={stats.totalRegistered} icon={<Users />} color="blue" />
                <StatCard title="Check-in" value={stats.totalCheckedIn} icon={<Activity />} color="green" />
                <StatCard title="Tham gia" value={stats.totalAttendees} icon={<Users />} color="purple" />
                <StatCard title="Phản hồi" value={stats.totalFeedbacks} icon={<MessageSquare />} color="amber" />
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-6">Hiệu suất tham gia</h3>
                <div className="flex flex-col gap-6">
                    <ProgressRow label="Tỷ lệ Check-in (Check-in / Đăng ký)" value={stats.totalCheckedIn} total={Math.max(stats.totalRegistered, 1)} color="bg-green-500" />
                    <ProgressRow label="Tỷ lệ Tham dự (Tham dự / Check-in)" value={stats.totalAttendees} total={Math.max(stats.totalCheckedIn, 1)} color="bg-[#0092B8]" />
                    <ProgressRow label="Tỷ lệ Phản hồi (Feedback / Tham dự)" value={stats.totalFeedbacks} total={Math.max(stats.totalAttendees, 1)} color="bg-amber-500" />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: any, color: "blue" | "green" | "purple" | "amber" }) {
    const colorMap = {
        blue: "bg-blue-50 text-blue-500 border-blue-100",
        green: "bg-green-50 text-green-500 border-green-100",
        purple: "bg-purple-50 text-purple-500 border-purple-100",
        amber: "bg-amber-50 text-amber-500 border-amber-100"
    };

    return (
        <div className={`p-5 rounded-3xl border shadow-sm flex flex-col gap-4 transition-all hover:shadow-md ${colorMap[color]}`}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{title}</span>
                <div className="p-2 bg-white/50 rounded-lg shadow-sm">{icon}</div>
            </div>
            <span className="text-3xl font-black">{value.toLocaleString()}</span>
        </div>
    );
}

function ProgressRow({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-gray-600">
                <span>{label}</span>
                <span>{percent}% ({value})</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}
