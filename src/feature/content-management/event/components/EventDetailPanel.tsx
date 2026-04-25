import { useState } from "react";
import { X, Calendar, MapPin, Users, DollarSign, Award, Trophy, Briefcase, FileText, BarChart2, PieChart, Activity, Building2 } from "lucide-react";
import { EventItem, getEventStatusStyles } from "../data/EventMockData";

interface Props {
    event: EventItem;
    onClose: () => void;
}

export default function EventDetailPanel({ event, onClose }: Props) {
    const [activeTab, setActiveTab] = useState<"info" | "stats" | "analytics">("info");
    const statusStyle = getEventStatusStyles(event.status);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-[slideInRight_0.3s_ease]">
                {/* Header */}
                <div className="px-6 py-6 border-b border-gray-100 flex items-start justify-between bg-white relative z-10">
                    <div className="flex flex-col gap-3 pr-8">
                        <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase self-start ${statusStyle.color}`}>
                            {statusStyle.label}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 leading-tight">{event.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5"><Building2 size={16} /> {event.organization}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(event.startTime).toLocaleDateString("vi-VN")}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors shrink-0">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center px-6 border-b border-gray-100 bg-white">
                    {[
                        { id: "info", label: "Thông tin", icon: <FileText size={16} /> },
                        { id: "stats", label: "Thống kê", icon: <BarChart2 size={16} /> },
                        { id: "analytics", label: "Phân tích", icon: <PieChart size={16} /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                                activeTab === tab.id 
                                ? 'border-[#0092B8] text-[#0092B8]' 
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {activeTab === "info" && (
                        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
                            <img src={event.bannerUrl} alt="Banner" className="w-full h-48 object-cover rounded-2xl shadow-sm border border-gray-100" />
                            
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Mô tả sự kiện</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><MapPin size={14} /> Địa điểm</span>
                                    <span className="text-sm font-medium text-gray-800 mt-1">{event.venue}</span>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><Users size={14} /> Số lượng (Sức chứa)</span>
                                    <span className="text-sm font-medium text-gray-800 mt-1">{event.capacity} người</span>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><Calendar size={14} /> Bắt đầu</span>
                                    <span className="text-sm font-medium text-gray-800 mt-1">{new Date(event.startTime).toLocaleString("vi-VN")}</span>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5"><Calendar size={14} /> Kết thúc</span>
                                    <span className="text-sm font-medium text-gray-800 mt-1">{new Date(event.endTime).toLocaleString("vi-VN")}</span>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Quyền lợi & Yêu cầu</h3>
                                <div className="grid grid-cols-2 gap-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-50 rounded-xl text-amber-500"><Award size={18} /></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Reward Coin</span>
                                            <span className="text-sm font-bold text-gray-800">{event.rewardCoin} 🪙</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><Trophy size={18} /></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Điểm rèn luyện</span>
                                            <span className="text-sm font-bold text-gray-800">{event.youthUnionPoint} đ</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-50 rounded-xl text-green-500"><DollarSign size={18} /></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Giá vé</span>
                                            <span className="text-sm font-bold text-gray-800">{event.price === 0 ? "Miễn phí" : `${event.price.toLocaleString()} VNĐ`}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-xl text-purple-500"><Briefcase size={18} /></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">Tuyển dụng</span>
                                            <span className="text-sm font-bold text-gray-800">{event.recruitmentType}</span>
                                        </div>
                                    </div>
                                </div>
                                {event.certificateName && (
                                    <div className="mt-2 pt-4 border-t border-gray-100 flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-500">Chứng nhận:</span>
                                        <span className="text-sm font-bold text-[#0092B8] bg-blue-50 px-3 py-1 rounded-lg">{event.certificateName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "stats" && (
                        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard title="Đăng ký" value={event.statistics.totalRegistered} icon={<Users />} color="blue" />
                                <StatCard title="Check-in" value={event.statistics.totalCheckedIn} icon={<Activity />} color="green" />
                                <StatCard title="Tham gia" value={event.statistics.totalAttendees} icon={<Users />} color="purple" />
                                <StatCard title="CTV tham gia" value={event.statistics.totalCtv} icon={<Briefcase />} color="amber" />
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Tỷ lệ chuyển đổi</h3>
                                <div className="flex flex-col gap-4">
                                    <ProgressRow label="Check-in / Đăng ký" value={event.statistics.totalCheckedIn} total={Math.max(event.statistics.totalRegistered, 1)} color="bg-green-500" />
                                    <ProgressRow label="Tham dự / Check-in" value={event.statistics.totalAttendees} total={Math.max(event.statistics.totalCheckedIn, 1)} color="bg-[#0092B8]" />
                                    <ProgressRow label="Feedback / Tham dự" value={event.statistics.totalFeedbacks} total={Math.max(event.statistics.totalAttendees, 1)} color="bg-amber-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "analytics" && (
                        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-5">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Nhân khẩu học (Demographics)</h3>
                                
                                {/* Gender */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                                        <span>Giới tính</span>
                                    </div>
                                    <div className="flex h-3 rounded-full overflow-hidden w-full bg-gray-100">
                                        <div style={{width: `${event.analytics.demographics.gender.male}%`}} className="bg-blue-500" title={`Nam: ${event.analytics.demographics.gender.male}%`}></div>
                                        <div style={{width: `${event.analytics.demographics.gender.female}%`}} className="bg-pink-500" title={`Nữ: ${event.analytics.demographics.gender.female}%`}></div>
                                        <div style={{width: `${event.analytics.demographics.gender.other}%`}} className="bg-gray-400" title={`Khác: ${event.analytics.demographics.gender.other}%`}></div>
                                    </div>
                                    <div className="flex gap-4 text-xs font-medium text-gray-500 mt-1">
                                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Nam: {event.analytics.demographics.gender.male}%</span>
                                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-500"></span>Nữ: {event.analytics.demographics.gender.female}%</span>
                                    </div>
                                </div>

                                {/* Age */}
                                <div className="flex flex-col gap-3 mt-2">
                                    <span className="text-xs font-semibold text-gray-500">Độ tuổi</span>
                                    <ProgressRow label="18-20 tuổi" value={event.analytics.demographics.age["18-20"]} total={100} color="bg-emerald-500" />
                                    <ProgressRow label="21-23 tuổi" value={event.analytics.demographics.age["21-23"]} total={100} color="bg-emerald-500" />
                                    <ProgressRow label="Trên 24 tuổi" value={event.analytics.demographics.age["24+"]} total={100} color="bg-emerald-500" />
                                </div>

                                {/* Major */}
                                <div className="flex flex-col gap-3 mt-2">
                                    <span className="text-xs font-semibold text-gray-500">Ngành học chính</span>
                                    <ProgressRow label="IT & Công nghệ" value={event.analytics.demographics.major.it} total={100} color="bg-indigo-500" />
                                    <ProgressRow label="Kinh tế & Quản trị" value={event.analytics.demographics.major.economics} total={100} color="bg-indigo-500" />
                                    <ProgressRow label="Marketing & Truyền thông" value={event.analytics.demographics.major.marketing} total={100} color="bg-indigo-500" />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-5">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Timeline Check-in</h3>
                                {event.analytics.checkInTimeline.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {event.analytics.checkInTimeline.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <span className="w-12 text-xs font-bold text-gray-500 text-right">{item.time}</span>
                                                <div className="flex-1 flex items-center gap-3">
                                                    <div className="h-2 rounded-full bg-[#0092B8]" style={{ width: `${Math.min(item.count / 10, 100)}%` }}></div>
                                                    <span className="text-xs font-semibold text-gray-700">{item.count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-sm text-gray-400 font-medium">Chưa có dữ liệu check-in</div>
                                )}
                            </div>
                        </div>
                    )}
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
        <div className={`p-4 rounded-2xl border shadow-sm flex flex-col gap-3 ${colorMap[color]}`}>
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wide">{title}</span>
            </div>
            <span className="text-2xl font-black">{value.toLocaleString()}</span>
        </div>
    );
}

function ProgressRow({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium text-gray-600">
                <span>{label}</span>
                <span className="font-bold">{percent}% ({value})</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}
