import React from 'react';
import { PieChart, Activity, BookOpen, School } from 'lucide-react';

interface Props {
    analytics: any;
    stats: any;
}

export default function EventDetailAnalytics({ analytics, stats }: Props) {
    if (!analytics) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <PieChart size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-500">Đang tải dữ liệu phân tích...</p>
            </div>
        );
    }

    const gender = analytics.genderDistribution || { malePercentage: 0, femalePercentage: 0, otherPercentage: 0 };
    const ages = analytics.ageDistribution || [];
    const majors = analytics.majorDistribution || [];
    const schools = analytics.schoolDistribution || [];

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender & Age */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Nhân khẩu học (Demographics)</h3>
                    
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Giới tính</span>
                            <div className="flex h-4 rounded-full overflow-hidden w-full bg-gray-100 shadow-inner">
                                <div style={{width: `${gender.malePercentage}%`}} className="bg-blue-500 relative group">
                                    <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap">Nam: {gender.malePercentage}%</div>
                                </div>
                                <div style={{width: `${gender.femalePercentage}%`}} className="bg-pink-500 relative group">
                                    <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap">Nữ: {gender.femalePercentage}%</div>
                                </div>
                                <div style={{width: `${gender.otherPercentage}%`}} className="bg-gray-400 relative group">
                                    <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap">Khác: {gender.otherPercentage}%</div>
                                </div>
                            </div>
                            <div className="flex gap-4 text-[11px] font-bold text-gray-500 mt-1">
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Nam ({gender.malePercentage}%)</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>Nữ ({gender.femalePercentage}%)</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>Khác ({gender.otherPercentage}%)</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <span className="text-xs font-bold text-gray-400 uppercase">Độ tuổi</span>
                            <div className="flex flex-col gap-3">
                                {ages.map((age: any, idx: number) => (
                                    <ProgressRow key={idx} label={age.name} count={age.count} percentage={age.percentage} color="bg-emerald-500" />
                                ))}
                                {ages.length === 0 && <p className="text-xs text-gray-400 italic">Chưa có dữ liệu độ tuổi</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Major & School */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                            <BookOpen size={16} className="text-[#0092B8]" /> Chuyên ngành (Top 5)
                        </h3>
                        <div className="flex flex-col gap-3">
                            {majors.slice(0, 5).map((major: any, idx: number) => (
                                <ProgressRow key={idx} label={major.name} count={major.count} percentage={major.percentage} color="bg-[#0092B8]" />
                            ))}
                            {majors.length === 0 && <p className="text-xs text-gray-400 italic py-4 text-center">Chưa có dữ liệu chuyên ngành</p>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                            <School size={16} className="text-purple-500" /> Trường học (Top 5)
                        </h3>
                        <div className="flex flex-col gap-3">
                            {schools.slice(0, 5).map((school: any, idx: number) => (
                                <ProgressRow key={idx} label={school.name} count={school.count} percentage={school.percentage} color="bg-purple-500" />
                            ))}
                            {schools.length === 0 && <p className="text-xs text-gray-400 italic py-4 text-center">Chưa có dữ liệu trường học</p>}
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6 lg:col-span-2">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Timeline Check-in</h3>
                    {analytics.checkInTimeline && analytics.checkInTimeline.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {analytics.checkInTimeline.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="w-14 text-xs font-bold text-gray-500">{item.time}</span>
                                    <div className="flex-1 flex items-center gap-3">
                                        <div className="h-2 rounded-full bg-amber-500 shadow-sm" style={{ width: `${Math.min(item.count / (stats?.totalCheckedIn || 100) * 100, 100)}%` }}></div>
                                        <span className="text-xs font-bold text-gray-700">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                            <Activity size={40} className="mb-3 opacity-20" />
                            <p className="text-sm font-medium">Chưa có dữ liệu timeline</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProgressRow({ label, count, percentage, color }: { label: string, count: number, percentage: number, color: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-bold text-gray-600">
                <span className="truncate max-w-[70%]">{label}</span>
                <span>{percentage}% ({count})</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}
