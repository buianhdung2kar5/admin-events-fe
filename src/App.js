import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainRoutes from "./config/layouts/MainRoutes";
import Navbar from "./config/layouts/Navbar";
function App() {
  return (
   <BrowserRouter basename="/admin-events-fe" >
   <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
    <Navbar/>
    <div className="flex-1 w-full min-w-0 overflow-hidden p-4 lg:p-8">
      <MainRoutes/>
    </div>
   </div>
   </BrowserRouter>
  );
}

export default App;
