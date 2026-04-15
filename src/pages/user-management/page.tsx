import ListUser from "../../feature/user-management/user/components/ListUser";
import { UserCardData } from "../../feature/user-management/user/data/UserMockData";
import { UserPlus } from "lucide-react";
import GroupFilter from "../../feature/user-management/user/components/GroupFilter";
import OrgList from "../../feature/user-management/organization/components/OrgList";
import DocList from "../../feature/user-management/verify-document/components/DocList";
import { OrgCardData } from "../../feature/user-management/organization/data/OrgMockData";
import { DocCardData } from "../../feature/user-management/verify-document/data/DocMockData";
import { useParams } from "react-router-dom";

export default function UserManagement(){
    const { type } = useParams();

    const renderContent = () => {
        switch (type) {
            case "organization":
                return <OrgList />;
            case "verify-document":
                return <DocList />;
            case "user":
            default:
                return <ListUser />;
        }
    };

    const getTitle = () => {
        switch (type) {
            case "organization": return "Quản lý tổ chức";
            case "verify-document": return "Xác thực & Duyệt hồ sơ";
            default: return "Quản lý người dùng";
        }
    };

    const currentCardData = () => {
        switch (type) {
            case "organization": return OrgCardData;
            case "verify-document": return DocCardData;
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
               <button className="flex items-center gap-2 bg-[#0092B8] text-white px-5 py-2.5 rounded-xl hover:bg-[#007a99] transition-colors shadow-sm font-semibold">
                <UserPlus size={20} />
                Thêm mới
               </button>
            </header>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${cards.length === 6 ? 'xl:grid-cols-6' : 'xl:grid-cols-4'} gap-4`}>
                {
                    cards.map((item, index) => (
                        <div key={index} className="flex flex-col gap-2 items-center justify-center bg-white p-6 py-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <p className={`text-3xl font-bold ${item.color || 'text-gray-800'}`}>{item.value}</p>
                            <h1 className="text-sm font-medium text-gray-400">{item.title}</h1>
                        </div>
                    ))
                }
            </div>

           <div className="flex flex-col gap-6">
                <GroupFilter setFilter={(data) =>console.log("data",data)} />
                
                <section className="flex flex-col gap-8">
                    {renderContent()}
                </section>
           </div>
        </div>
    )
}



