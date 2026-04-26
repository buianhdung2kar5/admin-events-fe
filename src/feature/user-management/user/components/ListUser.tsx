import { useState, useMemo, useEffect } from 'react';
import {
    Users, Trash2, Eye, Coins,
    ShieldOff, CheckSquare2, X, ShieldCheck
} from 'lucide-react';
import { MockUsers, UserItem, getRoleDetails, UserRole, UserStatus } from '../data/UserMockData';
import TableData, { Column } from '../../../../components/TableData';
import UserDetailPanel from './UserDetailPanel';

// ─── API stubs (comment khi chưa có backend) ───────────────────────
// GET    /api/users                → fetchUsers()
// GET    /api/users/{id}           → fetchUserById(id)
// DELETE /api/users/{id}           → deleteUser(id)
// POST   /api/admin/bulk-suspend   → bulkSuspend(ids)
// GET    /api/finance/coins/balance → getCoinBalance(userId)
// GET    /api/finance/coins/history → getCoinHistory(userId)
// ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

interface ListUserProps {
    filter?: {
        search?: string;
        filter1?: string;
        filter2?: string;
        date?: string;
    };
}

// Chỉ lấy người dùng cá nhân — Organization/Business có module riêng
const USER_ONLY_ROLES: string[] = ["Admin", "Member", "Student"];
const userOnlyData = MockUsers.filter(u => USER_ONLY_ROLES.includes(u.role));

