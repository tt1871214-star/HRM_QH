import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Shield, 
  FileText, 
  LogOut, 
  Menu, 
  BarChart3, 
  Bell // Đã thêm Bell vào đây
} from "lucide-react";
import { authService } from "./services/authService";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import Payroll from "./pages/Payroll";
import Security from "./pages/Security";
import Documents from "./pages/Documents";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";

export default function App() {
  const [open, setOpen] = useState(true);
  const [userRole, setUserRole] = useState(authService.getRole());

  useEffect(() => {
    const checkRole = () => setUserRole(authService.getRole());
    window.addEventListener("storage", checkRole);
    return () => window.removeEventListener("storage", checkRole);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={() => setUserRole(authService.getRole())} />} />
        
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-slate-50 overflow-hidden">
              
              {/* SIDEBAR */}
              <aside className={`${open ? "w-64" : "w-20"} bg-blue-800 text-white transition-all duration-300 flex flex-col shadow-2xl z-30`}>
                <div className="h-20 flex items-center px-6 border-b border-white/10 font-bold text-xl tracking-wider">
                  {open ? "HRM SYSTEM" : "H"}
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  <MenuLink to="/" icon={<LayoutDashboard size={20}/>} label="Dashboard" open={open} />
                  <MenuLink to="/employee" icon={<Users size={20}/>} label="Employees" open={open} />
                  <MenuLink to="/documents" icon={<FileText size={20}/>} label="Documents" open={open} />
                  <MenuLink to="/reports" icon={<BarChart3 size={20}/>} label="Reports" open={open} />
                  
                  {/* ĐỔI LOGO BELL TẠI ĐÂY */}
                  <MenuLink to="/notifications" icon={<Bell size={20}/>} label="Notifications" open={open} />
                  
                  {userRole === "admin" && (
                    <>
                      <div className="pt-4 pb-2 border-t border-white/10 mt-4 text-[10px] font-bold text-blue-300 italic">
                        {open ? "ADMIN TOOLS" : "---"}
                      </div>
                      <MenuLink to="/payroll" icon={<Wallet size={20}/>} label="Bảng lương" open={open} />
                      <MenuLink to="/security" icon={<Shield size={20}/>} label="Bảo mật hệ thống" open={open} />
                    </>
                  )}
                </nav>

                <button 
                  onClick={() => {
                    authService.logout();
                    setUserRole("guest");
                  }} 
                  className="p-6 flex items-center gap-3 hover:bg-red-600/20 text-red-200 transition-colors border-t border-white/10"
                >
                  <LogOut size={20}/> {open && <span className="font-medium">Thoát hệ thống</span>}
                </button>
              </aside>

              {/* MAIN CONTENT */}
              <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8 justify-between shadow-sm">
                  <button onClick={() => setOpen(!open)} className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-600">
                    <Menu size={24} />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Đang đăng nhập</p>
                      <p className="text-sm font-bold text-blue-700">
                        {userRole === "admin" ? "Quản lý (Admin)" : "Nhân sự (User)"}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${userRole === "admin" ? "bg-red-500" : "bg-green-500"}`}>
                      {userRole === "admin" ? "AD" : "HR"}
                    </div>
                  </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto bg-[#f8fafc]">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/employee" element={<Employee />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/notifications" element={<Notifications />} /> 
                    
                    <Route path="/payroll" element={<ProtectedRoute allowedRoles={['admin']}><Payroll /></ProtectedRoute>} />
                    <Route path="/security" element={<ProtectedRoute allowedRoles={['admin']}><Security /></ProtectedRoute>} />
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function MenuLink({ to, icon, label, open }) {
  return (
    <NavLink to={to} end className={({ isActive }) => 
      `flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group
      ${isActive ? "bg-white text-blue-700 shadow-lg" : "hover:bg-white/10 text-blue-100"}`
    }>
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      {open && <span className="text-sm font-semibold whitespace-nowrap">{label}</span>}
    </NavLink>
  );
}