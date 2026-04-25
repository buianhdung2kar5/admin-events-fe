import { useState, useMemo } from "react";
import { Search, Package, Edit2, ToggleLeft, ToggleRight, Plus, Zap, Users } from "lucide-react";
import { MockPackages, MockUserPackages, PackageItem } from "../data/PackageMockData";
import PackageFormModal from "./PackageFormModal";

export default function PackageList() {
    const [packages, setPackages] = useState<PackageItem[]>(MockPackages);
    const [userPackages] = useState(MockUserPackages);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"ALL" | "active" | "inactive">("ALL");
    const [activeTab, setActiveTab] = useState<"packages" | "userpackages">("packages");
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState<PackageItem | null>(null);

    const filtered = useMemo(() => {
        return packages.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase());
            const matchStatus = filterStatus === "ALL" || (filterStatus === "active" ? p.isActive : !p.isActive);
            return matchSearch && matchStatus;
        });
    }, [packages, search, filterStatus]);

    const filteredUserPkgs = useMemo(() => {
        return userPackages.filter(up =>
            up.userName.toLowerCase().includes(search.toLowerCase()) ||
            up.packageName.toLowerCase().includes(search.toLowerCase())
        );
    }, [userPackages, search]);

    const handleToggle = (id: string) => {
        setPackages(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    };

    const handleSave = (data: Partial<PackageItem>) => {
        if (editTarget) {
            setPackages(prev => prev.map(p => p.id === editTarget.id ? { ...p, ...data } : p));
        } else {
            const newPkg: PackageItem = {
                id: `pkg${Date.now()}`,
                name: data.name!,
                description: data.description!,
                price: data.price!,
                durationDays: data.durationDays!,
                isActive: true,
                soldCount: 0,
                revenue: 0,
                color: "bg-[#0092B8]"
            };
            setPackages(prev => [newPkg, ...prev]);
        }
        setShowForm(false);
        setEditTarget(null);
    };

    const statusUserPkg = (s: string) => {
        switch (s) {
            case "ACTIVE": return "bg-green-50 text-green-600 border-green-200";
            case "EXPIRED": return "bg-red-50 text-red-500 border-red-200";
            case "CANCELLED": return "bg-gray-50 text-gray-500 border-gray-200";
            default: return "";
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                {[
                    { key: "packages", label: "Gói dịch vụ" },
                    { key: "userpackages", label: "User đã mua" }
                ].map(tab => (
                    <button key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? "bg-white shadow-sm text-[#0092B8]" : "text-gray-500 hover:text-gray-700"}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#0092B8] transition-all flex-1">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder={activeTab === "packages" ? "Tìm theo tên gói, mô tả..." : "Tìm theo tên user, tên gói..."}
                        className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400" />
                </div>
                {activeTab === "packages" && (
                    <div className="flex gap-2">
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
                            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 outline-none focus:border-[#0092B8] bg-white cursor-pointer">
                            <option value="ALL">Tất cả</option>
                            <option value="active">Đang bán</option>
                            <option value="inactive">Ngừng bán</option>
                        </select>
                        <button onClick={() => { setEditTarget(null); setShowForm(true); }}
                            className="flex items-center gap-2 bg-[#0092B8] text-white px-4 py-2.5 rounded-xl hover:bg-[#007a99] transition-all font-bold text-sm">
                            <Plus size={16} strokeWidth={3} /> Thêm gói
                        </button>
                    </div>
                )}
            </div>

            {activeTab === "packages" ? (
                /* Package Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map(pkg => (
                        <div key={pkg.id} className={`relative bg-white rounded-xl p-5 shadow-sm border ${pkg.isActive ? 'border-gray-100' : 'border-gray-200 opacity-70'} hover:shadow-md transition-all duration-200 flex flex-col group overflow-hidden`}>
                            {pkg.isPopular && (
                                <div className="absolute top-4 right-[-35px] bg-[#FBBF24] text-white text-[9px] font-semibold px-10 py-1.5 rotate-45 shadow-sm uppercase tracking-wide z-10 flex items-center gap-1">
                                    <Zap size={10} fill="white" /> Phổ biến
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-5">
                                <div className={`${pkg.color} p-2.5 rounded-lg shadow-md`}>
                                    <Package size={22} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">{pkg.name}</h3>
                                    <p className="text-[11px] text-gray-400 font-bold italic">{pkg.description}</p>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-2xl font-bold text-gray-800 tabular-nums">
                                    {pkg.price === 0 ? "Miễn phí" : `${pkg.price.toLocaleString()}đ`}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 font-bold mb-5">⏳ {pkg.durationDays} ngày{pkg.maxEvents ? ` · tối đa ${pkg.maxEvents} sự kiện` : " · không giới hạn"}</p>

                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 border-t border-gray-50 pt-4 mb-5">
                                <div className="flex flex-col">
                                    <span className="text-gray-300 uppercase text-[9px] tracking-wide mb-0.5">Đã bán</span>
                                    <span className="text-gray-600 font-semibold">{pkg.soldCount.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-gray-300 uppercase text-[9px] tracking-wide mb-0.5">Doanh thu</span>
                                    <span className="text-gray-600 font-semibold">{pkg.revenue > 0 ? (pkg.revenue / 1000000).toFixed(1) + "tr₫" : "—"}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-auto">
                                <button onClick={() => handleToggle(pkg.id)}
                                    className={`flex items-center gap-2 flex-1 py-2.5 rounded-lg text-[11px] font-semibold uppercase tracking-wide border transition-colors ${pkg.isActive ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'}`}>
                                    {pkg.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                    {pkg.isActive ? "Đang bán" : "Ngừng bán"}
                                </button>
                                <button onClick={() => { setEditTarget(pkg); setShowForm(true); }}
                                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-lg transition-all border border-gray-100">
                                    <Edit2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* User Packages Table */
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Người dùng</th>
                                    <th className="px-6 py-4">Gói đã mua</th>
                                    <th className="px-6 py-4">Ngày mua</th>
                                    <th className="px-6 py-4">Hết hạn</th>
                                    <th className="px-6 py-4 text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUserPkgs.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">Không tìm thấy dữ liệu</td></tr>
                                ) : filteredUserPkgs.map(up => (
                                    <tr key={up.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-[#0092B8]/10 flex items-center justify-center">
                                                    <Users size={14} className="text-[#0092B8]" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{up.userName}</p>
                                                    <p className="text-xs text-gray-400">{up.userEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-700">{up.packageName}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{new Date(up.purchasedAt).toLocaleDateString("vi-VN")}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{new Date(up.expiresAt).toLocaleDateString("vi-VN")}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border ${statusUserPkg(up.status)}`}>
                                                {up.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showForm && (
                <PackageFormModal
                    pkg={editTarget}
                    onClose={() => { setShowForm(false); setEditTarget(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
