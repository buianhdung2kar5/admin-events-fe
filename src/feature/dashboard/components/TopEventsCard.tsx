import React from 'react';
import { TopEvents, TopEventItem } from '../data/MockData';
import { Star, ArrowRight } from 'lucide-react';

export default function TopEventsCard() {
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
                <button className="text-sm font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                    Xem tất cả <ArrowRight size={14} />
                </button>
            </div>

            <div className="flex flex-col gap-6">
                {TopEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 text-sm font-bold ${getRankStyles(event.rank)}`}>
                            {event.rank}
                        </div>
                        
                        <img 
                            src={event.imageUrl} 
                            alt={event.name} 
                            className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-100"
                        />

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 truncate">
                                {event.name}
                            </h4>
                            <p className="text-xs text-gray-400 truncate">
                                {event.location}
                            </p>
                        </div>

                        <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-blue-600 leading-none">
                                {event.registrations.toLocaleString()}
                            </p>
                            <span className="text-[10px] text-gray-400 font-medium">
                                đăng ký
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
