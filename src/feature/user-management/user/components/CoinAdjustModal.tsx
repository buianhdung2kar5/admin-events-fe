import { useState } from "react";
import { X, Coins, Plus, Minus } from "lucide-react";
import { UserItem } from "../data/UserMockData";

interface Props {
    user: UserItem;
    onClose: () => void;
    onConfirm: (userId: string, amount: number, reason: string) => void;
}

export default function CoinAdjustModal({ user, onClose, onConfirm }: Props) {
    const [type, setType] = useState<"add" | "subtract">("add");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        const parsed = parseInt(amount, 10);
        if (!parsed || parsed <= 0) return;
        const finalAmount = type === "subtract" ? -parsed : parsed;
        onConfirm(user.id, finalAmount, reason);
        onClose();
    };

    const preview = parseInt(amount || "0", 10);
    const newBalance = type === "add"
        ? user.coinBalance + preview
        : Math.max(0, user.coinBalance - preview);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-5 animate-[fadeSlideUp_0.2s_ease]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-xl">
                            <Coins size={20} className="text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-800">Điều chỉnh Coin</h2>
                            <p className="text-xs text-gray-400">{user.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                {/* Current balance */}
                <div className="bg-amber-50 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-amber-700 font-medium">Số dư hiện tại</span>
                    <span className="text-lg font-bold text-amber-600">{user.coinBalance.toLocaleString()} 🪙</span>
                </div>

                {/* Type toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setType("add")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                            type === "add"
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-white text-gray-500 border-gray-200 hover:border-green-300"
                        }`}
                    >
                        <Plus size={16} /> Cộng Coin
                    </button>
                    <button
                        onClick={() => setType("subtract")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                            type === "subtract"
                                ? "bg-red-500 text-white border-red-500"
                                : "bg-white text-gray-500 border-gray-200 hover:border-red-300"
                        }`}
                    >
                        <Minus size={16} /> Trừ Coin
                    </button>
                </div>

                {/* Amount input */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Số lượng Coin</label>
                    <input
                        type="number"
                        min={1}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Nhập số lượng..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all"
                    />
                </div>

                {/* Reason input */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lý do</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Nhập lý do điều chỉnh..."
                        rows={2}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all resize-none"
                    />
                </div>

                {/* Preview */}
                {amount && (
                    <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between border border-gray-100">
                        <span className="text-sm text-gray-500">Số dư sau điều chỉnh</span>
                        <span className={`text-lg font-bold ${newBalance < user.coinBalance ? "text-red-500" : "text-green-600"}`}>
                            {newBalance.toLocaleString()} 🪙
                        </span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!amount || parseInt(amount) <= 0}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}
