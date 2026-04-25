import { useState, useMemo } from "react";
import { Search, Filter, AlertTriangle, CheckCircle, Activity, Shield } from "lucide-react";
import { MockActivities, ActivityItem, ActionType } from "../data/ActivityMockData";

const ACTION_LABELS: Record<ActionType, string> = {
    LOGIN: "Đăng nhập",
    LOGOUT: "Đăng xuất",
    CREATE_EVENT: "Tạo sự kiện",
    JOIN_EVENT: "Tham gia sự kiện",
    BUY_TICKET: "Mua vé",
    COIN_EARN: "Nhận coin",
    COIN_SPEND: "Tiêu coin",
    PROFILE_UPDATE: "Cập nhật profile",
    PASSWORD_CHANGE: "Đổi mật khẩu",
    REPORT_SUBMIT: "Gửi báo cáo",
    DOCUMENT_UPLOAD: "Tải tài liệu",
    SUSPEND_ATTEMPT: "Vi phạm / Bị khoá",
};

const getActionColor = (action: ActionType) => {
    switch (action) {
        case "LOGIN": return "bg-blue-50 text-blue-600 border-blue-200";
        case "CREATE_EVENT": return "bg-purple-50 text-purple-600 border-purple-200";
        case "BUY_TICKET": return "bg-green-50 text-green-600 border-green-200";
        case "COIN_EARN": return "bg-amber-50 text-amber-600 border-amber-200";
        case "REPORT_SUBMIT": return "bg-orange-50 text-orange-600 border-orange-200";
        case "SUSPEND_ATTEMPT": return "bg-red-50 text-red-600 border-red-200";
        case "DOCUMENT_UPLOAD": return "bg-teal-50 text-teal-600 border-teal-200";
        default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
};

const getStatusConfig = (status: ActivityItem["status"]) => {
    switch (status) {
        case "SUCCESS": return { label: "Thành công", cls: "bg-green-50 text-green-600 border-green-200", icon: <CheckCircle size={12} /> };
        case "FAILED": return { label: "Thất bại", cls: "bg-gray-50 text-gray-500 border-gray-200", icon: <Shield size={12} /> };
        case "SUSPICIOUS": return { label: "Khả nghi", cls: "bg-red-50 text-red-600 border-red-200", icon: <AlertTriangle size={12} /> };
    }
};

export default function UserActivityLog() {
    const [activities] = useState<ActivityItem[]>(MockActivities);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"ALL" | "SUCCESS" | "FAILED" | "SUSPICIOUS">("ALL");
    const [filterAction, setFilterAction] = useState<ActionType | "ALL">("ALL");

    const filtered = useMemo(() => {
        return activities.filter(a => {
            const matchSearch =
                a.userName.toLowerCase().includes(search.toLowerCase()) ||
                a.userId.toLowerCase().includes(search.toLowerCase()) ||
                a.ipAddress.includes(search) ||
                a.detail.toLowerCase().includes(search.toLowerCase());
            const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
            const matchAction = filterAction === "ALL" || a.action === filterAction;
            return matchSearch && matchStatus && matchAction;
        });
    }, [activities, search, filterStatus, filterAction]);

    const suspiciousCount = activities.filter(a => a.status === "SUSPICIOUS").length;

    const selectCls = "border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 outline-none focus:border-[#0092B8] bg-white cursor-pointer";

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
            {suspiciousCount > 0 && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-5 py-4">
                    <AlertTriangle size={20} className="text-red-500 shrink-0" />
                    <div>
                        <p className="font-bold text-red-700 text-sm">Phát hiện {suspiciousCount} hoạt động khả nghi</p>
                        <p className="text-xs text-red-500">Kiểm tra các dòng được đánh dấu đỏ bên dưới.</p>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#0092B8] transition-all flex-1">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm theo tên user, IP, mô tả hoạt động..."
                        className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className={selectCls}>
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="SUCCESS">Thành công</option>
                        <option value="FAILED">Thất bại</option>
                        <option value="SUSPICIOUS">Khả nghi ⚠️</option>
                    </select>
                    <select value={filterAction} onChange={e => setFilterAction(e.target.value as any)} className={selectCls}>
                        <option value="ALL">Tất cả hành động</option>
                        {Object.entries(ACTION_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Thời gian</th>
                                <th className="px-6 py-4">Người dùng</th>
                                <th className="px-6 py-4">Hành động</th>
                                <th className="px-6 py-4">Chi tiết</th>
                                <th className="px-6 py-4">IP / Thiết bị</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                                        Không có hoạt động nào phù hợp
                                    </td>
                                </tr>
                            ) : filtered.map(act => {
                                const statusCfg = getStatusConfig(act.status);
                                return (
                                    <tr key={act.id}
                                        className={`hover:bg-gray-50/80 transition-colors ${act.status === "SUSPICIOUS" ? "bg-red-50/30" : ""}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {act.status === "SUSPICIOUS" && <AlertTriangle size={13} className="text-red-500 shrink-0" />}
                                                <span className="text-gray-500 text-xs whitespace-nowrap">
                                                    {new Date(act.createdAt).toLocaleString("vi-VN")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800">{act.userName}</p>
                                            <p className="text-xs text-gray-400">{act.userId}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-bold border ${getActionColor(act.action)}`}>
                                                {ACTION_LABELS[act.action]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-gray-600 max-w-[260px] line-clamp-2">{act.detail}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-xs text-gray-700">{act.ipAddress}</p>
                                            <p className="text-[10px] text-gray-400">{act.device}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${statusCfg.cls}`}>
                                                {statusCfg.icon}
                                                {statusCfg.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
