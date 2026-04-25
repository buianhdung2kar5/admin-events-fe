import { Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard/page";
import UserManagement from "../pages/user-management/page";
import ContentManagement from "../pages/content-management/page";
import FinancialManagement from "../pages/financial-management/page";
import SettingsPage from "../pages/settings/page";
import LoginPage from "../pages/login/page";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function Path() {
    return [
        // Public route
        {
            path: "/login",
            element: <LoginPage />,
        },
        // Protected routes
        {
            path: "/",
            element: <Navigate to="/dashboard" />,
        },
        {
            path: "/dashboard",
            element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        },
        {
            path: "*",
            element: <Navigate to="/dashboard" />,
        },
        {
            path: "/user-management/:type?",
            element: <ProtectedRoute><UserManagement /></ProtectedRoute>,
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
    ];
}
