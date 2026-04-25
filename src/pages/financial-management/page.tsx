import { useParams } from "react-router-dom"
import { Plus } from "lucide-react"

// Import sub-feature components
import FinanceDashboard from "../../feature/financial-management/dashboard/components/FinanceDashboard"
import TransactionList from "../../feature/financial-management/transaction/components/TransactionList"
import CoinManagement from "../../feature/financial-management/coin/components/CoinManagement"
import MomoTracker from "../../feature/financial-management/momo/components/MomoTracker"
import PackageList from "../../feature/financial-management/package/components/PackageList"
import CoinAuditLog from "../../feature/financial-management/coin/components/CoinAuditLog"

const FinancialManagementPage = () => {
    const { type } = useParams();

    const getTitle = () => {
        switch (type) {
            case "dashboard": return "Tổng quan tài chính";
            case "transaction": return "Giao dịch hệ thống";
            case "coin": return "Quản lý Coin";
            case "momo": return "Cấu hình SePay";
            case "package": return "Quản lý Gói dịch vụ";
            case "coin-audit": return "Lịch sử Điều chỉnh Coin";
            default: return "Tổng quan tài chính";
        }
    };

    const getDescription = () => {
        switch (type) {
            case "dashboard": return "Doanh thu và trạng thái luồng tiền";
            case "transaction": return "Lịch sử và duyệt giao dịch nạp tiền";
            case "coin": return "Kiểm tra và điều chỉnh số dư Coin của người dùng";
            case "momo": return "Kiểm tra trạng thái callback thực tế từ SePay";
            case "package": return "Quản lý gói subscription cho ORGANIZATION · Tạo, bật/tắt, theo dõi doanh thu";
            case "coin-audit": return "Audit trail mọi lần điều chỉnh coin · Lịch sử ADMIN_ADJUST, NEWS_READ, EVENT_ATTEND...";
            default: return "Giám sát tài chính và cấu hình thanh toán";
        }
    };

    const getBtnText = () => {
        switch (type) {
            case "dashboard": return "Báo cáo tháng";
            case "transaction": return "Xuất Excel";
            case "coin": return "Lịch sử chung";
            case "momo": return "Cập nhật Key";
            case "package": return "Thêm gói mới";
            case "coin-audit": return null;
            default: return "Thêm mới";
        }
    };

    const renderContent = () => {
        switch (type) {
            case "dashboard": return <FinanceDashboard />;
            case "transaction": return <TransactionList />;
            case "coin": return <CoinManagement />;
            case "momo": return <MomoTracker />;
            case "package": return <PackageList />;
            case "coin-audit": return <CoinAuditLog />;
            default: return <FinanceDashboard />;
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