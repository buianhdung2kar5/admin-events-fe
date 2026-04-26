import { useParams } from "react-router-dom";
import GroupFilter from "../../feature/user-management/user/components/GroupFilter";

import CategoryList from "../../feature/content-management/category/components/CategoryList";
import EventList from "../../feature/content-management/event/components/EventList";
import FeaturedList from "../../feature/content-management/featured/components/FeaturedList";
import NewsList from "../../feature/content-management/news/components/NewsList";
import NotifList from "../../feature/content-management/notification/components/NotifList";
import RecruitmentList from "../../feature/content-management/recruitment/components/RecruitmentList";
import AttendanceList from "../../feature/content-management/attendance/components/AttendanceList";
import VenueList from "../../feature/content-management/venue/components/VenueList";

// Import actual data
import { CategoryCardData } from "../../feature/content-management/category/data/CategoryMockData";
import { EventCardData } from "../../feature/content-management/event/data/EventMockData";
import { FeaturedCardData } from "../../feature/content-management/featured/data/FeaturedMockData";
import { NewsCardData } from "../../feature/content-management/news/data/NewsMockData";
import { NotifCardData } from "../../feature/content-management/notification/data/NotifMockData";
import { RecruitmentCardData } from "../../feature/content-management/recruitment/data/RecruitmentMockData";
import { VenueCardData } from "../../feature/content-management/venue/data/VenueMockData";

export default function ContentManagement() {
    const { type } = useParams();

    if (type === "attendance") {
        return <AttendanceList />;
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
            case "venue": return "Quản lý Địa điểm";
            default: return "Quản lý nội dung";
        }
    };

    const getDescription = () => {
        switch (type) {
            case "category": return "Quản lý danh mục sự kiện và các tùy chọn";
            case "event": return "Duyệt sự kiện từ sinh viên · Quản lý sự kiện từ doanh nghiệp & tổ chức";
            case "featured": return "Quản lý sự kiện hiển thị nổi bật trên trang chủ";
            case "news": return "Tạo, chỉnh sửa và phê duyệt tin tức";
            case "notification": return "Gửi thông báo đến người dùng theo phân đoạn";
            case "recruitment": return "Quản lý bài tuyển CTV/TNV · Duyệt đơn ứng tuyển · Xem câu trả lời";
            case "attendance": return "Check-in/out QR · Thủ công · Quản lý participants · Nhật ký điểm danh";
            case "venue": return "Quản lý địa điểm tổ chức sự kiện · Kiểm tra sức chứa · Admin chỉnh sửa & xóa";
            default: return "Quản lý và điều phối nội dung hệ thống";
        }
    };



    const currentCardData = () => {
        switch (type) {
            case "category": return CategoryCardData;
            case "event": return EventCardData;
            case "featured": return FeaturedCardData;
            case "news": return NewsCardData;
            case "notification": return NotifCardData;
            case "recruitment": return RecruitmentCardData;
            case "venue": return VenueCardData;
            default: return CategoryCardData;
        }
    };

    const renderContent = () => {
        switch (type) {
            case "category": return <CategoryList />;
            case "event": return <EventList />;
            case "featured": return <FeaturedList />;
            case "news": return <NewsList />;
            case "notification": return <NotifList />;
            case "recruitment": return <RecruitmentList />;
            case "venue": return <VenueList />;
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
                {cards.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2 items-center justify-center bg-white p-6 py-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <p className={`text-3xl font-bold ${item.color || 'text-gray-800'}`}>{item.value}</p>
                        <h1 className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-wider">{item.title}</h1>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-6">
                <GroupFilter setFilter={(data) => console.log("data", data)} />
                <section className="flex flex-col gap-8">
                    {renderContent()}
                </section>
            </div>
        </div>
    );
}

