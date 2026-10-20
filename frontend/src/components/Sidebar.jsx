import {
  LayoutDashboard,
  Users,
  Wallet,
  Bell,
  FileText,
  CalendarCheck,
  BarChart3,
  Shield,
  LogOut, // Thêm icon Logout
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const menus = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
  { name: "Employee", path: "/employee", icon: <Users size={18} /> },
  { name: "Payroll", path: "/payroll", icon: <Wallet size={18} /> },
  { name: "Notifications", path: "/notifications", icon: <Bell size={18} /> },
  { name: "Documents", path: "/documents", icon: <FileText size={18} /> },
  { name: "Attendance", path: "/attendance", icon: <CalendarCheck size={18} /> },
  { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
  { name: "Security", path: "/security", icon: <Shield size={18} /> },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Thêm logic xóa token/session ở đây nếu cần
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-blue-700 text-white flex flex-col border-r border-white/10 shadow-2xl">
      
      {/* LOGO SECTION */}
      <div className="h-20 flex items-center px-6 mb-2">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-blue-700 font-extrabold shadow-lg">
          H
        </div>
        <div className="ml-3">
          <h1 className="font-bold text-lg tracking-tight text-white">HRM <span className="text-blue-200">Pro</span></h1>
          <p className="text-[10px] uppercase tracking-widest text-blue-100 font-semibold opacity-70">Management</p>
        </div>
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menus.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative
              ${
                isActive
                  ? "bg-white/20 text-white backdrop-blur-md shadow-inner"
                  : "hover:bg-white/10 text-blue-50 hover:text-white"
              }`
            }
          >
            <div className="transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </div>
            <span className="text-sm font-medium">{item.name}</span>
            
            {({ isActive }) => isActive && (
               <div className="absolute left-0 w-1 h-5 bg-white rounded-r-full" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM SECTION: USER & LOGOUT */}
      <div className="p-4 border-t border-white/10 space-y-2">
        
        {/* LOGOUT BUTTON - Đặt phía trên Profile để dễ nhìn */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-blue-100 hover:bg-red-500/20 hover:text-white transition-all duration-200 group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>

        {/* USER PROFILE CARD */}
        <div className="bg-white/10 border border-white/10 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-sm">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/100"
              alt="avatar"
              className="w-10 h-10 rounded-xl object-cover border-2 border-blue-400"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-blue-700 rounded-full"></div>
          </div>
          <div className="overflow-hidden">
            <h3 className="font-medium text-sm text-white truncate">Admin Strator</h3>
            <p className="text-[11px] text-blue-100/70 truncate text-left italic">hr.manager@work.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}