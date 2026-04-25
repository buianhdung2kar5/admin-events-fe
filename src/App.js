import { BrowserRouter, useLocation } from "react-router-dom";
import MainRoutes from "./config/layouts/MainRoutes";
import Navbar from "./config/layouts/Navbar";
import AuthProvider from "./auth/AuthProvider";

/** Ẩn Navbar trên trang /login */
function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return <MainRoutes />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 w-full min-w-0 overflow-hidden p-4 lg:p-8">
        <MainRoutes />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/admin-events-fe">
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
