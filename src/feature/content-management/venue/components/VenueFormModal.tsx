import { useState, useEffect, useRef } from "react";
import { X, Building2, MapPin, CheckCircle2 } from "lucide-react";
import { VenueItem } from "../data/VenueMockData";
import MapPicker from "./MapPicker";

interface Props {
    venue: VenueItem | null;
    onClose: () => void;
    onSave: (data: Partial<VenueItem>) => void;
}

export default function VenueFormModal({ venue, onClose, onSave }: Props) {
    const [name, setName] = useState(venue?.name ?? "");
    const [address, setAddress] = useState(venue?.address ?? "");
    const [capacity, setCapacity] = useState(String(venue?.capacity ?? ""));
    const [latitude, setLatitude] = useState(String(venue?.latitude ?? ""));
    const [longitude, setLongitude] = useState(String(venue?.longitude ?? ""));
    const [mapUrl, setMapUrl] = useState(venue?.mapUrl ?? "");

    // Map state
    const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(
        venue?.latitude && venue?.longitude ? [venue.latitude, venue.longitude] : undefined
    );
    const [pendingCenter, setPendingCenter] = useState<[number, number] | null>(
        venue?.latitude && venue?.longitude ? [venue.latitude, venue.longitude] : null
    );
    const [isConfirmed, setIsConfirmed] = useState(!!venue?.latitude);
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isEdit = !!venue;
    const canSubmit = name.trim() && address.trim() && Number(capacity) > 0 && isConfirmed;

    // Auto-search when address changes (debounced 800ms)
    useEffect(() => {
        if (!address.trim()) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
                const data = await res.json();
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    setPendingCenter([lat, lon]);
                    setMapCenter([lat, lon]);
                    setIsConfirmed(false);
                }
            } catch {}
            finally { setIsSearching(false); }
        }, 800);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [address]);

    // When user clicks on map
    const handleMapChange = (lat: number, lng: number) => {
        setPendingCenter([lat, lng]);
        setIsConfirmed(false);
    };

    const handleConfirmLocation = () => {
        if (!pendingCenter) return;
        const [lat, lng] = pendingCenter;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setMapUrl(`https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`);
        setMapCenter([lat, lng]);
        setIsConfirmed(true);
    };

    const handleSubmit = () => {
        if (!canSubmit) return;
        onSave({
            name: name.trim(),
            address: address.trim(),
            capacity: Number(capacity),
            latitude: Number(latitude),
            longitude: Number(longitude),
            mapUrl: mapUrl.trim()
        });
    };

    const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all";
    const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wide";

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center py-10 px-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 flex flex-col gap-5">
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
                <div className="flex flex-col gap-5">
                    {/* Top Row: Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Tên địa điểm *</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)}
                                placeholder="VD: Nhà Văn hóa Thanh niên TP.HCM" className={inputCls} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>
                                Địa chỉ *
                                {isSearching && <span className="ml-2 text-[10px] text-[#0092B8] font-normal normal-case italic">Đang tìm trên bản đồ...</span>}
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={e => { setAddress(e.target.value); setIsConfirmed(false); }}
                                placeholder="VD: 4 Phạm Ngọc Thạch, Bến Nghé"
                                className={inputCls}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Sức chứa (người) *</label>
                            <input type="number" min={1} value={capacity} onChange={e => setCapacity(e.target.value)}
                                placeholder="VD: 500" className={inputCls} />
                        </div>
                    </div>

                    {/* Map Row */}
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-between">
                            <label className={labelCls}>
                                Bản đồ vị trí
                                <span className="text-[10px] font-normal italic lowercase ml-1">(Nhập địa chỉ để định vị · hoặc click trực tiếp để chỉnh)</span>
                            </label>

                            {/* Confirm button */}
                            <button
                                onClick={handleConfirmLocation}
                                disabled={!pendingCenter || isConfirmed}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                    isConfirmed
                                        ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                                        : pendingCenter
                                            ? 'bg-[#0092B8] text-white hover:bg-[#007a99]'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <CheckCircle2 size={14} />
                                {isConfirmed ? "Đã xác nhận vị trí" : "Xác nhận vị trí này"}
                            </button>
                        </div>

                        <MapPicker
                            latitude={Number(latitude)}
                            longitude={Number(longitude)}
                            center={mapCenter}
                            onChange={handleMapChange}
                        />

                        {/* Status banner below map */}
                        {isConfirmed && latitude && longitude && (
                            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                                <MapPin size={12} className="flex-shrink-0" />
                                <span className="font-semibold">Đã lưu toạ độ:</span>
                                <span>{latitude}, {longitude}</span>
                                <a href={mapUrl} target="_blank" rel="noreferrer" className="ml-auto text-[#0092B8] underline truncate max-w-[200px] hover:opacity-80">
                                    Xem Google Maps
                                </a>
                            </div>
                        )}
                        {!isConfirmed && pendingCenter && (
                            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                                <MapPin size={12} className="flex-shrink-0" />
                                <span>Vị trí chưa xác nhận — nhấn <strong>"Xác nhận vị trí này"</strong> để lưu toạ độ</span>
                            </div>
                        )}
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
        </div>
    );
}
