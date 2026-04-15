import React from 'react';
import { RecentActivities, ActivityItem } from '../data/MockData';

export default function ActivityCard() {
    const colorMap: Record<string, { bg: string, iconBg: string, text: string }> = {
        cyan: { bg: 'bg-cyan-50/50', iconBg: 'bg-cyan-100', text: 'text-cyan-600' },
        blue: { bg: 'bg-blue-50/50', iconBg: 'bg-blue-100', text: 'text-blue-600' },
        yellow: { bg: 'bg-yellow-50/50', iconBg: 'bg-yellow-100', text: 'text-yellow-600' },
        red: { bg: 'bg-red-50/50', iconBg: 'bg-red-100', text: 'text-red-600' },
        green: { bg: 'bg-green-50/50', iconBg: 'bg-green-100', text: 'text-green-600' },
        purple: { bg: 'bg-purple-50/50', iconBg: 'bg-purple-100', text: 'text-purple-600' },
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6 h-full">
            <h3 className="text-xl font-bold text-gray-800">Hoạt động gần đây</h3>
            
            <div className="flex flex-col gap-3">
                {RecentActivities.map((activity) => {
                    const colors = colorMap[activity.color] || colorMap.blue;
                    return (
                        <div 
                            key={activity.id} 
                            className={`flex items-center gap-4 p-3 rounded-2xl ${colors.bg} transition-all hover:scale-[1.01]`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors.iconBg} ${colors.text}`}>
                                {activity.icon}
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold text-gray-700 leading-tight">
                                    {activity.content}
                                </p>
                                <span className="text-xs text-gray-400 mt-0.5">
                                    {activity.time}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
