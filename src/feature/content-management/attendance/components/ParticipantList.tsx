import { useState } from "react";
import { X, User, Search, UserPlus, Check, LogOut, Trash2, Filter } from "lucide-react";
import { Participant, ParticipantRole, ParticipantCheckInStatus, MockParticipants } from "../data/AttendanceMockData";

interface Props {
    eventId: string;
    onClose?: () => void;
}

const ROLE_STYLES: Record<ParticipantRole, string> = {
    ATTENDEE: "bg-blue-50 text-blue-600 border-blue-200",
    CTV: "bg-purple-50 text-purple-600 border-purple-200",
    VOLUNTEER: "bg-teal-50 text-teal-600 border-teal-200",
    ORGANIZER: "bg-amber-50 text-amber-600 border-amber-200"
};
const ROLE_LABELS: Record<ParticipantRole, string> = {
    ATTENDEE: "Tham dự", CTV: "CTV", VOLUNTEER: "TNV", ORGANIZER: "BTC"
};

const STATUS_STYLES: Record<ParticipantCheckInStatus, string> = {
    NOT_CHECKED_IN: "bg-gray-100 text-gray-500",
    CHECKED_IN: "bg-green-50 text-green-600",
    CHECKED_OUT: "bg-teal-50 text-teal-600"
};
const STATUS_LABELS: Record<ParticipantCheckInStatus, string> = {
    NOT_CHECKED_IN: "Chưa vào", CHECKED_IN: "Đã check-in", CHECKED_OUT: "Đã check-out"
};

