import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Eye,
    ShieldOff, ShieldCheck, FileWarning, Loader2, CheckSquare2, X
} from 'lucide-react';
import { ListUserInterface, getRoleDetails, UserStatus } from '../data/UserMockData';
import { Column } from '../../../../components/TableData';
import UserApi from '../../../../services/user-management/UserApi';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SystemManagementApi } from '../../../../services/system-management/SystemManagementApi';
import Toast from '../../../../components/common/Toast';
const PAGE_SIZE = 5;

interface ListUserProps {
    filter?: {
        search?: string;
        filter1?: string;
        filter2?: string;
        date?: string;
    };
}

export default function ListUser({ filter }: ListUserProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
    const [suspendTargetId, setSuspendTargetId] = useState<string | null>(null);
    const [suspendAction, setSuspendAction] = useState<"SUSPEND" | "UNSUSPEND">("SUSPEND");
    const [isActioning, setIsActioning] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const notify = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    }; 

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    const { data: queryData, isLoading } = useQuery({
        queryKey: ['users_list', currentPage, filter],
        queryFn: async () => {
            const search = filter?.search || undefined;
            const role = filter?.filter1 || undefined;
            const status = filter?.filter2 || undefined;
            
            const res = await UserApi.getAllUsers(
                currentPage - 1,
                PAGE_SIZE,
                search,
                'createdTime',
                'desc',
                role,
                status
            );
            if (res.statusCode !== 200) {
                throw new Error(res.message || 'Failed to fetch users');    
            } else {
                const responseData = res.object || {};
                const fetchedData: any[] = responseData.content || [];
                const total = responseData.totalElements || 0;
                const totalPagesCount = responseData.totalPages || 1;
                const mappedData: ListUserInterface[] = fetchedData.map((item: any) => ({
                    userId: item.userId?.toString() || item.id?.toString() || "",
                    fullName: item.fullName || item.name || "Chưa cập nhật",
                    role: item.role || "USER",
                    status: item.status || "ACTIVE",
                    avatarUrl: item.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.fullName || item.userId || 'User'}`,
                    createdTime: item.joinedAt || item.createdTime || new Date().toISOString()
                }));
                return { data: mappedData, totalRecords: total, totalPages: totalPagesCount };
            }
    }
    });

    const paginated = queryData?.data || [];
    const totalRecords = queryData?.totalRecords || 0;
    const totalPages = queryData?.totalPages || 1;
    const selectedUsers = paginated.filter(u => selectedIds.includes(u.userId));
    const allActive   = selectedUsers.length > 0 && selectedUsers.every(u => u.status === "ACTIVE");
    const allDisabled = selectedUsers.length > 0 && selectedUsers.every(u => u.status === "DISABLED");
    const bulkAction  = allActive ? "SUSPEND" : allDisabled ? "UNSUSPEND" : null;

    const openSuspendModal = (action: "SUSPEND" | "UNSUSPEND", id?: string) => {
        setSuspendTargetId(id || null);
        setSuspendAction(action);
        setIsSuspendModalOpen(true);
    };

    const confirmSuspend = async () => {
        const targets = suspendTargetId ? [suspendTargetId] : selectedIds;
        setIsActioning(true);
        try {
            const res = await SystemManagementApi.buldSuspend({
                entityType: "USER",
                action: suspendAction,
                entityIds: targets
            });
            if (res.statusCode !== 200) throw new Error(res.message);
            queryClient.invalidateQueries({ queryKey: ['users_list'] });
            if (!suspendTargetId) setSelectedIds([]);
            setIsSuspendModalOpen(false);
            notify(suspendAction === "SUSPEND" ? "Khóa tài khoản thành công!" : "Mở khóa tài khoản thành công!");
        } catch {
            notify(suspendAction === "SUSPEND" ? "Khóa thất bại. Vui lòng thử lại." : "Mở khóa thất bại. Vui lòng thử lại.", false);
        } finally {
            setIsActioning(false);
        }
    };

    const handleViewReport = (id: string) => {
        // TODO: Implement view report logic or navigate to report page
        alert(`Xem báo cáo cho người dùng: ${id}`);
    };

    const toggleSelect = (id: string) =>
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );

    const toggleSelectAll = () =>
        setSelectedIds(
            selectedIds.length === paginated.length ? [] : paginated.map((u) => u.userId)
        );

    const columns: Column<ListUserInterface>[] = [
        {
            header: "",
            align: "center",
            render: (user) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(user.userId)}
                    onChange={() => toggleSelect(user.userId)}
                    className="w-4 h-4 accent-[#0092B8] cursor-pointer"
                />
            ),
        },
        {
            header: "Người dùng",
            render: (user) => (
                <div className="flex items-center gap-3">
                    <img src={user.avatarUrl} alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-800 truncate leading-tight">{user.fullName}</span>
                        <span className="text-xs text-gray-400 truncate">ID: {user.userId}</span>
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
            header: "Trạng thái",
            align: "center",
            render: (user) => {
                const cfg = {
                    ACTIVE:  "bg-[#4BBDD3] text-white",
                    PENDING: "bg-amber-400 text-white",
                    DISABLED: "bg-red-500 text-white",
                }[user.status] || "";
                const lbl = { ACTIVE: "Hoạt động", PENDING: "Chờ duyệt", DISABLED: "Bị khóa" }[user.status];
                return <span className={`inline-block px-4 py-1.5 text-[10px] font-bold rounded-xl whitespace-nowrap ${cfg}`}>{lbl}</span>;
            },
        },

        {
            header: "Ngày tham gia",
            render: (user) => (
                <span className="text-sm text-gray-400 font-medium">
                    {new Date(user.createdTime || new Date()).toLocaleDateString("vi-VN")}
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
                        onClick={() => {
                            if (user.role === "ORGANIZATION") {
                                navigate(`/user-management/organization/${user.userId}`);
                            } else {
                                navigate(`/user-management/users/${user.userId}`);
                            }
                        }}
                        className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <Eye size={17} />
                    </button>
                    {user.status !== "DISABLED" ? (
                        <button
                            title="Khóa tài khoản"
                            onClick={() => openSuspendModal("SUSPEND", user.userId)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <ShieldOff size={17} />
                        </button>
                    ) : (
                        <button
                            title="Mở khóa tài khoản"
                            onClick={() => openSuspendModal("UNSUSPEND", user.userId)}
                            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
                        >
                            <ShieldCheck size={17} />
                        </button>
                    )}
                    <button
                        title="Xem báo cáo"
                        onClick={() => handleViewReport(user.userId)}
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                    >
                        <FileWarning size={17} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <Toast toast={toast} onClose={() => setToast(null)} />
            {selectedIds.length > 0 && (
                <div className="bg-[#0092B8] text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-md animate-[fadeSlideUp_0.2s_ease]">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <CheckSquare2 size={17} />
                        Đã chọn <span className="font-black text-base">{selectedIds.length}</span> người dùng
                    </div>
                    <div className="flex gap-2">
                        {bulkAction === "SUSPEND" && (
                            <button onClick={() => openSuspendModal("SUSPEND")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-xl text-sm font-semibold transition-colors">
                                <ShieldOff size={15} /> Khóa tài khoản
                            </button>
                        )}
                        {bulkAction === "UNSUSPEND" && (
                            <button onClick={() => openSuspendModal("UNSUSPEND")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-green-500/80 hover:bg-green-500 rounded-xl text-sm font-semibold transition-colors">
                                <ShieldCheck size={15} /> Mở khóa
                            </button>
                        )}
                        {bulkAction === null && selectedIds.length > 0 && (
                            <span className="flex items-center gap-1.5 px-4 py-2 bg-white/20 rounded-xl text-sm font-medium italic">
                                Vui lòng chọn cùng loại trạng thái
                            </span>
                        )}
                        <button onClick={() => setSelectedIds([])}
                            className="p-2 hover:bg-white/15 rounded-xl transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50/50 rounded-xl">
                            <Users size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Danh sách người dùng ({totalRecords})
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="w-8 h-8 text-[#0092B8] animate-spin" />
                                            <span className="text-sm font-medium text-gray-400">Đang tải dữ liệu...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.length > 0 ? paginated.map((user, idx) => (
                                <tr key={user.userId}
                                    className={`group border-b border-gray-50 last:border-0 transition-colors ${selectedIds.includes(user.userId) ? "bg-blue-50/40" : "hover:bg-gray-50/50"}`}>
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
                        Hiển thị <span className="text-gray-700 font-bold">{paginated.length}</span> / <span className="text-gray-700 font-bold">{totalRecords}</span> bản ghi
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
            {isSuspendModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSuspendModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                        <div className={`flex flex-col gap-4 p-6 ${suspendAction === "SUSPEND" ? "bg-red-50" : "bg-green-50"}`}>
                            <h4 className={`font-bold text-lg flex items-center gap-2 ${suspendAction === "SUSPEND" ? "text-red-600" : "text-green-600"}`}>
                                {suspendAction === "SUSPEND"
                                    ? <><ShieldOff size={20} /> Xác nhận khóa tài khoản</>
                                    : <><ShieldCheck size={20} /> Xác nhận mở khóa tài khoản</>
                                }
                            </h4>
                            <p className={`text-sm ${suspendAction === "SUSPEND" ? "text-red-500/80" : "text-green-600/80"}`}>
                                {suspendAction === "SUSPEND"
                                    ? "Xác nhận khóa tài khoản"
                                    : "Xác nhận mở khóa tài khoản"
                                }
                            </p>
                        </div>
                        <div className="p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsSuspendModalOpen(false)}
                                    disabled={isActioning}
                                    className="flex-1 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-40">
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmSuspend}
                                    disabled={isActioning}
                                    className={`flex-1 py-3 text-sm font-bold text-white rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 ${suspendAction === "SUSPEND" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
                                    {isActioning
                                        ? <><Loader2 size={15} className="animate-spin" /> Đang xử lý...</>
                                        : suspendAction === "SUSPEND" ? "Xác nhận Khóa" : "Xác nhận Mở khóa"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
