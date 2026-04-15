import React from 'react';
import { StatisticItem } from '../data/MockData';

interface StatisticCardProps {
    item: StatisticItem;
}

export default function StatisticCard({ item }: StatisticCardProps) {
    // Mapping color strings to specific Tailwind classes
    const colorMap: Record<string, { bg: string, text: string, main: string }> = {
        cyan: { bg: 'bg-cyan-50', text: 'text-cyan-500', main: 'text-cyan-700' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-500', main: 'text-purple-700' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-500', main: 'text-blue-700' },
        green: { bg: 'bg-green-50', text: 'text-green-500', main: 'text-emerald-600' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-500', main: 'text-orange-600' },
        teal: { bg: 'bg-teal-50', text: 'text-teal-500', main: 'text-teal-600' },
    };

    const colors = colorMap[item.color] || colorMap.blue;

    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.bg} ${colors.text}`}>
                {item.icon}
            </div>
            
            <div className="flex flex-col gap-1">
                <h2 className={`text-2xl font-bold ${colors.main}`}>
                    {item.value}
                </h2>
                <p className="text-gray-500 text-sm font-medium">
                    {item.title}
                </p>
            </div>

            <div className="flex items-center gap-1">
                <span className={`text-xs font-semibold ${item.growth.includes('↑') ? 'text-green-500' : 'text-gray-400'}`}>
                    {item.growth}
                </span>
            </div>
        </div>
    );
}