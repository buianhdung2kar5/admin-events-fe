import { useParams } from "react-router-dom";
import { useState } from "react";
import GroupFilter from "../../feature/user-management/user/components/GroupFilter";

import CategoryList from "../../feature/content-management/category/components/CategoryList";
import EventList from "../../feature/content-management/event/components/EventList";
import FeaturedList from "../../feature/content-management/featured/components/FeaturedList";
import NewsList from "../../feature/content-management/news/components/NewsList";
import NotifList from "../../feature/content-management/notification/components/NotifList";
import RecruitmentList from "../../feature/content-management/recruitment/components/RecruitmentList";
import AttendanceList from "../../feature/content-management/attendance/components/AttendanceList";
import FeedbackList from "../../feature/content-management/feedback/components/FeedbackList";

// Import actual data
import { NotifCardData } from "../../feature/content-management/notification/data/NotifMockData";
import { RecruitmentCardData } from "../../feature/content-management/recruitment/data/RecruitmentMockData";

export default function ContentManagement() {
    const { type } = useParams();
    const [filter, setFilter] = useState<any>({});
    // Tin tức có thẻ thống kê + bộ lọc riêng (lọc phía server)
    const hasOwnToolbar = type === "news";

    if (type === "attendance") {
        return <AttendanceList />;
    }
    if (type === "feedback") {
        return <FeedbackList />;
    }

    const getTitle = () => {
        switch (type) {
            case "category": return "Quản lý danh mục";
            case "event": return "Quản lý sự kiện";
            case "featured": return "Sự kiện nổi bật";
            case "news": return "Quản lý tin tức";
            case "notification": return "Thông báo hệ thống";
            case "recruitment": return "Tuyển CTV / Tình nguyện viên";
            case "attendance": return "Quản lý Điểm danh";
            default: return "Quản lý nội dung";
        }
    };

    const getDescription = () => {
        switch (type) {
            case "category": return "Quản lý danh mục sự kiện theo phân cấp cha – con";
            case "event": return "Duyệt sự kiện từ sinh viên · Quản lý sự kiện từ doanh nghiệp & tổ chức";
            case "featured": return "Quản lý sự kiện hiển thị nổi bật trên trang chủ";
            case "news": return "Tạo, chỉnh sửa và phê duyệt tin tức";
            case "notification": return "Gửi thông báo đến người dùng theo phân đoạn";
            case "recruitment": return "Quản lý bài tuyển CTV/TNV · Duyệt đơn ứng tuyển · Xem câu trả lời";
            case "attendance": return "Check-in/out QR · Thủ công · Quản lý participants · Nhật ký điểm danh";
            default: return "Quản lý và điều phối nội dung hệ thống";
        }
    };



    const currentCardData = () => {
        switch (type) {
            case "category": return [];
            case "event": return [];
            case "featured": return [];
            case "notification": return NotifCardData;
            case "recruitment": return RecruitmentCardData;
            default: return [];
        }
    };

    const renderContent = () => {
        switch (type) {
            case "category": return <CategoryList filter={filter} />;
            case "event": return <EventList filter={filter} />;
            case "featured": return <FeaturedList filter={filter} />;
            case "news": return <NewsList />;
            case "notification": return <NotifList />;
            case "recruitment": return <RecruitmentList filter={filter} />;
            default: return <CategoryList />;
        }
    };

    const cards = currentCardData();

    return (
        <div className="flex flex-col gap-8 pb-12">
            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
                    <p className="text-gray-500 text-sm">{getDescription()}</p>
                </div>
            </header>

            {/* Grid layout adapts to number of cards (8 vs 4/6) */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${cards.length > 6 ? 'xl:grid-cols-8' : cards.length > 4 ? 'xl:grid-cols-6' : 'xl:grid-cols-4'} gap-4`}>
                {cards.map((item: any, index: number) => (
                    <div key={index} className="flex flex-col gap-2 items-center justify-center bg-white p-6 py-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <p className={`text-3xl font-bold ${item.color || 'text-gray-800'}`}>{item.value}</p>
                        <h1 className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-wider">{item.title}</h1>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-6">
                {!hasOwnToolbar && <GroupFilter setFilter={setFilter} />}
                <section className="flex flex-col gap-8">
                    {renderContent()}
                </section>
            </div>
        </div>
    );
}

