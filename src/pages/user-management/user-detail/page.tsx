import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import UserApi from "../../../services/user-management/UserApi";
import { useState } from "react";
import {
    ArrowLeft, User, Coins, Trophy, History, FileCheck, ActivitySquare,
    Mail, Phone, Building2, Calendar, ExternalLink,
    TrendingUp, TrendingDown, CheckCircle, Clock, XCircle, Globe, ShieldOff, Pencil, Save, X
} from "lucide-react";
import { getRoleDetails } from "../../../feature/user-management/user/data/UserMockData";

type Tab = "profile" | "coin" | "events" | "reports" | "documents" | "logs";

const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "profile",   label: "Hồ sơ",      icon: User },
    { key: "coin",      label: "Coin",        icon: Coins },
    { key: "events",    label: "Sự kiện",     icon: History },
    { key: "reports",   label: "Khiếu nại",   icon: ActivitySquare },
    { key: "documents", label: "Tài liệu",    icon: FileCheck },
    { key: "logs",      label: "Hoạt động",   icon: ActivitySquare },
];

export default function UserDetailPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [isEditing, setIsEditing] = useState(false);
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['user_detail', userId],
        queryFn: async () => {
            const res = await UserApi.getUserById(userId!);
            return res.object || res; 
        },
        enabled: !!userId,
    });
    
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 font-medium">Đang tải thông tin người dùng...</div>;
    }

    if (isError || !user) {
        return <div className="p-8 text-center text-red-500 font-medium">Không tìm thấy người dùng!</div>;
    }

    const role   = getRoleDetails(user.role);

    const statusConfig: any = {
        ACTIVE:  { label: "Hoạt động", bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200" },
        PENDING: { label: "Chờ duyệt", bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200" },
        DISABLED: { label: "Bị khóa",   bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200" },
    };
    const sc = statusConfig[user.status] || statusConfig.ACTIVE;

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
        <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12 animate-[fadeIn_0.3s_ease]">
            {/* Header / Back */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Chi tiết người dùng</h1>
                </div>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                                <X size={15} /> Hủy
                            </button>
                            <button
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#0092B8] hover:bg-[#007a9e] rounded-xl transition-colors">
                                <Save size={15} /> Lưu thay đổi
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors">
                            <Pencil size={15} /> Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* User Identity Card */}
                <div className="px-8 py-6 flex items-center gap-6 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-white">
                    <img src={user.userProfile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userProfile?.fullName || user.userId || 'User'}`} alt={user.userProfile?.fullName || user.name}
                        className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md" />
                    <div className="flex-1 min-w-0">
                        <p className="text-2xl font-black text-gray-900 truncate">{user.userProfile?.fullName || user.userProfile?.name}</p>
                        <p className="text-sm text-gray-400 truncate mb-3">{user.email || "Chưa cập nhật email"}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${role.color}`}>
                                {role.icon} {role.label}
                            </span>
                            {user.rank && (
                                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-gray-100 text-gray-700">
                                    {user.rank}
                                </span>
                            )}
                            <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${sc.bg} ${sc.text} ${sc.border}`}>
                                {sc.label}
                            </span>
                        </div>
                    </div>
                    <div className="text-right flex items-center justify-center flex-shrink-0 bg-amber-50 px-6 py-4 rounded-2xl border border-amber-100/50 gap-1">
                        <p className="text-sm text-amber-600/70 font-bold mb-1">Tổng Coin:</p>
                        <p className="text-sm text-amber-600/70 font-bold mb-1">{(user.currentCoin || 0).toLocaleString()}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-8 overflow-x-auto bg-white">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-4 py-4 text-sm font-bold whitespace-nowrap border-b-[3px] transition-all -mb-[1px] ${
                                    activeTab === tab.key
                                        ? "border-[#0092B8] text-[#0092B8]"
                                        : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
                                }`}
                            >
                                <Icon size={16} /> {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-8 bg-white min-h-[400px]">
                    {/* PROFILE */}
                    {activeTab === "profile" && (
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { icon: <Mail size={16} />,      label: "Email",        value: user.email, show: !!user.email },
                                    { icon: <Phone size={16} />,     label: "Điện thoại",   value: user.phoneNumber, show: !!user.phoneNumber },
                                    { icon: <Calendar size={16} />,  label: "Sinh nhật",    value: user.userProfile?.dateOfBirth ? new Date(user.userProfile.dateOfBirth).toLocaleDateString("vi-VN") : null, show: !!user.userProfile?.dateOfBirth },
                                    { icon: <User size={16} />,      label: "Giới tính",    value: user.userProfile?.gender === "NAM" ? "Nam" : user.userProfile?.gender === "NU" ? "Nữ" : user.userProfile?.gender, show: !!user.userProfile?.gender },
                                    { icon: <Building2 size={16} />, label: "Trường Đại học",value: user.userProfile?.university, show: !!user.userProfile?.university },
                                    { icon: <Building2 size={16} />, label: "Khoa",         value: user.userProfile?.faculty, show: !!user.userProfile?.faculty },
                                    { icon: <Building2 size={16} />, label: "Chuyên ngành", value: user.userProfile?.major, show: !!user.userProfile?.major },
                                    { icon: <User size={16} />,      label: "Mã sinh viên", value: user.userProfile?.studentCode, show: !!user.userProfile?.studentCode },
                                    { icon: <Calendar size={16} />,  label: "Ngày tham gia",value: user.createdTime ? new Date(user.createdTime).toLocaleDateString("vi-VN") : "—", show: true },
                                    { icon: <FileCheck size={16} />, label: "Portfolio miễn phí",value: user.remainingFreePortfolios, show: user.remainingFreePortfolios !== undefined && user.remainingFreePortfolios !== null },
                                ].filter(item => item.show).map((item, i) => (
                                    <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                                        <div className="flex items-center gap-2 text-gray-400 mb-2">{item.icon}<span className="text-xs font-bold uppercase tracking-wide">{item.label}</span></div>
                                        <p className="text-base font-semibold text-gray-800 truncate">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            {user.bio && (
                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100/50">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Giới thiệu</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">{user.bio}</p>
                                </div>
                            )}
                            {user.portfolios && user.portfolios.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Portfolios</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {user.portfolios.map((p: any) => (
                                            <a key={p.id} href={p.url} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm font-semibold text-gray-700 border border-gray-100/50">
                                                {portfolioIcon(p.type)}
                                                <span className="truncate">{p.url}</span>
                                                <ExternalLink size={14} className="ml-auto flex-shrink-0 text-gray-400" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* COIN */}
                    {activeTab === "coin" && (
                        <div className="flex flex-col gap-6">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">Lịch sử giao dịch</p>
                            {!user.coinHistory || user.coinHistory.length === 0
                                ? <p className="text-sm text-gray-400 text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">Chưa có giao dịch nào</p>
                                : user.coinHistory.map((tx: any) => (
                                    <div key={tx.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                                        <div className={`p-3 rounded-2xl flex-shrink-0 ${tx.amount > 0 ? "bg-green-50" : "bg-red-50"}`}>
                                            {tx.amount > 0
                                                ? <TrendingUp size={20} className="text-green-500" />
                                                : <TrendingDown size={20} className="text-red-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base font-bold text-gray-800 truncate">{tx.description}</p>
                                            <p className="text-sm text-gray-400">{new Date(tx.date).toLocaleDateString("vi-VN")}</p>
                                        </div>
                                        <span className={`text-lg font-black flex-shrink-0 ${tx.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount} 🪙
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* EVENTS */}
                    {activeTab === "events" && (
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-black text-[#0092B8]">{user.eventCount || 0}</span>
                                <span className="text-base font-medium text-gray-500">sự kiện đã tham gia</span>
                            </div>
                            {!user.eventHistory || user.eventHistory.length === 0
                                ? <p className="text-sm text-gray-400 text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">Chưa tham gia sự kiện nào</p>
                                : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.eventHistory.map((ev: any) => (
                                        <div key={ev.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                                            <div className="w-12 h-12 rounded-2xl bg-[#EFF9FC] flex items-center justify-center flex-shrink-0">
                                                <History size={20} className="text-[#0092B8]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate mb-0.5">{ev.eventName}</p>
                                                <p className="text-xs text-gray-500">{ev.role} · {new Date(ev.date).toLocaleDateString("vi-VN")}</p>
                                            </div>
                                            {eventStatusBadge(ev.status)}
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    )}

                    {/* REPORTS */}
                    {activeTab === "reports" && (
                        <div className="flex flex-col gap-4">
                            <div className="p-5 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4">
                                <ActivitySquare className="text-red-500 mt-0.5" size={24} />
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-bold text-red-600 text-base">Báo cáo vi phạm</h4>
                                    <p className="text-sm text-red-500">Các báo cáo liên quan đến người dùng này trong hệ thống.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <p className="text-sm text-gray-400 text-center py-12 border border-dashed border-gray-200 rounded-3xl bg-gray-50">Không có khiếu nại nào liên quan đến người dùng này.</p>
                            </div>
                        </div>
                    )}

                    {/* DOCUMENTS */}
                    {activeTab === "documents" && (
                        <div className="flex flex-col gap-4">
                            {!user.verifyDocuments || user.verifyDocuments.length === 0
                                ? <p className="text-sm text-gray-400 text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">Chưa có tài liệu nào</p>
                                : <div className="grid grid-cols-1 gap-3">
                                    {user.verifyDocuments.map((doc: any) => (
                                        <div key={doc.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-[#0092B8]/30 transition-colors">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <FileCheck size={20} className="text-blue-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-800 mb-0.5">{doc.label}</p>
                                                <p className="text-xs text-gray-500">Nộp ngày {new Date(doc.uploadedAt).toLocaleDateString("vi-VN")}</p>
                                            </div>
                                            {docStatusBadge(doc.status)}
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    )}

                    {/* LOGS */}
                    {activeTab === "logs" && (
                        <div className="flex flex-col gap-0">
                            {!user.actionLogs || user.actionLogs.length === 0
                                ? <p className="text-sm text-gray-400 text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">Không có lịch sử hoạt động</p>
                                : user.actionLogs.map((log: any) => (
                                    <div key={log.id} className="flex gap-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-xl transition-colors">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#0092B8] mt-1.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-800">{log.action}</p>
                                            <p className="text-sm text-gray-500 mt-0.5">{log.detail}</p>
                                            <p className="text-xs text-gray-400 mt-2 font-medium">
                                                {new Date(log.timestamp).toLocaleString("vi-VN")} · IP: {log.ip}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
