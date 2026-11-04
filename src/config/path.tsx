import { Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard/page";
import UserManagement from "../pages/user-management/page";
import ContentManagement from "../pages/content-management/page";
import FinancialManagement from "../pages/financial-management/page";
import SettingsPage from "../pages/settings/page";
import LoginPage from "../pages/login/page";
import ProtectedRoute from "../auth/ProtectedRoute";
import NewsEditPage from "../pages/content-management/news-edit/page";
import UserDetailPage from "../pages/user-management/user-detail/page";
import ReportDetailPage from "../pages/user-management/report-detail/page";
import OrganizationDetailPage from "../pages/user-management/organization-detail/page";
import EventDetailPage from "../pages/content-management/event-detail/page";

export default function Path() {
    return [
        {
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/",
            element: <Navigate to="/dashboard" />,
        },
        {
            path: "/dashboard",
            element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        },
        {
            path: "/user-management/users/:userId",
            element: <ProtectedRoute><UserDetailPage /></ProtectedRoute>,
        },
        {
            path: "/user-management/report/:id",
            element: <ProtectedRoute><ReportDetailPage /></ProtectedRoute>,
        },
        {
            path: "/user-management/organization/:id",
            element: <ProtectedRoute><OrganizationDetailPage /></ProtectedRoute>,
        },
        {
            path: "/user-management/:type?",
            element: <ProtectedRoute><UserManagement /></ProtectedRoute>,
        },
        {
            path: "/content-management/news/new",
            element: <ProtectedRoute><NewsEditPage /></ProtectedRoute>,
        },
        {
            path: "/content-management/news/:newsId",
            element: <ProtectedRoute><NewsEditPage /></ProtectedRoute>,
        },
        {
            path: "/content-management/events/:eventId",
            element: <ProtectedRoute><EventDetailPage /></ProtectedRoute>,
        },
        {
            path: "/content-management/:type?",
            element: <ProtectedRoute><ContentManagement /></ProtectedRoute>,
        },
        {
            path: "/finance-management/:type?",
            element: <ProtectedRoute><FinancialManagement /></ProtectedRoute>,
        },
        {
            path: "/settings",
            element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
        },
        {
            path: "*",
            element: <Navigate to="/dashboard" />,
        },
    ];
}
