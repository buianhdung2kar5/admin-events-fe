import { useState } from "react";
import { Search, Server, Activity, AlertCircle, CheckCircle } from "lucide-react";

export default function SepayTracker() {
    const [orderId, setOrderId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCheckStatus = () => {
        if (!orderId.trim()) return;
        setIsLoading(true);
        setResult(null);

        // Giả lập API gọi lên SePay
        setTimeout(() => {
            setIsLoading(false);
            if (orderId.includes("FAIL")) {
                setResult({
                    status: "FAILED",
                    sepayResponse: {
                        partnerCode: "SEPAY_SEVENTS",
                        orderId: orderId,
                        requestId: `req-${Date.now()}`,
                        amount: 50000,
                        transId: `trans-${Date.now()}`,
                        resultCode: 1006,
                        message: "Giao dịch bị từ chối bởi ngân hàng.",
                        responseTime: new Date().toISOString()
                    }
                });
            } else if (orderId.includes("NOTFOUND")) {
                setResult({
                    status: "NOT_FOUND",
                    sepayResponse: {
                        resultCode: 99,
                        message: "Không tìm thấy giao dịch này trên hệ thống SePay."
                    }
                });
            } else {
                setResult({
                    status: "SUCCESS",
                    sepayResponse: {
                        partnerCode: "SEPAY_SEVENTS",
                        orderId: orderId,
                        requestId: `req-${Date.now()}`,
                        amount: 150000,
                        transId: `trans-${Date.now()}`,
                        resultCode: 0,
                        message: "Giao dịch thành công.",
                        payType: "qr",
                        responseTime: new Date().toISOString()
                    }
                });
            }
        }, 800);
    };

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease]">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <Activity size={18} className="text-blue-500" /> Kiểm tra trạng thái SePay Callback
                    </h3>
                    <p className="text-sm text-gray-500">
                        Nhập OrderId của giao dịch để kiểm tra trạng thái thực tế ghi nhận trên hệ thống SePay. (Nhập mã có chứa "FAIL" hoặc "NOTFOUND" để test lỗi).
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-all">
                        <Search size={18} className="text-gray-400 shrink-0" />
                        <input 
                            type="text" 
                            value={orderId} 
                            onChange={e => setOrderId(e.target.value)} 
                            placeholder="Nhập OrderId (VD: ORD-SEPAY-12345)..." 
                            className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400 font-mono" 
                            onKeyDown={e => e.key === "Enter" && handleCheckStatus()}
                        />
                    </div>
                    <button onClick={handleCheckStatus} disabled={!orderId.trim() || isLoading}
                        className="px-6 py-3 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors shadow-sm disabled:opacity-50 shrink-0 flex items-center gap-2">
                        {isLoading ? <span className="animate-spin">⏳</span> : <Server size={18} />} Kiểm tra
                    </button>
                </div>
            </div>

            {result && (
                <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-lg flex flex-col gap-4 relative overflow-hidden animate-[fadeIn_0.3s_ease]">
                    <div className="flex items-center gap-2 mb-2">
                        {result.status === "SUCCESS" && <CheckCircle size={20} className="text-green-400" />}
                        {result.status === "FAILED" && <AlertCircle size={20} className="text-red-400" />}
                        {result.status === "NOT_FOUND" && <AlertCircle size={20} className="text-amber-400" />}
                        <span className="text-sm font-bold text-white uppercase tracking-wider">
                            Kết quả truy vấn: {result.status}
                        </span>
                    </div>

                    <div className="bg-black/50 p-4 rounded-xl border border-gray-800 overflow-x-auto">
                        <pre className="text-sm text-green-400 font-mono leading-relaxed">
                            {JSON.stringify(result.sepayResponse, null, 4)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
