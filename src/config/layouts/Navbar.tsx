import { 
  Home, Users, FileText, Settings, Menu, X, DollarSign, Shield, 
  ChevronDown, ChevronRight 
} from "lucide-react";
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
    {
        name: "Tổng quan",
        path: "/dashboard",
        icon: <Home size={20} />
    },
    {
        name: "Quản lý người dùng",
        path: "/user-management",
        icon: <Users size={20} />,
        options: [
          {
            name: "Người dùng",
            path: "/user-management/user"
          },
          {
            name: "Tổ chức",
            path: "/user-management/organization"
          },
          {
            name: "Xác thực tài liệu",
            path: "/user-management/verify-document"
          }
        ]
    },
    {
        name: "Quản lý nội dung",
        path: "/content-management",
        icon: <FileText size={20} />,
        options: [
          {
            name: "Danh mục",
            path: "/content-management/category"
          },
          {
            name: "Bài đăng",
            path: "/content-management/post"
          },
          {
            name: "Sự kiện nổi bật",
            path: "/content-management/featured"
          },
          {
            name: "Tin tức",
            path: "/content-management/news"
          },
          {
            name: "Thông báo hệ thống",
            path: "/content-management/notification"
          }
        ]
    },

    {
        name: "Quản lý tài chính",
        path: "/finance-management",
        icon: <DollarSign size={20} />,
        options:[
          {
            name: "Gói Coin",
            path: "/finance-management/collection-coin"
          },
          {
            name: "Giao dịch",
            path: "/finance-management/transaction"
          },
          {
            name: "Momo Wallet",
            path: "/finance-management/momo-wallet"
          }
        ]
    },
    {
        name: "Xác thực & Báo cáo",
        path: "/verification-reporting",
        icon: <Shield size={20} />
    },
    {
        name: "Cài đặt",
        path: "/settings",
        icon: <Settings size={20} />
    }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Quản lý người dùng"]);
  const location = useLocation();

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-full lg:min-w-[20%] lg:w-[20%] bg-white lg:min-h-screen border-b lg:border-r border-gray-200">
      {/* Mobile Header */}
      <div className="flex justify-between items-center px-6 py-4 lg:hidden">
        <h1 className="text-xl font-bold text-gray-800">Admin</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Nav List */}
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col px-6 py-4 lg:px-8 lg:py-10 gap-2 lg:gap-3`}>
        <div className="hidden lg:block mb-6 lg:mb-10 pl-2">
          <h1 className="text-2xl font-black text-[#0092B8] tracking-tight italic">S-EVENTS</h1>
        </div>
        
        {navItems.map((item, index) => {
            const active = isActive(item.path);
            const hasOptions = item.options && item.options.length > 0;
            const isExpanded = expandedItems.includes(item.name);

            return (
              <div key={index} className="flex flex-col gap-1">
                <div 
                  className={`flex justify-between items-center cursor-pointer p-3 rounded-xl transition-all duration-200 
                    ${active ? 'bg-blue-50 text-[#0092B8]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
                  onClick={() => hasOptions ? toggleExpand(item.name) : null}
                >
                  <NavLink 
                    to={item.path} 
                    className="flex gap-3 items-center flex-1"
                    onClick={(e) => {
                      if (hasOptions) {
                        // If it has options, prevent navigation on the main item if it's just a folder,
                        // or allow navigation and just toggle. 
                        // In this case, standard behavior is clicking the item goes to default, 
                        // and clicking arrow toggles. But here we toggle on the whole row.
                      }
                    }}
                  >
                    {item.icon}
                    <span className="font-bold text-sm tracking-wide">{item.name}</span>
                  </NavLink>
                  {hasOptions && (
                    <button onClick={(e) => { e.stopPropagation(); toggleExpand(item.name); }}>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  )}
                </div>

                {hasOptions && isExpanded && (
                  <div className="flex flex-col gap-1 ml-9 mt-1 border-l-2 border-gray-100 pl-4">
                    {item.options?.map((opt, optIdx) => {
                      const optActive = location.pathname === opt.path || (opt.path === "/user-management/user" && location.pathname === "/user-management");
                      return (
                        <NavLink 
                          key={optIdx} 
                          to={opt.path}
                          className={`py-2 text-sm font-semibold transition-colors 
                            ${optActive ? 'text-[#0092B8]' : 'text-gray-400 hover:text-gray-700'}`}
                        >
                          {opt.name}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
}