export default function ListUser({ filter }: ListUserProps) {
    // ── State ──────────────────────────────────────────────────────
    const [data, setData] = useState<UserItem[]>(userOnlyData);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [detailUser, setDetailUser] = useState<UserItem | null>(null);

    // Suspend Modal State
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
    const [suspendTargetId, setSuspendTargetId] = useState<string | null>(null); // null means bulk
    const [suspendReason, setSuspendReason] = useState("");
    const [suspendDuration, setSuspendDuration] = useState(30);

    // ── Filtered data ──────────────────────────────────────────────
    const filtered = useMemo(() => {
        return data.filter((u) => {
            const search = filter?.search?.toLowerCase() || "";
            const matchSearch = !search
                || u.name.toLowerCase().includes(search)
                || u.email.toLowerCase().includes(search)
                || u.organization.toLowerCase().includes(search);
            
            const roleFilter = filter?.filter1 || "";
            const matchRole = !roleFilter || u.role === roleFilter;

            const statusFilter = filter?.filter2 || "";
            const matchStatus = !statusFilter || u.status === statusFilter;

            const dateFilter = filter?.date || "";
            const matchDate = !dateFilter || u.joinedDate.startsWith(dateFilter);

            return matchSearch && matchRole && matchStatus && matchDate;
        });
    }, [data, filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    // ── Actions ────────────────────────────────────────────────────
    const openSuspendModal = (id?: string) => {
        setSuspendTargetId(id || null);
        setSuspendReason("");
        setSuspendDuration(30);
        setIsSuspendModalOpen(true);
    };

    const confirmSuspend = () => {
        if (!suspendReason.trim()) return;
        
        const targets = suspendTargetId ? [suspendTargetId] : selectedIds;
        
        // TODO: call POST /api/admin/bulk-suspend { entityType: "USER", entityIds: targets, reason: suspendReason, durationDays: suspendDuration }
        
        setData((prev) =>
            prev.map((u) =>
                targets.includes(u.id) ? { ...u, status: "Blocked" as UserStatus } : u
            )
        );
        if (suspendTargetId && detailUser?.id === suspendTargetId) {
            setDetailUser({ ...detailUser, status: "Blocked" });
        }
        
        if (!suspendTargetId) {
            setSelectedIds([]);
        }
        
        setIsSuspendModalOpen(false);
    };

    const handleUnlock = (id: string) => {
        // TODO: call POST /api/admin/unlock { entityType: "USER", entityId: id }
        setData((prev) => prev.map((u) => u.id === id ? { ...u, status: "Active" as UserStatus } : u));
        if (detailUser?.id === id) {
            setDetailUser({ ...detailUser, status: "Active" as UserStatus });
        }
    };

    const toggleSelect = (id: string) =>
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );

    const toggleSelectAll = () =>
        setSelectedIds(
            selectedIds.length === paginated.length ? [] : paginated.map((u) => u.id)
        );

    // ── Table columns ──────────────────────────────────────────────
    const columns: Column<UserItem>[] = [
        {
            header: "",
            align: "center",
            render: (user) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="w-4 h-4 accent-[#0092B8] cursor-pointer"
                />
            ),
        },
        {
            header: "Người dùng",
            render: (user) => (
                <div className="flex items-center gap-3">
                    <img src={user.avatarUrl} alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-800 truncate leading-tight">{user.name}</span>
                        <span className="text-xs text-gray-400 truncate">{user.email}</span>
                    </div>
                </div>
            ),
        },
        {
            header: "Vai trò",
            render: (user) => {
                const role = getRoleDetails(user.role);
                return (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap ${role.color}`}>
                        {role.icon} {role.label}
                    </div>
                );
            },
        },
        {
            header: "Tổ chức",
            render: (user) => (
                <span className="text-sm text-gray-600 font-medium max-w-[200px] truncate block">
                    {user.organization || "—"}
                </span>
            ),
        },
        {
            header: "Trạng thái",
            align: "center",
            render: (user) => {
                const cfg = {
                    Active:  "bg-[#4BBDD3] text-white",
                    Pending: "bg-amber-400 text-white",
                    Blocked: "bg-red-500 text-white",
                }[user.status] || "";
                const lbl = { Active: "Hoạt động", Pending: "Chờ duyệt", Blocked: "Bị khóa" }[user.status];
                return <span className={`inline-block px-4 py-1.5 text-[10px] font-bold rounded-xl whitespace-nowrap ${cfg}`}>{lbl}</span>;
            },
        },
        {
            header: "Coin",
            align: "center",
            render: (user) => (
                <span className="text-sm font-bold text-amber-500">{user.coinBalance.toLocaleString()}</span>
            ),
        },
        {
            header: "Sự kiện",
            align: "center",
            render: (user) => (
                <span className="text-sm font-bold text-gray-600 ">{user.eventCount}</span>
            ),
        },
        {
            header: "Ngày tham gia",
            render: (user) => (
                <span className="text-sm text-gray-400 font-medium">
                    {new Date(user.joinedDate).toLocaleDateString("vi-VN")}
                </span>
            ),
        },
        {
            header: "Hành động",
            align: "center",
            render: (user) => (
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                    <button
                        title="Xem chi tiết"
                        onClick={() => setDetailUser(user)}
                        className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <Eye size={17} />
                    </button>
                    {user.status !== "Blocked" ? (
                        <button
                            title="Khóa tài khoản"
                            onClick={() => openSuspendModal(user.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <ShieldOff size={17} />
                        </button>
                    ) : (
                        <button
                            title="Mở khóa tài khoản"
                            onClick={() => handleUnlock(user.id)}
                            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
                        >
                            <ShieldCheck size={17} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-4">


            {/* ── Bulk Action Bar ── */}
            {selectedIds.length > 0 && (
                <div className="bg-[#0092B8] text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-md animate-[fadeSlideUp_0.2s_ease]">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <CheckSquare2 size={17} />
                        Đã chọn <span className="font-black text-base">{selectedIds.length}</span> người dùng
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => openSuspendModal()}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-xl text-sm font-semibold transition-colors">
                            <ShieldOff size={15} /> Khóa tài khoản
                        </button>
                        <button onClick={() => setSelectedIds([])}
                            className="p-2 hover:bg-white/15 rounded-xl transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50/50 rounded-xl">
                            <Users size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Danh sách người dùng ({filtered.length})
                            </h3>
                            <p className="text-sm text-gray-400 font-medium">Quản lý tất cả người dùng trong hệ thống</p>
                        </div>
                    </div>
                    {/* Select all on page */}
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
                                {columns.map((col, idx) => (
                                    <th key={idx}
                                        className={`px-6 py-5 text-sm font-bold text-gray-400 ${col.align === "center" ? "text-center" : "text-left"}`}>
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length > 0 ? paginated.map((user, idx) => (
                                <tr key={user.id}
                                    className={`group border-b border-gray-50 last:border-0 transition-colors ${selectedIds.includes(user.id) ? "bg-blue-50/40" : "hover:bg-gray-50/50"}`}>
                                    {columns.map((col, cIdx) => (
                                        <td key={cIdx}
                                            className={`px-6 py-4 ${col.align === "center" ? "text-center" : "text-left"}`}>
                                            {col.render(user)}
                                        </td>
                                    ))}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium">
                                        Không tìm thấy người dùng phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span>
                        Hiển thị <span className="text-gray-700 font-bold">{paginated.length}</span> / <span className="text-gray-700 font-bold">{filtered.length}</span> bản ghi
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40">
                            Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button key={p} onClick={() => setCurrentPage(p)}
                                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${p === currentPage ? "bg-[#0092B8] text-white border border-[#0092B8]" : "border border-gray-200 hover:bg-white"}`}>
                                {p}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40">
                            Sau
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Detail Panel ── */}
            {detailUser && (
                <UserDetailPanel
                    user={detailUser}
                    onClose={() => setDetailUser(null)}
                    onSuspend={() => openSuspendModal(detailUser.id)}
                    onUnlock={() => handleUnlock(detailUser.id)}
                />
            )}

            {/* ── Suspend Modal ── */}
            {isSuspendModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSuspendModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                        <div className="flex flex-col gap-4 bg-red-50 p-6">
                            <h4 className="font-bold text-red-600 text-lg flex items-center gap-2">
                                <ShieldOff size={20} /> Xác nhận khóa tài khoản
                            </h4>
                            <p className="text-sm text-red-500/80">Bạn đang chuẩn bị khóa tài khoản người dùng. Người dùng sẽ không thể đăng nhập hoặc tham gia sự kiện trong thời gian bị khóa.</p>
                        </div>
                        <div className="p-6 flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Thời gian khóa (ngày) <span className="text-red-500">*</span></label>
                                <input type="number" min="1" value={suspendDuration} onChange={e => setSuspendDuration(Number(e.target.value))} className="border border-red-200 rounded-xl px-4 py-3 text-base font-bold outline-none focus:border-red-500" />
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Lý do khóa <span className="text-red-500">*</span></label>
                                <textarea rows={3} value={suspendReason} onChange={e => setSuspendReason(e.target.value)} placeholder="Nhập lý do khóa tài khoản chi tiết..." className="border border-red-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 resize-none" />
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
