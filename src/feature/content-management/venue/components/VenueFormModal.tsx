import { useState } from "react";
import { X, Building2 } from "lucide-react";
import { VenueItem } from "../data/VenueMockData";

interface Props {
    venue: VenueItem | null;
    onClose: () => void;
    onSave: (data: Partial<VenueItem>) => void;
}

const CITIES = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Huế", "Nha Trang", "Hải Phòng", "Bình Dương"];

export default function VenueFormModal({ venue, onClose, onSave }: Props) {
    const [name, setName] = useState(venue?.name ?? "");
    const [address, setAddress] = useState(venue?.address ?? "");
    const [city, setCity] = useState(venue?.city ?? "Hồ Chí Minh");
    const [capacity, setCapacity] = useState(String(venue?.capacity ?? ""));
    const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(venue?.status ?? "ACTIVE");

    const isEdit = !!venue;
    const canSubmit = name.trim() && address.trim() && Number(capacity) > 0;

    const handleSubmit = () => {
        if (!canSubmit) return;
        onSave({ name: name.trim(), address: address.trim(), city, capacity: Number(capacity), status });
    };

    const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all";
    const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wide";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <Building2 size={20} className="text-[#0092B8]" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-800">{isEdit ? "Chỉnh sửa địa điểm" : "Thêm địa điểm mới"}</h2>
                            <p className="text-xs text-gray-400">{isEdit ? venue.name : "Tạo địa điểm công cộng"}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Tên địa điểm *</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                            placeholder="VD: Nhà Văn hóa Thanh niên TP.HCM" className={inputCls} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Địa chỉ *</label>
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                            placeholder="VD: 4 Phạm Ngọc Thạch, Bến Nghé" className={inputCls} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Tỉnh/Thành phố</label>
                            <select value={city} onChange={e => setCity(e.target.value)} className={inputCls}>
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Sức chứa (người) *</label>
                            <input type="number" min={1} value={capacity} onChange={e => setCapacity(e.target.value)}
                                placeholder="VD: 500" className={inputCls} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Trạng thái</label>
                        <div className="flex gap-3">
                            {(["ACTIVE", "INACTIVE"] as const).map(s => (
                                <button key={s} onClick={() => setStatus(s)}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${status === s
                                        ? (s === "ACTIVE" ? "bg-green-500 text-white border-green-500" : "bg-gray-500 text-white border-gray-500")
                                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                                    {s === "ACTIVE" ? "Đang hoạt động" : "Tạm ngừng"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Hủy</button>
                    <button onClick={handleSubmit} disabled={!canSubmit}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        {isEdit ? "Lưu thay đổi" : "Tạo địa điểm"}
                    </button>
                </div>
            </div>
        </div>
    );
}
