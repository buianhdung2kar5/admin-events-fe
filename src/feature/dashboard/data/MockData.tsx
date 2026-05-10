import { 
    Users, Calendar, FileText, Briefcase, Shield, Settings, Star
} from "lucide-react";

export interface AccessFastItem {
    icon: React.ReactNode;
    title: string;
    path: string;
}

export const AccessFastData: AccessFastItem[] = [
    { icon: <Users size={20} />,    title: "Người dùng",    path: "/user-management/users" },
    { icon: <Calendar size={20} />, title: "Sự kiện",       path: "/content-management/event" },
    { icon: <Star size={20} />,     title: "Nổi bật",       path: "/content-management/featured" },
    { icon: <FileText size={20} />, title: "Tin tức",       path: "/content-management/news" },
    { icon: <Briefcase size={20} />,title: "Tuyển CTV",     path: "/content-management/recruitment" },
    { icon: <Shield size={20} />,   title: "Xác thực",      path: "/user-management/verify-document" },
    { icon: <Settings size={20} />, title: "Cài đặt",       path: "/system-management/settings" },
];