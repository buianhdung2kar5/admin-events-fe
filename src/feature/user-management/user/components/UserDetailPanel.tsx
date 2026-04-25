import { useState } from "react";
import {
    X, User, Coins, Trophy, History, FileCheck, ActivitySquare,
    Mail, Phone, Building2, Calendar, ExternalLink,
    TrendingUp, TrendingDown, SlidersHorizontal,
    CheckCircle, Clock, XCircle, Globe, ShieldOff
} from "lucide-react";
import { UserItem, getRoleDetails, getRankStyle } from "../data/UserMockData";

interface Props {
    user: UserItem;
    onClose: () => void;
    onSuspend: (id: string) => void;
    onUnlock: (id: string) => void;
}

type Tab = "profile" | "coin" | "events" | "reports" | "documents" | "logs";

const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "profile",   label: "Hồ sơ",      icon: User },
    { key: "coin",      label: "Coin",        icon: Coins },
    { key: "events",    label: "Sự kiện",     icon: History },
    { key: "reports",   label: "Khiếu nại",   icon: ActivitySquare },
    { key: "documents", label: "Tài liệu",    icon: FileCheck },
    { key: "logs",      label: "Hoạt động",   icon: ActivitySquare },
];

export default function UserDetailPanel({ user, onClose, onSuspend, onUnlock }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const role   = getRoleDetails(user.role);
    const rank   = getRankStyle(user.rank);

    const statusConfig = {
        Active:  { label: "Hoạt động", bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200" },
        Pending: { label: "Chờ duyệt", bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200" },
        Blocked: { label: "Bị khóa",   bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200" },
    };
    const sc = statusConfig[user.status];

    const portfolioIcon = (type: string) => {
        if (type === "github")   return <ExternalLink size={14} />;
        if (type === "linkedin") return <ExternalLink size={14} />;
        return <Globe size={14} />;
    };

    const eventStatusBadge = (status: string) => {
        if (status === "Completed") return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">Hoàn thành</span>;
        if (status === "Upcoming")  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Sắp diễn ra</span>;
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500">Đã hủy</span>;
    };

    const docStatusBadge = (status: string) => {
        if (status === "Approved") return <span className="flex items-center gap-1 text-[10px] font-bold text-green-600"><CheckCircle size={12} /> Đã duyệt</span>;
        if (status === "Pending")  return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600"><Clock size={12} /> Chờ duyệt</span>;
        return <span className="flex items-center gap-1 text-[10px] font-bold text-red-500"><XCircle size={12} /> Từ chối</span>;
    };

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative w-full max-w-xl bg-white h-full flex flex-col shadow-2xl animate-[slideInRight_0.25s_ease]">
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-800">Chi tiết người dùng</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                {/* ── User Identity Card ── */}
                <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-50 bg-gray-50/50">
                    <img src={user.avatarUrl} alt={user.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow" />
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold ${role.color}`}>
                                {role.icon} {role.label}
                            </span>
                            <span style={{ color: rank.color, backgroundColor: rank.bg }}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-lg">
                                {rank.label}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${sc.bg} ${sc.text} ${sc.border}`}>
                                {sc.label}
                            </span>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-lg font-black text-amber-500">{user.coinBalance.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400">🪙 Coin</p>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex border-b border-gray-100 px-6 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${
                                    activeTab === tab.key
                                        ? "border-[#0092B8] text-[#0092B8]"
                                        : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                <Icon size={14} /> {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* ── Tab Content ── */}
                <div className="flex-1 overflow-y-auto px-6 py-4">

                    {/* PROFILE */}
                    {activeTab === "profile" && (
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: <Mail size={14} />,      label: "Email",        value: user.email },
                                    { icon: <Phone size={14} />,     label: "Điện thoại",   value: user.phone },
                                    { icon: <Building2 size={14} />, label: "Tổ chức",      value: user.organization },
                                    { icon: <Calendar size={14} />,  label: "Ngày tham gia",value: new Date(user.joinedDate).toLocaleDateString("vi-VN") },
                                ].map((item, i) => (
                                    <div key={i} className="bg-gray-50 rounded-xl p-3">
                                        <div className="flex items-center gap-1.5 text-gray-400 mb-1">{item.icon}<span className="text-[10px] font-semibold uppercase tracking-wide">{item.label}</span></div>
                                        <p className="text-sm font-semibold text-gray-700 truncate">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            {user.bio && (
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Giới thiệu</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">{user.bio}</p>
                                </div>
                            )}
                            {user.portfolios.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Portfolios</p>
                                    <div className="flex flex-col gap-2">
                                        {user.portfolios.map((p) => (
                                            <a key={p.id} href={p.url} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm font-medium text-gray-700">
                                                {portfolioIcon(p.type)}
                                                <span className="truncate">{p.url}</span>
                                                <ExternalLink size={12} className="ml-auto flex-shrink-0 text-gray-400" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* COIN */}
                    {activeTab === "coin" && (
                        <div className="flex flex-col gap-4">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl p-4 text-white">
                                <p className="text-xs font-semibold opacity-80 mb-1">Tổng số dư Coin</p>
                                <p className="text-3xl font-black">{user.coinBalance.toLocaleString()} 🪙</p>
                            </div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Lịch sử giao dịch</p>
                            {user.coinHistory.length === 0
                                ? <p className="text-sm text-gray-400 text-center py-6">Chưa có giao dịch nào</p>
                                : user.coinHistory.map((tx) => (
                                    <div key={tx.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                                        <div className={`p-2 rounded-xl flex-shrink-0 ${tx.amount > 0 ? "bg-green-50" : "bg-red-50"}`}>
                                            {tx.amount > 0
                                                ? <TrendingUp size={16} className="text-green-500" />
                                                : <TrendingDown size={16} className="text-red-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-700 truncate">{tx.description}</p>
                                            <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString("vi-VN")}</p>
                                        </div>
                                        <span className={`text-sm font-bold flex-shrink-0 ${tx.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount} 🪙
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* EVENTS */}
                    {activeTab === "events" && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-[#0092B8]">{user.eventCount}</span>
                                <span className="text-sm text-gray-400">sự kiện đã tham gia</span>
                            </div>
                            {user.eventHistory.length === 0
                                ? <p className="text-sm text-gray-400 text-center py-6">Chưa tham gia sự kiện nào</p>
                                : user.eventHistory.map((ev) => (
                                    <div key={ev.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="w-9 h-9 rounded-xl bg-[#EFF9FC] flex items-center justify-center flex-shrink-0">
                                            <History size={16} className="text-[#0092B8]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{ev.eventName}</p>
                                            <p className="text-xs text-gray-400">{ev.role} · {new Date(ev.date).toLocaleDateString("vi-VN")}</p>
                                        </div>
                                        {eventStatusBadge(ev.status)}
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* REPORTS */}
                    {activeTab === "reports" && (
                        <div className="flex flex-col gap-3">
                            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
                                <ActivitySquare className="text-red-500 mt-0.5" size={20} />
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-bold text-red-600 text-sm">Báo cáo vi phạm</h4>
                                    <p className="text-xs text-red-500">Các báo cáo liên quan đến người dùng này trong hệ thống.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">Không có khiếu nại nào liên quan đến người dùng này.</p>
                            </div>
                        </div>
                    )}

                    {/* DOCUMENTS */}
                    {activeTab === "documents" && (
                        <div className="flex flex-col gap-3">
                            {user.verifyDocuments.length === 0
                                ? <p className="text-sm text-gray-400 text-center py-6">Chưa có tài liệu nào</p>
                                : user.verifyDocuments.map((doc) => (
                                    <div key={doc.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <FileCheck size={16} className="text-blue-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800">{doc.label}</p>
                                            <p className="text-xs text-gray-400">Nộp ngày {new Date(doc.uploadedAt).toLocaleDateString("vi-VN")}</p>
                                        </div>
                                        {docStatusBadge(doc.status)}
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* LOGS */}
                    {activeTab === "logs" && (
                        <div className="flex flex-col gap-2">
                            {user.actionLogs.length === 0
                                ? <p className="text-sm text-gray-400 text-center py-6">Không có lịch sử hoạt động</p>
                                : user.actionLogs.map((log) => (
                                    <div key={log.id} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                                        <div className="w-2 h-2 rounded-full bg-[#0092B8] mt-1.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800">{log.action}</p>
                                            <p className="text-xs text-gray-500">{log.detail}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                {new Date(log.timestamp).toLocaleString("vi-VN")} · IP: {log.ip}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-white rounded-xl transition-colors">
                        Đóng
                    </button>
                    {user.status !== "Blocked" ? (
                        <button onClick={() => { onClose(); onSuspend(user.id); }}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-sm">
                            <ShieldOff size={15} />
                            Khóa tài khoản
                        </button>
                    ) : (
                        <button onClick={() => { onUnlock(user.id); }}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-sm">
                            <CheckCircle size={15} />
                            Mở khóa tài khoản
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
