import { BrowserRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import MainRoutes from "./config/layouts/MainRoutes";
import Navbar from "./config/layouts/Navbar";
import AuthProvider from "./auth/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});


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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
