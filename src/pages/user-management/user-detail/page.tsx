import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AccountApi } from "../../../services/user-management/AccountApi";
import { USER_STATUS_LABELS, type UserStatus } from "../../../types/account.types";
import { useState } from "react";
import {
    ArrowLeft, User, Coins, History, FileCheck, ActivitySquare,
    Mail, Phone, Building2, Calendar, Pencil, Save, X, type LucideIcon
} from "lucide-react";
import { getRoleDetails } from "../../../feature/user-management/user/data/UserMockData";

type Tab = "profile" | "coin" | "events" | "reports" | "documents" | "logs";

const tabs: { key: Tab; label: string; icon: LucideIcon }[] = [
    { key: "profile",   label: "Hồ sơ",      icon: User },
    { key: "coin",      label: "Coin",        icon: Coins },
    { key: "events",    label: "Sự kiện",     icon: History },
    { key: "reports",   label: "Khiếu nại",   icon: ActivitySquare },
    { key: "documents", label: "Tài liệu",    icon: FileCheck },
    { key: "logs",      label: "Hoạt động",   icon: ActivitySquare },
];

const STATUS_STYLES: Record<UserStatus, { bg: string; text: string; border: string }> = {
    ACTIVE:  { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    BLOCKED: { bg: "bg-red-50",   text: "text-red-600",   border: "border-red-200" },
};

/** Tab mà backend chưa có API → hiển thị trạng thái rỗng thay vì dữ liệu giả. */
function NoApiYet({ label }: { label: string }) {
    return (
        <p className="text-sm text-gray-400 text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            {label} — backend chưa có API cho mục này.
        </p>
    );
}

export default function UserDetailPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [isEditing, setIsEditing] = useState(false);
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['user_detail', userId],
        queryFn: () => AccountApi.getAccount(userId as string),
        enabled: !!userId,
    });
    
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 font-medium">Đang tải thông tin người dùng...</div>;
    }

    if (isError || !user) {
        return <div className="p-8 text-center text-red-500 font-medium">Không tìm thấy người dùng!</div>;
    }

    const role   = getRoleDetails(user.role);

    const sc = STATUS_STYLES[user.status];
    const profile = user.userProfile;
    const displayName = profile?.fullName || user.email;

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
                    <img src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`} alt={displayName}
                        className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md" />
                    <div className="flex-1 min-w-0">
                        <p className="text-2xl font-black text-gray-900 truncate">{displayName}</p>
                        <p className="text-sm text-gray-400 truncate mb-3">{user.email || "Chưa cập nhật email"}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${role.color}`}>
                                {role.icon} {role.label}
                            </span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${sc.bg} ${sc.text} ${sc.border}`}>
                                {USER_STATUS_LABELS[user.status]}
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
                                    { icon: <Calendar size={16} />,  label: "Sinh nhật",    value: profile?.birthOfDate ? new Date(profile.birthOfDate).toLocaleDateString("vi-VN") : null, show: !!profile?.birthOfDate },
                                    { icon: <User size={16} />,      label: "Giới tính",    value: profile?.gender === "NAM" ? "Nam" : profile?.gender === "NU" ? "Nữ" : profile?.gender, show: !!profile?.gender },
                                    { icon: <Building2 size={16} />, label: "Trường Đại học",value: profile?.university, show: !!profile?.university },
                                    { icon: <Building2 size={16} />, label: "Khoa",         value: profile?.faculty, show: !!profile?.faculty },
                                    { icon: <Building2 size={16} />, label: "Chuyên ngành", value: profile?.major, show: !!profile?.major },
                                    { icon: <User size={16} />,      label: "Mã sinh viên", value: profile?.studentCode, show: !!profile?.studentCode },
                                    { icon: <Calendar size={16} />,  label: "Ngày tham gia",value: new Date(user.createdAt).toLocaleDateString("vi-VN"), show: true },
                                ].filter(item => item.show).map((item, i) => (
                                    <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                                        <div className="flex items-center gap-2 text-gray-400 mb-2">{item.icon}<span className="text-xs font-bold uppercase tracking-wide">{item.label}</span></div>
                                        <p className="text-base font-semibold text-gray-800 truncate">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* COIN */}
                    {activeTab === "coin" && (
                        <NoApiYet label="Lịch sử coin" />
                    )}

                    {/* EVENTS */}
                    {activeTab === "events" && (
                        <NoApiYet label="Sự kiện đã tham gia" />
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
                        <NoApiYet label="Tài liệu" />
                    )}

                    {/* LOGS */}
                    {activeTab === "logs" && (
                        <NoApiYet label="Lịch sử hoạt động" />
                    )}
                </div>
            </div>
        </div>
    );
}
