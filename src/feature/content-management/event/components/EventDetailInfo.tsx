import React from 'react';
import { 
    FileText, MapPin, Users, Calendar, Award, Trophy, DollarSign, Briefcase 
} from 'lucide-react';

interface Props {
    event: any;
    venue: string;
}

export default function EventDetailInfo({ event, venue }: Props) {
    return (
        <div className="flex flex-col gap-8 animate-[fadeIn_0.3s_ease]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-100">
                        <img src={event.banner} alt="Banner" className="w-full h-80 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                            <FileText size={16} className="text-[#0092B8]" /> Mô tả sự kiện
                        </h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description || "Chưa có mô tả chi tiết cho sự kiện này."}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Thông tin chung</h3>
                        
                        <div className="flex flex-col gap-4">
                            <InfoRow icon={<MapPin size={16} />} label="Địa điểm" value={venue} />
                            <InfoRow icon={<Users size={16} />} label="Sức chứa" value={`${event?.venue?.capacity||'Chưa xác định số lượng'} người`} />
                            <InfoRow icon={<Calendar size={16} />} label="Bắt đầu" value={new Date(event.startTime).toLocaleString("vi-VN")} />
                            <InfoRow icon={<Calendar size={16} />} label="Kết thúc" value={new Date(event.endTime).toLocaleString("vi-VN")} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Quyền lợi & Phí</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <BenefitItem icon={<Award size={18} />} label="Reward Coin" value={`${event.price === 0 ? 0 : 0} 🪙`} color="amber" />
                            <BenefitItem icon={<Trophy size={18} />} label="Điểm rèn luyện" value={`${event.youthUnionPoint} điểm`} color="blue" />
                            <BenefitItem icon={<DollarSign size={18} />} label="Giá vé" value={event.price === 0 ? "Miễn phí" : `${event.price.toLocaleString()} VNĐ`} color="green" />
                            <BenefitItem icon={<Briefcase size={18} />} label="Đối tượng" value={event.recruitmentType} color="purple" />
                        </div>

                        {event.certificateName && (
                            <div className="mt-2 pt-4 border-t border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase block mb-2">Chứng nhận</span>
                                <span className="text-sm font-bold text-[#0092B8] bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 block text-center">
                                    {event.certificateName}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400 mt-0.5">{icon}</div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-bold text-gray-700">{value}</span>
            </div>
        </div>
    );
}

function BenefitItem({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    const colorClasses: any = {
        amber: "bg-amber-50 text-amber-500",
        blue: "bg-blue-50 text-blue-500",
        green: "bg-green-50 text-green-500",
        purple: "bg-purple-50 text-purple-500"
    };

    return (
        <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-50 hover:border-gray-100 transition-colors">
            <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>{icon}</div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-black text-gray-800">{value}</span>
            </div>
        </div>
    );
}