export default function ParticipantList({ eventId }: Props) {
    const [participants, setParticipants] = useState<Participant[]>(
        MockParticipants.filter(p => p.eventId === eventId)
    );
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState<ParticipantRole | "ALL">("ALL");
    const [filterStatus, setFilterStatus] = useState<ParticipantCheckInStatus | "ALL">("ALL");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newRole, setNewRole] = useState<ParticipantRole>("ATTENDEE");

    const filtered = participants.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase()) ||
            p.studentId.includes(search) ||
            p.ticketCode.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === "ALL" || p.role === filterRole;
        const matchStatus = filterStatus === "ALL" || p.checkInStatus === filterStatus;
        return matchSearch && matchRole && matchStatus;
    });

    const handleQuickCheckin = (id: string) => {
        setParticipants(prev => prev.map(p => p.id === id
            ? { ...p, checkInStatus: "CHECKED_IN" as const, checkInTime: new Date().toISOString() }
            : p));
    };

    const handleQuickCheckout = (id: string) => {
        setParticipants(prev => prev.map(p => p.id === id
            ? { ...p, checkInStatus: "CHECKED_OUT" as const, checkOutTime: new Date().toISOString() }
            : p));
    };

    const handleRemove = (id: string) => setParticipants(prev => prev.filter(p => p.id !== id));

    const handleAddParticipant = () => {
        if (!newName.trim() || !newEmail.trim()) return;
        const newP: Participant = {
            id: `p-${Date.now()}`,
            eventId,
            userId: `u-${Date.now()}`,
            name: newName.trim(),
            email: newEmail.trim(),
            studentId: "N/A",
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newName}`,
            role: newRole,
            checkInStatus: "NOT_CHECKED_IN",
            ticketCode: `TK-MANUAL-${Date.now()}`
        };
        setParticipants(prev => [...prev, newP]);
        setNewName(""); setNewEmail(""); setIsAddOpen(false);
    };

    const stats = {
        total: participants.length,
        checkedIn: participants.filter(p => p.checkInStatus !== "NOT_CHECKED_IN").length,
        checkedOut: participants.filter(p => p.checkInStatus === "CHECKED_OUT").length,
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Mini Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Tổng participants", value: stats.total, color: "text-gray-800" },
                    { label: "Đã check-in", value: stats.checkedIn, color: "text-green-600" },
                    { label: "Đã check-out", value: stats.checkedOut, color: "text-teal-600" },
                ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between border border-gray-100">
                        <span className="text-xs font-semibold text-gray-500">{s.label}</span>
                        <span className={`text-lg font-black ${s.color}`}>{s.value}</span>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#0092B8] transition-all flex-1 min-w-48">
                    <Search size={14} className="text-gray-400 shrink-0" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, email, MSSV, mã vé..." className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400" />
                </div>
                <select value={filterRole} onChange={e => setFilterRole(e.target.value as any)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 outline-none focus:border-[#0092B8] bg-white">
                    <option value="ALL">Tất cả vai trò</option>
                    <option value="ATTENDEE">Tham dự</option>
                    <option value="CTV">CTV</option>
                    <option value="VOLUNTEER">TNV</option>
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 outline-none focus:border-[#0092B8] bg-white">
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="NOT_CHECKED_IN">Chưa vào</option>
                    <option value="CHECKED_IN">Đã check-in</option>
                    <option value="CHECKED_OUT">Đã check-out</option>
                </select>
                <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] rounded-xl transition-colors shadow-sm shrink-0">
                    <UserPlus size={16} /> Thêm
                </button>
            </div>

            {/* Add Form */}
            {isAddOpen && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col gap-3 animate-[fadeIn_0.2s_ease]">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#0092B8]">Thêm participant thủ công</span>
                        <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Họ và tên *" className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0092B8] bg-white" />
                        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email *" className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0092B8] bg-white" />
                        <select value={newRole} onChange={e => setNewRole(e.target.value as ParticipantRole)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#0092B8] bg-white text-gray-600">
                            <option value="ATTENDEE">Tham dự</option>
                            <option value="CTV">CTV</option>
                            <option value="VOLUNTEER">Tình nguyện viên</option>
                        </select>
                    </div>
                    <button onClick={handleAddParticipant} disabled={!newName || !newEmail} className="self-end px-5 py-2 text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] rounded-xl transition-colors disabled:opacity-50">
                        Xác nhận thêm
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Participant</th>
                            <th className="px-4 py-3 text-center">Vai trò</th>
                            <th className="px-4 py-3">Mã vé</th>
                            <th className="px-4 py-3 text-center">Trạng thái</th>
                            <th className="px-4 py-3">Thời gian</th>
                            <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={6} className="py-10 text-center text-sm text-gray-400">Không có participant nào</td></tr>
                        ) : filtered.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img src={p.avatarUrl} alt="" className="w-9 h-9 rounded-xl object-cover border border-gray-100 bg-gray-50" />
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-gray-800 text-sm">{p.name}</span>
                                            <span className="text-xs text-gray-400">{p.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border ${ROLE_STYLES[p.role]}`}>
                                        {ROLE_LABELS[p.role]}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{p.ticketCode}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex px-3 py-1.5 rounded-xl text-[11px] font-bold ${STATUS_STYLES[p.checkInStatus]}`}>
                                        {STATUS_LABELS[p.checkInStatus]}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                                        {p.checkInTime && <span>In: {new Date(p.checkInTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>}
                                        {p.checkOutTime && <span>Out: {new Date(p.checkOutTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>}
                                        {!p.checkInTime && <span className="text-gray-300">—</span>}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {p.checkInStatus === "NOT_CHECKED_IN" && (
                                            <button onClick={() => handleQuickCheckin(p.id)} title="Quick Check-in" className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"><Check size={15} /></button>
                                        )}
                                        {p.checkInStatus === "CHECKED_IN" && (
                                            <button onClick={() => handleQuickCheckout(p.id)} title="Quick Check-out" className="p-1.5 text-gray-400 hover:text-teal-500 hover:bg-teal-50 rounded-lg transition-colors"><LogOut size={15} /></button>
                                        )}
                                        <button onClick={() => handleRemove(p.id)} title="Xóa" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
