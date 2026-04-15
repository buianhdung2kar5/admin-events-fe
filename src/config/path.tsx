import { Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard/page";
import UserManagement from "../pages/user-management/page";
import ContentManagement from "../pages/content-management/page";
import FinancialManagement from "../pages/financial-management/page";
import SettingsPage from "../pages/settings/page";

export default function Path(){
    return [
        {
            path:"/",
            element:<Navigate to="/dashboard" />
        },
        {
            path:"/dashboard",
            element:<Dashboard />
        },
        {
            path:"*",
            element:<Navigate to="/dashboard" />
        },
        {
            path:"/user-management/:type?",
            element:<UserManagement />
        },
        {
            path:"/content-management/:type?",
            element:<ContentManagement />
        },
        {
            path:"/finance-management/:type?",
            element:<FinancialManagement />
        },
        {
            path:"/settings",
            element:<SettingsPage />
        }
    ]
}
