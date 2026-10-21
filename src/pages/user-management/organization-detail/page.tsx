import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AccountApi } from "../../../services/user-management/AccountApi";
import type { AccountDetail } from "../../../types/account.types";
import { useState } from "react";
import {
    ArrowLeft, Building2, Calendar, Mail, Phone, Globe, CheckCircle2, Activity, Users, BarChart2, History, FileCheck, type LucideIcon
} from "lucide-react";
import { getOrgTypeStyles, getVerificationStyles } from "../../../feature/user-management/user/DTO/OrganizationInterface";

type Tab = "info" | "stats" | "events" | "logs";

const tabs: { key: Tab; label: string; icon: LucideIcon }[] = [
    { key: "info",   label: "Thông tin",      icon: Building2 },
    { key: "stats",  label: "Thống kê",       icon: Activity },
    { key: "events", label: "Sự kiện",        icon: Calendar },
    { key: "logs",   label: "Hoạt động",      icon: History },
];

export default function OrganizationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("info");

    const { data: org, isLoading, isError } = useQuery<AccountDetail>({
        queryKey: ['org_detail', id],
        queryFn: () => AccountApi.getAccount(id as string),
        enabled: !!id,
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải thông tin tổ chức...</div>;
    if (isError || !org) return <div className="p-8 text-center text-red-500 font-medium">Không tìm thấy tổ chức!</div>;

    // Mapping API data to local structure
    const mappedOrg = {
        id: org.id,
        name: org.organizationProfile?.organizationName || org.email,
        email: org.email,
        logoUrl: org.organizationProfile?.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(org.organizationProfile?.organizationName || org.email)}`,
        status: org.status === "ACTIVE" ? "Active" : "Blocked",
        verificationStatus: org.organizationProfile?.verificationStatus || "Unverified",
        type: org.organizationProfile?.organizationType || "University",
        address: org.organizationProfile?.address || "—",
        createdTime: org.createdAt,
        phoneNumber: org.phoneNumber,
        bio: org.organizationProfile?.description,
        currentCoin: org.currentCoin ?? 0,
        // Default values for missing fields in current response
        eventCount: 0, 
        memberCount: 0,
        dashboard: { totalEvents: 0, totalRegistrations: 0, totalViews: 0, averageAttendanceRate: 0 },
    };

    const typeStyle = getOrgTypeStyles(mappedOrg.type);
    const verStyle  = getVerificationStyles(mappedOrg.verificationStatus);

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12 animate-[fadeIn_0.3s_ease]">
            {/* Header / Back */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Chi tiết tổ chức</h1>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Org Identity Card */}
                <div className="px-8 py-6 flex items-center gap-6 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-white">
                    <img src={mappedOrg.logoUrl} alt={mappedOrg.name}
                        className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-black text-gray-900 truncate">{mappedOrg.name}</p>
                            {(mappedOrg.verificationStatus === "APPROVED" || mappedOrg.verificationStatus === "VERIFIED") && <CheckCircle2 size={20} className="text-[#0092B8]" />}
                        </div>
                        <p className="text-sm text-gray-400 truncate mb-3">{mappedOrg.email || "—"}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                             <span className={`inline-flex items-center px-3 py-1 rounded-xl border text-xs font-bold ${typeStyle.color}`}>
                                {typeStyle.label}
                            </span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${verStyle.color}`}>
                                {verStyle.label}
                            </span>
                             <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${mappedOrg.status === "Active" ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                                {mappedOrg.status === "Active" ? "Đang hoạt động" : "Bị khóa"}
                            </span>
                        </div>
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

                {/* Content */}
                <div className="p-8 bg-white min-h-[400px]">
                    {activeTab === "info" && (
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { icon: <Mail size={16} />, label: "Email", value: mappedOrg.email },
                                    { icon: <Phone size={16} />, label: "Điện thoại", value: mappedOrg.phoneNumber || "—" },
                                    { icon: <Globe size={16} />, label: "Địa chỉ", value: mappedOrg.address },
                                    { icon: <Building2 size={16} />, label: "Loại hình", value: typeStyle.label },
                                    { icon: <Calendar size={16} />, label: "Ngày tham gia", value: mappedOrg.createdTime ? new Date(mappedOrg.createdTime).toLocaleDateString("vi-VN") : "—" },
                                    { icon: <Activity size={16} />, label: "Số dư Coin", value: `${mappedOrg.currentCoin.toLocaleString()} Coin` },
                                ].map((item, i) => (
                                    <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                                        <div className="flex items-center gap-2 text-gray-400 mb-2">{item.icon}<span className="text-xs font-bold uppercase tracking-wide">{item.label}</span></div>
                                        <p className="text-base font-semibold text-gray-800 truncate">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            {mappedOrg.bio && (
                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100/50">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Giới thiệu</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">{mappedOrg.bio}</p>
                                </div>
                            )}
                            {/* Backend chưa có API Admin xem tài liệu theo tổ chức (chỉ có danh sách PENDING toàn hệ thống) */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-sm text-gray-400">
                                <FileCheck size={16} className="flex-shrink-0" />
                                Tài liệu xác thực của tổ chức: backend chưa có API — duyệt tài liệu tại mục "Duyệt tài liệu".
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50/50 rounded-2xl p-6 flex flex-col items-center gap-2 border border-blue-100/50">
                                    <span className="text-3xl font-black text-blue-600">{mappedOrg.eventCount}</span>
                                    <span className="text-sm text-blue-400 font-bold uppercase tracking-wider">Sự kiện đã tổ chức</span>
                                </div>
                                <div className="bg-purple-50/50 rounded-2xl p-6 flex flex-col items-center gap-2 border border-purple-100/50">
                                    <span className="text-3xl font-black text-purple-600">{mappedOrg.memberCount}</span>
                                    <span className="text-sm text-purple-400 font-bold uppercase tracking-wider">Thành viên tham gia</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "stats" && (
                         <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Tổng sự kiện", value: mappedOrg.dashboard.totalEvents, icon: <Calendar size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
                                { label: "Lượt đăng ký", value: mappedOrg.dashboard.totalRegistrations.toLocaleString(), icon: <Users size={20} />, color: "text-purple-600", bg: "bg-purple-50" },
                                { label: "Lượt xem", value: mappedOrg.dashboard.totalViews.toLocaleString(), icon: <Activity size={20} />, color: "text-green-600", bg: "bg-green-50" },
                                { label: "Tỷ lệ tham dự", value: `${mappedOrg.dashboard.averageAttendanceRate}%`, icon: <BarChart2 size={20} />, color: "text-amber-600", bg: "bg-amber-50" },
                            ].map((stat, i) => (
                                <div key={i} className={`${stat.bg} rounded-3xl p-6 flex flex-col gap-4 border border-white shadow-sm`}>
                                    <div className="flex items-center justify-between">
                                        <span className={`${stat.color} p-2 bg-white rounded-xl`}>{stat.icon}</span>
                                    </div>
                                    <div>
                                        <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
                                        <span className="text-xs font-bold text-gray-400 block mt-1 uppercase tracking-wider">{stat.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Backend chưa có API sự kiện / nhật ký theo tổ chức cho Admin */}
                    {activeTab === "events" && (
                        <p className="text-center text-gray-400 text-sm py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">Sự kiện của tổ chức — backend chưa có API cho mục này.</p>
                    )}

                    {activeTab === "logs" && (
                        <p className="text-center text-gray-400 text-sm py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">Lịch sử hoạt động — backend chưa có API cho mục này.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
