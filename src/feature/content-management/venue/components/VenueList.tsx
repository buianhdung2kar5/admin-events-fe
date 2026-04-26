import { useState, useMemo } from "react";
import { Search, MapPin, Edit2, Trash2, Plus, Users, Building2, ChevronDown } from "lucide-react";
import { MockVenues, VenueItem } from "../data/VenueMockData";
import VenueFormModal from "./VenueFormModal";

export default function VenueList() {
    const [venues, setVenues] = useState<VenueItem[]>(MockVenues);
    const [search, setSearch] = useState("");
    const [filterOwner, setFilterOwner] = useState<string>("ALL");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [showFormModal, setShowFormModal] = useState(false);
    const [editTarget, setEditTarget] = useState<VenueItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<VenueItem | null>(null);

    const filtered = useMemo(() => {
        return venues.filter(v => {
            const matchSearch =
                v.name.toLowerCase().includes(search.toLowerCase()) ||
                v.address.toLowerCase().includes(search.toLowerCase()) ||
                v.ownerName.toLowerCase().includes(search.toLowerCase());
            const matchOwner = filterOwner === "ALL" || v.ownerType === filterOwner;
            const matchStatus = filterStatus === "ALL" || v.status === filterStatus;
            return matchSearch && matchOwner && matchStatus;
        });
    }, [venues, search, filterOwner, filterStatus]);

    const handleSave = (data: Partial<VenueItem>) => {
        if (editTarget) {
            // TODO: PUT /venues/{id}      (ADMIN only)
            setVenues(prev => prev.map(v => v.id === editTarget.id ? { ...v, ...data } : v));
        } else {
            // TODO: POST /venues
            const newVenue: VenueItem = {
                id: `v${String(Date.now()).slice(-4)}`,
                name: data.name!,
                address: data.address!,
                capacity: data.capacity!,
                latitude: data.latitude!,
                longitude: data.longitude!,
                mapUrl: data.mapUrl!,
                ownerType: "ADMIN",
                ownerName: "Quản trị hệ thống",
                status: "ACTIVE",
                activeEvents: 0,
                createdAt: new Date().toISOString(),
            };
            setVenues(prev => [newVenue, ...prev]);
        }
        setShowFormModal(false);
        setEditTarget(null);
    };

    const handleDelete = (venue: VenueItem) => {
        if (venue.activeEvents > 0) {
            alert(`⚠️ Không thể xoá "${venue.name}" vì đang có ${venue.activeEvents} sự kiện sử dụng địa điểm này.`);
            return;
        }
        setDeleteTarget(venue);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        // TODO: DELETE /venues/{id}   (ADMIN only)
        setVenues(prev => prev.filter(v => v.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    const selectCls = "border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 outline-none focus:border-[#0092B8] bg-white cursor-pointer";

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#0092B8] transition-all flex-1">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm theo tên địa điểm, địa chỉ, đơn vị sở hữu..."
                        className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)} className={selectCls}>
                        <option value="ALL">Tất cả chủ sở hữu</option>
                        <option value="ADMIN">Quản trị (ADMIN)</option>
                        <option value="ORGANIZATION">Tổ chức (ORG)</option>
                    </select>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={selectCls}>
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="INACTIVE">Tạm ngừng</option>
                    </select>
                    <button
                        onClick={() => { setEditTarget(null); setShowFormModal(true); }}
                        className="flex items-center gap-2 bg-[#0092B8] text-white px-4 py-2.5 rounded-xl hover:bg-[#007a99] transition-all shadow-sm font-bold text-sm"
                    >
                        <Plus size={16} strokeWidth={3} /> Thêm địa điểm
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Địa điểm</th>
                                <th className="px-6 py-4 text-center">Sức chứa</th>
                                <th className="px-6 py-4">Chủ sở hữu</th>
                                <th className="px-6 py-4 text-center">Sự kiện đang chạy</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                                        Không tìm thấy địa điểm nào
                                    </td>
                                </tr>
                            ) : filtered.map(venue => (
                                <tr key={venue.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-xl shrink-0">
                                                <Building2 size={18} className="text-[#0092B8]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{venue.name}</p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <MapPin size={11} /> {venue.address}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1 text-gray-700 font-bold">
                                            <Users size={14} className="text-gray-400" />
                                            {venue.capacity.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className={`inline-flex w-fit px-2 py-0.5 rounded-lg text-[10px] font-bold border mb-1 ${venue.ownerType === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                                {venue.ownerType}
                                            </span>
                                            <span className="text-xs text-gray-500">{venue.ownerName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-lg font-semibold ${venue.activeEvents > 0 ? 'text-[#0092B8]' : 'text-gray-300'}`}>
                                            {venue.activeEvents}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border ${venue.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                            {venue.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm ngừng'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => { setEditTarget(venue); setShowFormModal(true); }}
                                                className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-xl transition-all"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(venue)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Xoá"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form Modal */}
            {showFormModal && (
                <VenueFormModal
                    venue={editTarget}
                    onClose={() => { setShowFormModal(false); setEditTarget(null); }}
                    onSave={handleSave}
                />
            )}

            {/* Delete Confirm */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                    <div className="relative bg-white rounded-xl shadow-sm w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
                        <h3 className="text-base font-bold text-gray-800">Xác nhận xoá địa điểm</h3>
                        <p className="text-sm text-gray-500">
                            Bạn có chắc muốn xoá <strong>"{deleteTarget.name}"</strong>? Thao tác này không thể hoàn tác.
                        </p>
                        <div className="flex gap-3 mt-2">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Hủy</button>
                            <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Xoá</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
