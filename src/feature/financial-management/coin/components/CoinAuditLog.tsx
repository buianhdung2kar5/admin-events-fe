import { useState, useMemo } from "react";
import { Search, TrendingUp, TrendingDown, Coins, AlertCircle } from "lucide-react";
import { MockCoinAudit, CoinAuditItem, CoinReferenceType } from "../data/CoinAuditMockData";

const REF_LABELS: Record<CoinReferenceType, string> = {
    ADMIN_ADJUST: "Admin điều chỉnh",
    NEWS_READ: "Đọc tin tức",
    EVENT_ATTEND: "Tham gia sự kiện",
    TICKET_REFUND: "Hoàn tiền vé",
    PURCHASE: "Mua gói / Vé",
};

const getRefColor = (type: CoinReferenceType) => {
    switch (type) {
        case "ADMIN_ADJUST": return "bg-purple-50 text-purple-600 border-purple-200";
        case "NEWS_READ": return "bg-blue-50 text-blue-600 border-blue-200";
        case "EVENT_ATTEND": return "bg-green-50 text-green-600 border-green-200";
        case "TICKET_REFUND": return "bg-amber-50 text-amber-600 border-amber-200";
        case "PURCHASE": return "bg-red-50 text-red-600 border-red-200";
    }
};

export default function CoinAuditLog() {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<CoinReferenceType | "ALL">("ALL");
    const [filterDir, setFilterDir] = useState<"ALL" | "plus" | "minus">("ALL");

    const filtered = useMemo(() => {
        return MockCoinAudit.filter(a => {
            const matchSearch =
                a.userName.toLowerCase().includes(search.toLowerCase()) ||
                a.userId.toLowerCase().includes(search.toLowerCase()) ||
                a.reason.toLowerCase().includes(search.toLowerCase());
            const matchType = filterType === "ALL" || a.referenceType === filterType;
            const matchDir = filterDir === "ALL" || (filterDir === "plus" ? a.amount > 0 : a.amount < 0);
            return matchSearch && matchType && matchDir;
        });
    }, [search, filterType, filterDir]);

    const adminAdjustCount = MockCoinAudit.filter(a => a.referenceType === "ADMIN_ADJUST").length;
    const totalAdminGiven = MockCoinAudit
        .filter(a => a.referenceType === "ADMIN_ADJUST" && a.amount > 0)
        .reduce((acc, a) => acc + a.amount, 0);
    const totalAdminDeducted = MockCoinAudit
        .filter(a => a.referenceType === "ADMIN_ADJUST" && a.amount < 0)
        .reduce((acc, a) => acc + Math.abs(a.amount), 0);

    const selectCls = "border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 outline-none focus:border-[#0092B8] bg-white cursor-pointer";

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
            {/* Summary Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Lần Admin điều chỉnh", value: adminAdjustCount, icon: <AlertCircle size={18} className="text-purple-500" />, cls: "text-purple-600" },
                    { label: "Tổng coin cộng (Admin)", value: `+${totalAdminGiven.toLocaleString()}`, icon: <TrendingUp size={18} className="text-green-500" />, cls: "text-green-600" },
                    { label: "Tổng coin trừ (Admin)", value: `-${totalAdminDeducted.toLocaleString()}`, icon: <TrendingDown size={18} className="text-red-500" />, cls: "text-red-600" },
                ].map((s, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
                        <div className="p-2.5 bg-gray-50 rounded-xl">{s.icon}</div>
                        <div>
                            <p className={`text-xl font-bold ${s.cls} tabular-nums`}>{s.value}</p>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#0092B8] transition-all flex-1">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm theo tên user, ID, lý do..."
                        className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400" />
                </div>
                <div className="flex gap-2">
                    <select value={filterType} onChange={e => setFilterType(e.target.value as any)} className={selectCls}>
                        <option value="ALL">Tất cả nguồn</option>
                        {Object.entries(REF_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <select value={filterDir} onChange={e => setFilterDir(e.target.value as any)} className={selectCls}>
                        <option value="ALL">Cộng & Trừ</option>
                        <option value="plus">Chỉ cộng coin ▲</option>
                        <option value="minus">Chỉ trừ coin ▼</option>
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
                                <th className="px-6 py-4 text-center">Thay đổi</th>
                                <th className="px-6 py-4 text-center">Số dư sau</th>
                                <th className="px-6 py-4">Nguồn</th>
                                <th className="px-6 py-4">Lý do / Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">Không có dữ liệu</td></tr>
                            ) : filtered.map(item => (
                                <tr key={item.id} className={`hover:bg-gray-50/80 transition-colors ${item.referenceType === "ADMIN_ADJUST" ? "bg-purple-50/20" : ""}`}>
                                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(item.createdAt).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800">{item.userName}</p>
                                        <p className="text-xs text-gray-400">{item.userId}</p>
                                        {item.adminName && (
                                            <p className="text-[10px] text-purple-500 font-bold mt-0.5">by {item.adminName}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold tabular-nums ${item.amount > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                                            {item.amount > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            {item.amount > 0 ? "+" : ""}{item.amount.toLocaleString()}
                                            <Coins size={12} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-bold text-gray-700 tabular-nums">{item.balanceAfter.toLocaleString()} 🪙</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-bold border ${getRefColor(item.referenceType)}`}>
                                            {REF_LABELS[item.referenceType]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-gray-600 max-w-[260px]">{item.reason}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
