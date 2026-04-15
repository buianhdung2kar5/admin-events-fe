import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import GroupFilter from "../../feature/user-management/user/components/GroupFilter";

// Import actual components
import CategoryList from "../../feature/content-management/category/components/CategoryList";
import PostList from "../../feature/content-management/post/components/PostList";
import FeaturedList from "../../feature/content-management/featured/components/FeaturedList";
import NewsList from "../../feature/content-management/news/components/NewsList";
import NotifList from "../../feature/content-management/notification/components/NotifList";

// Import actual data
import { CategoryCardData } from "../../feature/content-management/category/data/CategoryMockData";
import { PostCardData } from "../../feature/content-management/post/data/PostMockData";
import { FeaturedCardData } from "../../feature/content-management/featured/data/FeaturedMockData";
import { NewsCardData } from "../../feature/content-management/news/data/NewsMockData";
import { NotifCardData } from "../../feature/content-management/notification/data/NotifMockData";

export default function ContentManagement() {
    const { type } = useParams();

    const getTitle = () => {
        switch (type) {
            case "category": return "Quản lý danh mục";
            case "post": return "Quản lý bài đăng";
            case "featured": return "Sự kiện nổi bật";
            case "news": return "Quản lý tin tức";
            case "notification": return "Thông báo hệ thống";
            default: return "Quản lý nội dung";
        }
    };

    const getDescription = () => {
        switch (type) {
            case "category": return "Quản lý danh mục sự kiện và các tùy chọn";
            case "post": return "Duyệt bài đăng từ sinh viên · Giám sát bài đăng từ doanh nghiệp";
            case "featured": return "Quản lý sự kiện hiển thị nổi bật trên trang chủ";
            case "news": return "Tạo, chỉnh sửa và phê duyệt tin tức";
            case "notification": return "Gửi thông báo đến người dùng theo phân đoạn";
            default: return "Quản lý và điều phối nội dung hệ thống";
        }
    };

    const getBtnText = () => {
        switch (type) {
            case "category": return "Tạo danh mục";
            case "post": return "Tạo bài đăng";
            case "featured": return "Thêm sự kiện nổi bật";
            case "news": return "Tạo tin tức";
            case "notification": return "Tạo thông báo";
            default: return "Thêm mới";
        }
    };

    const currentCardData = () => {
        switch (type) {
            case "category": return CategoryCardData;
            case "post": return PostCardData;
            case "featured": return FeaturedCardData;
            case "news": return NewsCardData;
            case "notification": return NotifCardData;
            default: return CategoryCardData;
        }
    };

    const renderContent = () => {
        switch (type) {
            case "category": return <CategoryList />;
            case "post": return <PostList />;
            case "featured": return <FeaturedList />;
            case "news": return <NewsList />;
            case "notification": return <NotifList />;
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
                <button className="flex items-center gap-2 bg-[#0092B8] text-white px-5 py-2.5 rounded-xl hover:bg-[#007a99] transition-colors shadow-sm font-semibold">
                    <Plus size={20} />
                    {getBtnText()}
                </button>
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

