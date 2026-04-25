import { useState } from "react";
import { ClipboardCheck, Users, LogIn, LogOut, BarChart2, Calendar, MapPin, Search, X } from "lucide-react";
import { MockEvents, EventItem, getEventStatusStyles } from "../../event/data/EventMockData";
import { getAttendanceStats } from "../data/AttendanceMockData";
import AttendancePanel from "./AttendancePanel";

export default function AttendanceList() {
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [search, setSearch] = useState("");

    if (selectedEvent) {
        return <AttendancePanel event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
    }

    const filtered = MockEvents.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.organization.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Điểm danh theo sự kiện</h2>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#0092B8] transition-all">
                    <Search size={15} className="text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm sự kiện..."
                        className="text-sm outline-none bg-transparent w-44 placeholder:text-gray-400"
                    />
                    {search && (
                        <button onClick={() => setSearch("")}>
                            <X size={14} className="text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
            </div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map(event => {
                    const stats = getAttendanceStats(event.id);
                    const statusStyle = getEventStatusStyles(event.status);
                    const checkInRate = stats.checkInRate;

                    return (
                        <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                            {/* Banner */}
                            <div className="relative h-28 overflow-hidden">
                                <img src={event.bannerUrl} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                                    <span className="text-white font-bold text-sm truncate max-w-[70%]">{event.title}</span>
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${statusStyle.color} bg-white/90 backdrop-blur-sm`}>
                                        {statusStyle.label}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 flex flex-col gap-3">
                                {/* Meta */}
                                <div className="flex flex-col gap-1 text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} className="text-gray-400 shrink-0" />
                                        <span>{new Date(event.startTime).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={12} className="text-gray-400 shrink-0" />
                                        <span className="truncate">{event.venue}</span>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { icon: <Users size={13} />, value: stats.total, label: "Tổng", color: "text-gray-700" },
                                        { icon: <LogIn size={13} />, value: stats.checkedIn, label: "Đã vào", color: "text-green-600" },
                                        { icon: <LogOut size={13} />, value: stats.checkedOut, label: "Đã ra", color: "text-teal-600" },
                                        { icon: <BarChart2 size={13} />, value: `${checkInRate}%`, label: "Tỷ lệ", color: "text-[#0092B8]" },
                                    ].map(s => (
                                        <div key={s.label} className="flex flex-col items-center gap-1 px-2 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className={`${s.color} font-black text-base`}>{s.value}</span>
                                            <span className="text-[10px] text-gray-400 font-semibold">{s.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Progress bar */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                                        <span>Tỷ lệ check-in</span>
                                        <span className={checkInRate >= 80 ? "text-green-600" : checkInRate >= 50 ? "text-amber-500" : "text-gray-400"}>{checkInRate}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${checkInRate >= 80 ? "bg-green-500" : checkInRate >= 50 ? "bg-amber-400" : "bg-gray-300"}`}
                                            style={{ width: `${checkInRate}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Action */}
                                <button
                                    onClick={() => setSelectedEvent(event)}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-bold text-[#0092B8] bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-100 transition-colors mt-1"
                                >
                                    <ClipboardCheck size={16} /> Quản lý điểm danh
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="col-span-2 py-16 text-center text-sm text-gray-400 font-medium">
                        Không tìm thấy sự kiện nào
                    </div>
                )}
            </div>
        </div>
    );
}
