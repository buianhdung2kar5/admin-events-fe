import { useParams } from "react-router-dom"
import { Plus } from "lucide-react"

// Import sub-feature components
import CoinPackageList from "../../feature/financial-management/collection-coin/components/CoinPackageList"

const FinancialManagementPage = () => {
    const { type } = useParams();

    const getTitle = () => {
        switch (type) {
            case "collection-coin": return "Quản lý Gói coin";
            case "transaction": return "Lịch sử giao dịch";
            case "momo-wallet": return "Cấu hình Momo Wallet";
            default: return "Quản lý tài chính";
        }
    };

    const getDescription = () => {
        switch (type) {
            case "collection-coin": return "Quản lý các gói nạp coin cho người dùng và đối tác";
            case "transaction": return "Theo dõi biến động số dư và giao dịch hệ thống";
            case "momo-wallet": return "Quản lý kết nối và tham số tích hợp ví Momo";
            default: return "Giám sát tài chính và cấu hình thanh toán";
        }
    };

    const getBtnText = () => {
        switch (type) {
            case "collection-coin": return "Thêm gói mới";
            case "transaction": return "Xuất báo cáo";
            case "momo-wallet": return "Thêm cấu hình";
            default: return "Thêm mới";
        }
    };

    const renderContent = () => {
        switch (type) {
            case "collection-coin": return <CoinPackageList />;
            case "transaction": 
                return <div className="p-20 text-center bg-white rounded-[32px] shadow-sm border border-dashed border-gray-200 text-gray-400 font-bold italic">Chức năng Giao dịch đang được phát triển</div>;
            case "momo-wallet": 
                return <div className="p-20 text-center bg-white rounded-[32px] shadow-sm border border-dashed border-gray-200 text-gray-400 font-bold italic">Chức năng Momo Wallet đang được phát triển</div>;
            default: return <CoinPackageList />;
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-700">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">{getTitle()}</h1>
                    <p className="text-sm font-bold text-gray-400">{getDescription()}</p>
                </div>
                <button className="flex items-center justify-center gap-2.5 bg-[#0092B8] text-white px-6 py-3.5 rounded-2xl hover:bg-[#007a99] transition-all shadow-[0_10px_20px_-5px_rgba(0,146,184,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,146,184,0.4)] hover:-translate-y-0.5 active:translate-y-0 font-black text-sm uppercase tracking-wider">
                    <Plus size={20} strokeWidth={3} />
                    {getBtnText()}
                </button>
            </header>

            <main className="flex flex-col gap-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default FinancialManagementPage;