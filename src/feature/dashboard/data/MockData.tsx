import { 
    Users, Building2, Calendar, Coins, FileText, Briefcase, 
    User, Flag, CheckCircle, Megaphone, ArrowRight, Star, Shield, Settings
} from "lucide-react";

export interface StatisticItem {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    growth: string;
    description: string;
}

export interface ActivityItem {
    id: string;
    content: string;
    time: string;
    icon: React.ReactNode;
    color: string;
}

export interface TopEventItem {
    id: string;
    rank: number;
    name: string;
    location: string;
    registrations: number;
    imageUrl: string;
}
export interface AccessFastItem {
    icon: React.ReactNode;
    title: string;
    path: string;
}

export const DataStatistic: StatisticItem[] = [
    {
        title: "Tổng người dùng",
        value: "1,247",
        icon: <Users size={20} />,
        color: "cyan",
        growth: "↑ +23",
        description: ""
    },
    {
        title: "Tổ chức đối tác",
        value: "357",
        icon: <Building2 size={20} />,
        color: "purple",
        growth: "↑ +8",
        description: ""
    },
    {
        title: "Sự kiện",
        value: "17",
        icon: <Calendar size={20} />,
        color: "blue",
        growth: "+0 đang diễn",
        description: ""
    },
    {
        title: "Doanh thu tháng",
        value: "12.4Mđ",
        icon: <Coins size={20} />,
        color: "green",
        growth: "↑ +18%",
        description: ""
    },
    {
        title: "Tin tức",
        value: "3",
        icon: <FileText size={20} />,
        color: "orange",
        growth: "+3 hôm nay",
        description: ""
    },
    {
        title: "Việc làm",
        value: "6",
        icon: <Briefcase size={20} />,
        color: "teal",
        growth: "↑ +5 mới",
        description: ""
    }
];

export const RecentActivities: ActivityItem[] = [
    {
        id: "1",
        content: "Nguyễn Văn A đăng ký tài khoản mới",
        time: "3 phút trước",
        icon: <User size={18} />,
        color: "cyan"
    },
    {
        id: "2",
        content: "CLB Tech BK tạo sự kiện \"AI Workshop 2025\"",
        time: "12 phút trước",
        icon: <Calendar size={18} />,
        color: "blue"
    },
    {
        id: "3",
        content: "Giao dịch 150,000đ từ Trần Thị B đang chờ xác nhận",
        time: "25 phút trước",
        icon: <Coins size={18} />,
        color: "yellow"
    },
    {
        id: "4",
        content: "Báo cáo mới: Tài khoản giả mạo CLB NEU",
        time: "1 giờ trước",
        icon: <Flag size={18} />,
        color: "red"
    },
    {
        id: "5",
        content: "Đã duyệt tài liệu xác thực của Trần Bích Ngọc",
        time: "2 giờ trước",
        icon: <CheckCircle size={18} />,
        color: "green"
    },
    {
        id: "6",
        content: "Gửi thông báo đến 890 sinh viên về tính năng Portfolio",
        time: "3 giờ trước",
        icon: <Megaphone size={18} />,
        color: "purple"
    }
];

export const TopEvents: TopEventItem[] = [
    {
        id: "1",
        rank: 1,
        name: "NEU Career Fair 2025",
        location: "Đại học Kinh tế Quốc dân",
        registrations: 1567,
        imageUrl: "https://picsum.photos/id/1/200/200"
    },
    {
        id: "2",
        rank: 2,
        name: "Marathon Sinh viên Hà Nội",
        location: "Hội Sinh viên TDTT HN",
        registrations: 756,
        imageUrl: "https://picsum.photos/id/2/200/200"
    },
    {
        id: "3",
        rank: 3,
        name: "Giao lưu với Doanh nhân thành đạt",
        location: "Đại học Kinh tế Quốc dân",
        registrations: 423,
        imageUrl: "https://picsum.photos/id/3/200/200"
    },
    {
        id: "4",
        rank: 4,
        name: "Hội thảo Công nghệ AI 2025",
        location: "CLB Công nghệ BK",
        registrations: 300,
        imageUrl: "https://picsum.photos/id/4/200/200"
    },
    {
        id: "5",
        rank: 5,
        name: "Ngày hội Khởi nghiệp Sinh viên",
        location: "Trung tâm Khởi nghiệp HCMUT",
        registrations: 267,
        imageUrl: "https://picsum.photos/id/5/200/200"
    }
];

export const AccessFastData: AccessFastItem[] = [
    {
        icon:<User size={20} />,
        title:"Người dùng",
        path:"/users-management"
    },
    {
        icon:<Calendar size={20} />,
        title:"Sự kiện",
        path:"/events"
    },
    {
        icon:<Coins size={20} />,
        title:"Tài chính",
        path:"/finance"
    },
    {
        icon:<FileText size={20} />,
        title:"Tin tức",
        path:"/news"
    },
    {
        icon:<Briefcase size={20} />,
        title:"Việc làm",
        path:"/jobs"
    },
    {
        icon:<Shield size={20} />,
        title:"Xác thực & Báo cáo",
        path:"/verification-reporting"
    },
    {
        icon:<Settings size={20} />,
        title:"Cài đặt",
        path:"/settings"
    }
]    