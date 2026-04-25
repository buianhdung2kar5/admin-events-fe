import { useState } from "react";
import { Search, PlusCircle, MinusCircle, History, X } from "lucide-react";
import { MockCoinBalances, MockCoinHistories, UserCoinBalance, CoinHistory } from "../../data/FinanceMockData";

export default function CoinManagement() {
    const [balances, setBalances] = useState<UserCoinBalance[]>(MockCoinBalances);
    const [histories, setHistories] = useState<CoinHistory[]>(MockCoinHistories);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserCoinBalance | null>(null);

    // Adjust Coin State
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [adjustType, setAdjustType] = useState<"ADD" | "SUBTRACT">("ADD");
    const [adjustAmount, setAdjustAmount] = useState<number | "">("");
    const [adjustReason, setAdjustReason] = useState("");

    const filtered = balances.filter(b => 
        b.userName.toLowerCase().includes(search.toLowerCase()) || 
        b.email.toLowerCase().includes(search.toLowerCase()) ||
        b.userId.toLowerCase().includes(search.toLowerCase())
    );

    const userHistories = selectedUser ? histories.filter(h => h.userId === selectedUser.userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];

    const handleAdjustSubmit = () => {
        if (!selectedUser || !adjustAmount || adjustAmount <= 0 || !adjustReason.trim()) return;

        const numAmount = Number(adjustAmount);
        
        // Cập nhật balance
        setBalances(prev => prev.map(u => {
            if (u.userId === selectedUser.userId) {
                const newBalance = adjustType === "ADD" ? u.balance + numAmount : Math.max(0, u.balance - numAmount);
                setSelectedUser({ ...u, balance: newBalance }); // update current selected user view
                return { ...u, balance: newBalance };
            }
            return u;
        }));

        // Thêm history
        const newHistory: CoinHistory = {
            id: `ch-${Date.now()}`,
            userId: selectedUser.userId,
            type: adjustType,
            amount: numAmount,
            reason: adjustReason.trim(),
            createdAt: new Date().toISOString()
        };
        setHistories(prev => [newHistory, ...prev]);

        setIsAdjustModalOpen(false);
        setAdjustAmount("");
        setAdjustReason("");
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-[fadeIn_0.3s_ease]">
            {/* Left Col: Users List */}
            <div className="flex flex-col gap-4 lg:w-1/2">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl p-2.5 focus-within:border-[#0092B8] transition-all shadow-sm">
                    <Search size={18} className="text-gray-400 ml-2" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm người dùng (Tên, Email, ID)..." className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400" />
                </div>

                <div className="flex flex-col gap-3">
                    {filtered.length === 0 ? (
                        <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">Không tìm thấy người dùng</div>
                    ) : filtered.map(u => (
                        <button key={u.userId} onClick={() => setSelectedUser(u)} 
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${selectedUser?.userId === u.userId ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-gray-100 hover:border-blue-100"}`}>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-800">{u.userName}</span>
                                <span className="text-xs text-gray-500">{u.email}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="font-black text-amber-500">{u.balance.toLocaleString("vi-VN")}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Coins</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Col: User Details & Actions */}
            <div className="flex flex-col gap-6 lg:w-1/2">
                {selectedUser ? (
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-500 uppercase">Số dư hiện tại</span>
                                <span className="text-3xl font-black text-amber-500">{selectedUser.balance.toLocaleString("vi-VN")} <span className="text-sm text-gray-400">Coins</span></span>
                            </div>
                            <button onClick={() => setIsAdjustModalOpen(true)} className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#0092B8] hover:bg-[#007a99] rounded-xl transition-colors shadow-sm">
                                Điều chỉnh Coin
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <History size={16} className="text-gray-400" /> Lịch sử biến động Coin
                            </h3>
                            <div className="flex flex-col gap-3">
                                {userHistories.length === 0 ? (
                                    <div className="py-6 text-center text-sm text-gray-400">Chưa có giao dịch coin nào</div>
                                ) : userHistories.map(h => (
                                    <div key={h.id} className="flex items-start gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className={`p-2 rounded-xl mt-0.5 ${h.type === "ADD" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                            {h.type === "ADD" ? <PlusCircle size={16} /> : <MinusCircle size={16} />}
                                        </div>
                                        <div className="flex-1 flex flex-col gap-0.5">
                                            <div className="flex items-center justify-between">
                                                <span className={`font-black text-sm ${h.type === "ADD" ? "text-green-600" : "text-red-600"}`}>
                                                    {h.type === "ADD" ? "+" : "-"}{h.amount} Coins
                                                </span>
                                                <span className="text-[11px] font-semibold text-gray-400">{new Date(h.createdAt).toLocaleString("vi-VN")}</span>
                                            </div>
                                            <span className="text-xs text-gray-600 mt-1">{h.reason}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center gap-3 text-gray-400 h-full">
                        <Search size={40} className="opacity-20" />
                        <p className="text-sm font-medium">Chọn một người dùng để xem và điều chỉnh Coin</p>
                    </div>
                )}
            </div>

            {/* Adjust Modal */}
            {isAdjustModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAdjustModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">Điều chỉnh Coin</h2>
                            <button onClick={() => setIsAdjustModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-5">
                            <div className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <span className="text-xs text-gray-500">Người dùng: <span className="font-bold text-gray-800">{selectedUser.userName}</span></span>
                                <span className="text-xs text-gray-500">Số dư: <span className="font-bold text-amber-500">{selectedUser.balance} Coins</span></span>
                            </div>

                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                                {(["ADD", "SUBTRACT"] as const).map(type => (
                                    <button key={type} onClick={() => setAdjustType(type)}
                                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${adjustType === type ? "bg-white shadow-sm text-gray-800" : "text-gray-500"}`}>
                                        {type === "ADD" ? <PlusCircle size={16} className="text-green-500" /> : <MinusCircle size={16} className="text-red-500" />}
                                        {type === "ADD" ? "Cộng Coin" : "Trừ Coin"}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Số lượng Coin <span className="text-red-500">*</span></label>
                                <input type="number" min="1" value={adjustAmount} onChange={e => setAdjustAmount(Number(e.target.value))} placeholder="0" className="border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-[#0092B8] font-black text-amber-500" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Lý do điều chỉnh <span className="text-red-500">*</span></label>
                                <textarea rows={2} value={adjustReason} onChange={e => setAdjustReason(e.target.value)} placeholder="VD: Thưởng tham gia sự kiện, Hoàn tiền..." className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0092B8] resize-none" />
                            </div>

                            <button onClick={handleAdjustSubmit} disabled={!adjustAmount || adjustAmount <= 0 || !adjustReason.trim()}
                                className="w-full py-3.5 mt-2 text-sm font-bold text-white bg-[#0092B8] hover:bg-[#007a99] rounded-xl transition-colors shadow-sm disabled:opacity-50">
                                Xác nhận {adjustType === "ADD" ? "Cộng" : "Trừ"} Coin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
