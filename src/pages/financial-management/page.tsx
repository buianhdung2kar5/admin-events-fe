import { useParams } from "react-router-dom"

// Import sub-feature components
import FinanceDashboard from "../../feature/financial-management/dashboard/components/FinanceDashboard"
import TransactionList from "../../feature/financial-management/transaction/components/TransactionList"
import CoinManagement from "../../feature/financial-management/coin/components/CoinManagement"
import PackageList from "../../feature/financial-management/package/components/PackageList"
import CoinAuditLog from "../../feature/financial-management/coin/components/CoinAuditLog"

const FinancialManagementPage = () => {
    const { type } = useParams();

    const getTitle = () => {
        switch (type) {
            case "dashboard": return "Tổng quan tài chính";
            case "transaction": return "Giao dịch hệ thống";
            case "coin": return "Quản lý Coin";
            // case "sepay": return "Cấu hình SePay";
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
            // case "sepay": return "Kiểm tra trạng thái callback thực tế từ SePay";
            case "package": return "Quản lý gói subscription cho ORGANIZATION · Tạo, bật/tắt, theo dõi doanh thu";
            case "coin-audit": return "Audit trail mọi lần điều chỉnh coin · Lịch sử ADMIN_ADJUST, NEWS_READ, EVENT_ATTEND...";
            default: return "Giám sát tài chính và cấu hình thanh toán";
        }
    };



    const renderContent = () => {
        switch (type) {
            case "dashboard": return <FinanceDashboard />;
            case "transaction": return <TransactionList />;
            case "coin": return <CoinManagement />;
            // case "sepay": return <SepayTracker />;
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
            </header>

            <main className="flex flex-col gap-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default FinancialManagementPage;