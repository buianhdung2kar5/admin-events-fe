import ListUser from "../../feature/user-management/user/components/ListUser";
import { UserCardData } from "../../feature/user-management/user/data/UserMockData";
import GroupFilter from "../../feature/user-management/user/components/GroupFilter";
import DocList from "../../feature/user-management/verify-document/components/DocList";
import { DocCardData } from "../../feature/user-management/verify-document/data/DocMockData";
import { useParams } from "react-router-dom";
import { useState } from "react";
import ReportList from "../../feature/user-management/report/components/ReportList";
import UserActivityLog from "../../feature/user-management/user/components/UserActivityLog";

export default function UserManagement(){
    const { type } = useParams();
    const [filter, setFilter] = useState<any>({});

    const renderContent = () => {
        switch (type) {

            case "verify-document":
                return <DocList />;
            case "report":
                return <ReportList />;
            case "activity":
                return <UserActivityLog />;
            case "user":
            default:
                return <ListUser filter={filter} />;
        }
    };

    const getTitle = () => {
        switch (type) {

            case "verify-document": return "Xác thực & Duyệt hồ sơ";
            case "report": return "Quản lý báo cáo vi phạm";
            case "activity": return "Nhật ký hoạt động";
            default: return "Quản lý người dùng";
        }
    };

    const currentCardData = () => {
        switch (type) {

            case "verify-document": return DocCardData;
            case "report": return []; // No cards for report
            case "activity": return [
                { title: "Tổng hoạt động hôm nay", value: 10 },
                { title: "Thành công", value: 8, color: "text-green-500" },
                { title: "Khả nghi", value: 1, color: "text-red-500" },
                { title: "Thất bại", value: 1, color: "text-gray-500" },
            ];
            default: return UserCardData;
        }
    }

    const cards = currentCardData();

    return (
        <div className="flex flex-col gap-8 pb-12">
            <header className="flex items-center justify-between">
               <div className="flex flex-col gap-2">
                 <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
                <p className="text-gray-500 text-sm">Quản lý và phân quyền hệ thống</p>
               </div>
            </header>

            {cards.length > 0 && (
                <div className={`grid grid-cols-1 md:grid-cols-2 ${cards.length === 6 ? 'xl:grid-cols-6' : 'xl:grid-cols-4'} gap-4`}>
                    {
                        cards.map((card, index) => (
                            <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-gray-500 text-sm font-medium">{card.title}</span>
                                    <span className="text-2xl font-bold text-gray-800 group-hover:text-[#0092B8] transition-colors">{card.value}</span>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color || 'bg-gray-100'} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                                    {card.icon && <card.icon className={card.color ? card.color.replace('bg-', 'text-') : 'text-gray-500'} size={24} />}
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}

            <div className="flex flex-col gap-6">
                {(type === 'user' || !type) && (
                    <GroupFilter setFilter={setFilter} />
                )}
                
                <section className="flex flex-col gap-8">
                    {renderContent()}
                </section>
            </div>
        </div>
    )
}
