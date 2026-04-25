import { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { MockTransactions, Transaction, TransactionStatus } from "../../data/FinanceMockData";
import TransactionDetailModal from "./TransactionDetailModal";

export default function TransactionList() {
    const [transactions, setTransactions] = useState<Transaction[]>(MockTransactions);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<TransactionStatus | "ALL">("ALL");
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    const filtered = transactions.filter(tx => {
        const matchSearch = tx.orderId.toLowerCase().includes(search.toLowerCase()) ||
                            tx.userName.toLowerCase().includes(search.toLowerCase()) ||
                            tx.userEmail.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "ALL" || tx.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "SUCCESS": return "bg-green-50 text-green-600 border-green-200";
            case "PENDING": return "bg-amber-50 text-amber-600 border-amber-200";
            case "FAILED": return "bg-red-50 text-red-600 border-red-200";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    const handleApprove = (id: string) => {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "SUCCESS", updatedAt: new Date().toISOString() } : t));
    };

    const handleReject = (id: string, reason: string) => {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "FAILED", reason, updatedAt: new Date().toISOString() } : t));
    };

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#0092B8] transition-all flex-1 w-full">
                    <Search size={18} className="text-gray-400 shrink-0" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo Order ID, tên, email..." className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400" />
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                    <Filter size={18} className="text-gray-400" />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 outline-none focus:border-[#0092B8] bg-white cursor-pointer">
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ duyệt (PENDING)</option>
                        <option value="SUCCESS">Thành công (SUCCESS)</option>
                        <option value="FAILED">Thất bại (FAILED)</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Mã GD (OrderId)</th>
                                <th className="px-6 py-4">Người dùng</th>
                                <th className="px-6 py-4 text-right">Số tiền</th>
                                <th className="px-6 py-4 text-center">Cổng thanh toán</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Thời gian</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                                        Không tìm thấy giao dịch nào phù hợp
                                    </td>
                                </tr>
                            ) : filtered.map(tx => (
                                <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-gray-800">{tx.orderId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{tx.userName}</span>
                                            <span className="text-xs text-gray-500">{tx.userEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="font-black text-[#0092B8]">{tx.amount.toLocaleString("vi-VN")} ₫</span>
                                            {tx.coinAmount ? <span className="text-[10px] font-bold text-amber-500">+{tx.coinAmount} Coins</span> : null}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">{tx.paymentProvider}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border tracking-wide uppercase ${getStatusStyles(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString("vi-VN")}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setSelectedTx(tx)} className="p-2 text-gray-400 hover:text-[#0092B8] hover:bg-blue-50 rounded-xl transition-all" title="Xem chi tiết & Duyệt">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedTx && (
                <TransactionDetailModal
                    transaction={selectedTx}
                    onClose={() => setSelectedTx(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}
