import { DollarSign, Clock, Coins, ArrowRight, TrendingUp } from "lucide-react";
import { getFinanceStats, MockTransactions } from "../../data/FinanceMockData";
import { useNavigate } from "react-router-dom";

export default function FinanceDashboard() {
    const stats = getFinanceStats();
    const navigate = useNavigate();

    const recentTransactions = MockTransactions.slice(0, 5);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "SUCCESS": return "bg-green-50 text-green-600 border-green-200";
            case "PENDING": return "bg-amber-50 text-amber-600 border-amber-200";
            case "FAILED": return "bg-red-50 text-red-600 border-red-200";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-60"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <DollarSign size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Tổng Doanh Thu</h3>
                    </div>
                    <div className="relative z-10">
                        <span className="text-3xl font-black text-gray-800">{stats.totalRevenue.toLocaleString("vi-VN")} ₫</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full blur-2xl opacity-60"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                            <Clock size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">GD Đang Chờ Duyệt</h3>
                    </div>
                    <div className="relative z-10">
                        <span className="text-3xl font-black text-gray-800">{stats.pendingTransactions}</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full blur-2xl opacity-60"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <Coins size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Coin Đã Lưu Hành</h3>
                    </div>
                    <div className="relative z-10">
                        <span className="text-3xl font-black text-gray-800">{stats.totalCoinsIssued.toLocaleString("vi-VN")}</span>
                        <span className="text-sm font-bold text-gray-400 ml-1">Coins</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-5 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp size={18} className="text-[#0092B8]" /> Giao dịch gần đây
                        </h3>
                        <button onClick={() => navigate("/finance-management/transaction")} className="text-sm font-bold text-[#0092B8] hover:text-[#007a99] flex items-center gap-1 transition-colors">
                            Xem tất cả <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {recentTransactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${getStatusStyles(tx.status)}`}>
                                        {tx.paymentProvider.substring(0, 3)}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-sm text-gray-800">{tx.orderId}</span>
                                        <span className="text-xs text-gray-500">{tx.userName} - {new Date(tx.createdAt).toLocaleString("vi-VN")}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-black text-sm text-gray-800">{tx.amount > 0 ? `${tx.amount.toLocaleString("vi-VN")} ₫` : `${tx.coinAmount} Coins`}</span>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusStyles(tx.status)}`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
                    <h3 className="text-base font-bold text-gray-800">Truy cập nhanh</h3>
                    <button onClick={() => navigate("/finance-management/transaction")} className="flex items-center justify-between p-4 bg-blue-50 text-[#0092B8] hover:bg-[#0092B8] hover:text-white rounded-2xl transition-all group">
                        <span className="font-bold text-sm">Duyệt giao dịch PENDING</span>
                        <ArrowRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                    <button onClick={() => navigate("/finance-management/coin")} className="flex items-center justify-between p-4 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-2xl transition-all group">
                        <span className="font-bold text-sm">Cộng / Trừ Coin User</span>
                        <ArrowRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                    {/* <button onClick={() => navigate("/finance-management/momo")} className="flex items-center justify-between p-4 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white rounded-2xl transition-all group">
                        <span className="font-bold text-sm">Kiểm tra Momo Callback</span>
                        <ArrowRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button> */}
                </div>
            </div>
        </div>
    );
}
