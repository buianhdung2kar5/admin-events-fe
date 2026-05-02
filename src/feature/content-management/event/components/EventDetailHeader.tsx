import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Building2, Calendar, MapPin, 
    Lock, MessageSquare, ClipboardList, Trash2 
} from 'lucide-react';
import { getEventStatusStyles } from '../data/EventMockData';

interface Props {
    event: any;
    venue: string;
    style: string;
}

export default function EventDetailHeader({ event, venue, style }: Props) {
    const navigate = useNavigate();
    const statusStyle = getEventStatusStyles(event.status);

    return (
        <div className="flex flex-col gap-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-semibold w-fit transition-colors"
            >
                <ArrowLeft size={16} />
                Quay lại danh sách sự kiện
            </button>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex flex-col gap-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase self-start ${statusStyle.color}`}>
                        {statusStyle.label}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{event.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1.5"><Building2 size={16} /> {style}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 hidden md:block"></span>
                        <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(event.startTime).toLocaleDateString("vi-VN")}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 hidden md:block"></span>
                        <span className="flex items-center gap-1.5"><MapPin size={16} /> {venue}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-start">
                    <button className="p-2.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all border border-gray-100 shadow-sm" title="Khóa/Mở khóa">
                        <Lock size={18} />
                    </button>
                    <button className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all border border-gray-100 shadow-sm" title="Khảo sát / Phản hồi">
                        <MessageSquare size={18} />
                    </button>
                    <button 
                        onClick={() => navigate(`/content-management/attendance?eventId=${event.eventId}`)}
                        className="p-2.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all border border-gray-100 shadow-sm" title="Điểm danh"
                    >
                        <ClipboardList size={18} />
                    </button>
                    <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100 shadow-sm" title="Xóa">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
