import { useState, useMemo, useEffect } from 'react';
import {
    Building2, Trash2, Eye, ShieldOff, CheckSquare2, X,
    CheckCircle2, TrendingUp, TrendingDown, BarChart2,
    Calendar, Mail, Phone, Globe, Users, Activity
} from 'lucide-react';
import {
    MockOrganizations, OrganizationItem, OrgStatus,
    getOrgTypeStyles, getVerificationStyles, VerificationStatus
} from '../data/OrgMockData';

const PAGE_SIZE = 6;

interface OrgListProps {
    filter?: {
        search?: string;
        filter1?: string;
        filter2?: string;
        date?: string;
    };
}

// ─── Org Detail Panel ─────────────────────────────────────────────
function OrgDetailPanel({ org, onClose, onSuspend, onUnlock }: {
    org: OrganizationItem;
    onClose: () => void;
    onSuspend: (id: string) => void;
    onUnlock: (id: string) => void;
}) {
    const [tab, setTab] = useState<"info" | "events" | "stats" | "logs">("info");
    const typeStyle = getOrgTypeStyles(org.type);
    const verStyle  = getVerificationStyles(org.verificationStatus);

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={onClose} />
            <div className="w-[520px] bg-white h-full shadow-2xl flex flex-col animate-[slideInRight_0.3s_ease]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <img src={org.logoUrl} alt={org.name}
                            className="w-14 h-14 rounded-2xl border border-gray-100 object-cover" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-gray-800">{org.name}</h2>
                                {org.isVerified && <CheckCircle2 size={16} className="text-[#0092B8]" />}
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{org.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-lg border ${typeStyle.color}`}>{typeStyle.label}</span>
                                <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-lg ${verStyle.color}`}>{verStyle.label}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center border-b border-gray-100 px-4">
                    {[
                        { id: "info", label: "Thông tin" },
                        { id: "stats", label: "Thống kê" },
                        { id: "events", label: "Sự kiện" },
                        { id: "logs", label: "Hoạt động" }
                    ].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id as any)}
                            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all ${tab === t.id ? "border-[#0092B8] text-[#0092B8]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {tab === "info" && (
                        <>
                            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
                                {[
                                    { icon: <Mail size={14} />, label: "Email", value: org.email },
                                    { icon: <Phone size={14} />, label: "Điện thoại", value: org.phone || "—" },
                                    { icon: <Globe size={14} />, label: "Website", value: org.website || "—" },
                                    { icon: <Building2 size={14} />, label: "Đơn vị", value: org.unit },
                                    { icon: <Calendar size={14} />, label: "Ngày tạo", value: new Date(org.createdDate).toLocaleDateString("vi-VN") },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-[#0092B8] bg-blue-50 p-1.5 rounded-lg">{row.icon}</span>
                                        <span className="text-xs font-semibold text-gray-400 w-24 shrink-0">{row.label}</span>
                                        <span className="text-xs font-bold text-gray-700 flex-1 truncate">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                            {org.description && (
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-2">Giới thiệu</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">{org.description}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center gap-1">
                                    <span className="text-2xl font-black text-blue-600">{org.eventCount}</span>
                                    <span className="text-[11px] text-blue-400 font-semibold">Sự kiện</span>
                                </div>
                                <div className="bg-purple-50 rounded-2xl p-4 flex flex-col items-center gap-1">
                                    <span className="text-2xl font-black text-purple-600">{org.memberCount}</span>
                                    <span className="text-[11px] text-purple-400 font-semibold">Thành viên</span>
                                </div>
                            </div>
                        </>
                    )}

                    {tab === "stats" && (
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Tổng sự kiện", value: org.dashboard.totalEvents, icon: <Calendar size={18} />, color: "text-blue-600", bg: "bg-blue-50" },
                                { label: "Lượt đăng ký", value: org.dashboard.totalRegistrations.toLocaleString(), icon: <Users size={18} />, color: "text-purple-600", bg: "bg-purple-50" },
                                { label: "Lượt xem", value: org.dashboard.totalViews.toLocaleString(), icon: <Activity size={18} />, color: "text-green-600", bg: "bg-green-50" },
                                { label: "Tỷ lệ tham dự", value: `${org.dashboard.averageAttendanceRate}%`, icon: <BarChart2 size={18} />, color: "text-amber-600", bg: "bg-amber-50" },
                            ].map((stat, i) => (
                                <div key={i} className={`${stat.bg} rounded-2xl p-5 flex flex-col gap-3`}>
                                    <span className={`${stat.color}`}>{stat.icon}</span>
                                    <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                                    <span className="text-xs font-semibold text-gray-400">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === "events" && (
                        <div className="flex flex-col gap-3">
                            {org.events.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm py-8">Chưa có sự kiện nào</p>
                            ) : org.events.map(ev => (
                                <div key={ev.id} className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">{ev.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{new Date(ev.date).toLocaleDateString("vi-VN")} · {ev.registrations.toLocaleString()} đăng ký</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap
                                        ${ev.status === "completed" ? "bg-green-50 text-green-600" :
                                          ev.status === "upcoming"  ? "bg-blue-50 text-blue-600" :
                                          ev.status === "ongoing"   ? "bg-amber-50 text-amber-600" :
                                                                       "bg-red-50 text-red-500"}`}>
                                        {ev.status === "completed" ? "Đã kết thúc" :
                                         ev.status === "upcoming"  ? "Sắp diễn ra" :
                                         ev.status === "ongoing"   ? "Đang diễn ra" : "Đã hủy"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === "logs" && (
                        <div className="flex flex-col gap-3">
                            {org.logs.map(log => (
                                <div key={log.id} className="flex gap-3 items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#0092B8] mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">{log.action}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {log.performedBy} · {new Date(log.timestamp).toLocaleString("vi-VN")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-white rounded-xl transition-colors">
                        Đóng
                    </button>
                    {org.status !== "Blocked" ? (
                        <button onClick={() => { onClose(); onSuspend(org.id); }}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-sm">
                            <ShieldOff size={15} />
                            Khóa tổ chức
                        </button>
                    ) : (
                        <button onClick={() => { onUnlock(org.id); }}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-sm">
                            <CheckCircle2 size={15} />
                            Mở khóa tổ chức
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────
export default function OrgList({ filter }: OrgListProps) {
    const [data, setData] = useState<OrganizationItem[]>(MockOrganizations);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [detailOrg, setDetailOrg] = useState<OrganizationItem | null>(null);

    // Suspend Modal State
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
    const [suspendTargetId, setSuspendTargetId] = useState<string | null>(null); // null means bulk
    const [suspendReason, setSuspendReason] = useState("");
    const [suspendDuration, setSuspendDuration] = useState(30);

    // ── Filtered data ───────────────────────────────────────────────
    const filtered = useMemo(() => {
        return data.filter(org => {
            const search = filter?.search?.toLowerCase() || "";
            const matchSearch = !search
                || org.name.toLowerCase().includes(search)
                || org.email.toLowerCase().includes(search)
                || org.unit.toLowerCase().includes(search);

            const typeFilter = filter?.filter1 || "";
            const matchType = !typeFilter || org.type === typeFilter;

            const statusFilter = filter?.filter2 || "";
            const matchStatus = !statusFilter || org.status === statusFilter;

            const dateFilter = filter?.date || "";
            const matchDate = !dateFilter || org.createdDate.startsWith(dateFilter);

            return matchSearch && matchType && matchStatus && matchDate;
        });
    }, [data, filter]);

    useEffect(() => { setCurrentPage(1); }, [filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // ── Actions ─────────────────────────────────────────────────────
    const openSuspendModal = (id?: string) => {
        setSuspendTargetId(id || null);
        setSuspendReason("");
        setSuspendDuration(30);
        setIsSuspendModalOpen(true);
    };

    const confirmSuspend = () => {
        if (!suspendReason.trim()) return;
        
        const targets = suspendTargetId ? [suspendTargetId] : selectedIds;
        
        // TODO: call POST /api/admin/bulk-suspend { entityType: "ORG", entityIds: targets, reason: suspendReason, durationDays: suspendDuration }
        
        setData(prev => prev.map(o =>
            targets.includes(o.id) ? { ...o, status: "Blocked" as OrgStatus } : o
        ));
        
        if (suspendTargetId && detailOrg?.id === suspendTargetId) {
            setDetailOrg({ ...detailOrg, status: "Blocked" as OrgStatus });
        }
        
        if (!suspendTargetId) {
            setSelectedIds([]);
        }
        
        setIsSuspendModalOpen(false);
    };

    const handleUnlock = (id: string) => {
        // TODO: call POST /api/admin/unlock { entityType: "ORG", entityId: id }
        setData(prev => prev.map(o => o.id === id ? { ...o, status: "Active" as OrgStatus } : o));
        if (detailOrg?.id === id) {
            setDetailOrg({ ...detailOrg, status: "Active" as OrgStatus });
        }
    };

    const toggleSelect = (id: string) =>
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

    const toggleSelectAll = () =>
        setSelectedIds(selectedIds.length === paginated.length ? [] : paginated.map(o => o.id));

    return (
        <div className="flex flex-col gap-4">
            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-[#0092B8] text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-md animate-[fadeSlideUp_0.2s_ease]">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <CheckSquare2 size={17} />
                        Đã chọn <span className="font-black text-base">{selectedIds.length}</span> tổ chức
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => openSuspendModal()}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-xl text-sm font-semibold transition-colors">
                            <ShieldOff size={15} /> Khóa tài khoản
                        </button>
                        <button onClick={() => setSelectedIds([])} className="p-2 hover:bg-white/15 rounded-xl transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50/50 rounded-xl">
                            <Building2 size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Danh sách tổ chức ({filtered.length})</h3>
                            <p className="text-sm text-gray-400 font-medium">Quản lý tất cả tổ chức trong hệ thống</p>
                        </div>
                    </div>
                    <button onClick={toggleSelectAll}
                        className="text-xs font-semibold text-gray-400 hover:text-[#0092B8] transition-colors flex items-center gap-1.5">
                        <CheckSquare2 size={14} />
                        {selectedIds.length === paginated.length && paginated.length > 0 ? "Bỏ chọn tất cả" : "Chọn trang này"}
                    </button>
                </div>

                {/* Scrollable table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50">
                                {["", "Tổ chức", "Loại", "Đơn vị", "Sự kiện", "Thành viên", "Trạng thái", "Xác thực", "Hành động"].map((h, i) => (
                                    <th key={i} className={`px-5 py-5 text-sm font-bold text-gray-400 ${i > 3 ? "text-center" : "text-left"}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length > 0 ? paginated.map(org => {
                                const typeStyle = getOrgTypeStyles(org.type);
                                const verStyle  = getVerificationStyles(org.verificationStatus);
                                return (
                                    <tr key={org.id}
                                        className={`group border-b border-gray-50 last:border-0 transition-colors ${selectedIds.includes(org.id) ? "bg-blue-50/40" : "hover:bg-gray-50/50"}`}>
                                        <td className="px-5 py-4 text-center">
                                            <input type="checkbox" checked={selectedIds.includes(org.id)}
                                                onChange={() => toggleSelect(org.id)}
                                                className="w-4 h-4 rounded accent-[#0092B8] cursor-pointer" />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={org.logoUrl} alt={org.name} className="w-10 h-10 rounded-xl border border-gray-100 object-cover" />
                                                <div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm font-bold text-gray-800 max-w-[140px] truncate block">{org.name}</span>
                                                        {org.isVerified && <CheckCircle2 size={13} className="text-[#0092B8] shrink-0" />}
                                                    </div>
                                                    <span className="text-xs text-gray-400 truncate max-w-[140px] block">{org.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap ${typeStyle.color}`}>{typeStyle.label}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-gray-500 font-medium max-w-[160px] truncate block">{org.unit}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="text-sm font-bold text-gray-600">{org.eventCount}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="text-sm font-bold text-gray-600">{org.memberCount}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            {org.status === "Active"
                                                ? <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-xl whitespace-nowrap">Hoạt động</span>
                                                : <span className="inline-block px-4 py-1.5 bg-red-50 text-red-500 text-[10px] font-bold rounded-xl whitespace-nowrap">Đã khóa</span>}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1.5 text-[10px] font-bold rounded-xl whitespace-nowrap ${verStyle.color}`}>{verStyle.label}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => setDetailOrg(org)} title="Xem chi tiết"
                                                    className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-xl transition-all">
                                                    <Eye size={17} />
                                                </button>
                                                {org.status !== "Blocked" ? (
                                                    <button onClick={() => openSuspendModal(org.id)} title="Khóa tổ chức"
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                        <ShieldOff size={17} />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleUnlock(org.id)} title="Mở khóa tổ chức"
                                                        className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all">
                                                        <CheckCircle2 size={17} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-400 font-medium">
                                        Không tìm thấy tổ chức phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span>Hiển thị <span className="text-gray-700 font-bold">{paginated.length}</span> / <span className="text-gray-700 font-bold">{filtered.length}</span> tổ chức</span>
                    <div className="flex items-center gap-1.5">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40">Trước</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setCurrentPage(p)}
                                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${p === currentPage ? "bg-[#0092B8] text-white border border-[#0092B8]" : "border border-gray-200 hover:bg-white"}`}>{p}</button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40">Sau</button>
                    </div>
                </div>
            </div>

            {/* Detail Panel */}
            {detailOrg && (
                <OrgDetailPanel
                    org={detailOrg}
                    onClose={() => setDetailOrg(null)}
                    onSuspend={(id) => openSuspendModal(id)}
                    onUnlock={(id) => handleUnlock(id)}
                />
            )}

            {/* Suspend Modal */}
            {isSuspendModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSuspendModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                        <div className="flex flex-col gap-4 bg-red-50 p-6">
                            <h4 className="font-bold text-red-600 text-lg flex items-center gap-2">
                                <ShieldOff size={20} /> Xác nhận khóa tổ chức
                            </h4>
                            <p className="text-sm text-red-500/80">Bạn đang chuẩn bị khóa tài khoản tổ chức. Tổ chức sẽ không thể đăng nhập hoặc tạo sự kiện mới trong thời gian bị khóa.</p>
                        </div>
                        <div className="p-6 flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Thời gian khóa (ngày) <span className="text-red-500">*</span></label>
                                <input type="number" min="1" value={suspendDuration} onChange={e => setSuspendDuration(Number(e.target.value))} className="border border-red-200 rounded-xl px-4 py-3 text-base font-bold outline-none focus:border-red-500" />
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Lý do khóa <span className="text-red-500">*</span></label>
                                <textarea rows={3} value={suspendReason} onChange={e => setSuspendReason(e.target.value)} placeholder="Nhập lý do khóa tổ chức chi tiết..." className="border border-red-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 resize-none" />
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                                <button onClick={() => setIsSuspendModalOpen(false)} className="flex-1 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                    Hủy
                                </button>
                                <button 
                                    onClick={confirmSuspend} 
                                    disabled={!suspendReason.trim() || suspendDuration <= 0}
                                    className="flex-1 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                    Xác nhận Khóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
