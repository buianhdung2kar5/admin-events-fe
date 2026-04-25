import { useState } from "react";
import { Transaction } from "../../data/FinanceMockData";
import { X, CheckCircle, XCircle } from "lucide-react";

interface Props {
    transaction: Transaction;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string, reason: string) => void;
}

export default function TransactionDetailModal({ transaction, onClose, onApprove, onReject }: Props) {
    const [rejectReason, setRejectReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "SUCCESS": return "bg-green-50 text-green-600 border-green-200";
            case "PENDING": return "bg-amber-50 text-amber-600 border-amber-200";
            case "FAILED": return "bg-red-50 text-red-600 border-red-200";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Chi tiết giao dịch</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Mã giao dịch (OrderId)</span>
                            <span className="font-mono font-semibold text-gray-800">{transaction.orderId}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Trạng thái</span>
                            <span className={`w-fit px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getStatusStyles(transaction.status)}`}>
                                {transaction.status}
                            </span>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Số tiền</span>
                            <span className="font-black text-[#0092B8] text-base">{transaction.amount.toLocaleString("vi-VN")} ₫</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Coin nạp</span>
                            <span className="font-black text-amber-500 text-base">{transaction.coinAmount || 0} Coins</span>
                        </div>

                        <div className="flex flex-col gap-1 col-span-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Người dùng</span>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">{transaction.userName}</span>
                                <span className="text-xs text-gray-500">{transaction.userEmail}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Cổng thanh toán</span>
                            <span className="font-semibold text-gray-800">{transaction.paymentProvider}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Mã tham chiếu (Ref)</span>
                            <span className="font-mono text-gray-600 truncate">{transaction.reference || "N/A"}</span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Tạo lúc</span>
                            <span className="font-semibold text-gray-800">{new Date(transaction.createdAt).toLocaleString("vi-VN")}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Cập nhật lúc</span>
                            <span className="font-semibold text-gray-800">{new Date(transaction.updatedAt).toLocaleString("vi-VN")}</span>
                        </div>

                        {transaction.reason && (
                            <div className="flex flex-col gap-1 col-span-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Lý do (Nếu FAILED)</span>
                                <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-sm italic">
                                    {transaction.reason}
                                </div>
                            </div>
                        )}
                    </div>

                    {transaction.status === "PENDING" && (
                        <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                            {isRejecting ? (
                                <div className="flex flex-col gap-3">
                                    <textarea
                                        rows={2}
                                        value={rejectReason}
                                        onChange={e => setRejectReason(e.target.value)}
                                        placeholder="Nhập lý do từ chối giao dịch..."
                                        className="border border-red-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none bg-red-50/30"
                                    />
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setIsRejecting(false)} className="flex-1 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                            Hủy
                                        </button>
                                        <button 
                                            onClick={() => { onReject(transaction.id, rejectReason); onClose(); }} 
                                            disabled={!rejectReason.trim()}
                                            className="flex-1 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50">
                                            Xác nhận từ chối
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button onClick={() => { onApprove(transaction.id); onClose(); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors shadow-sm">
                                        <CheckCircle size={18} /> Duyệt (SUCCESS)
                                    </button>
                                    <button onClick={() => setIsRejecting(true)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm">
                                        <XCircle size={18} /> Từ chối (FAILED)
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
