import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    // Sử dụng bg-[#f8fafc] (Xám xanh rất nhạt) để hài hòa với Sidebar xanh nước biển
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      
      {/* Sidebar - Đảm bảo bên trong Sidebar có h-full và bg-blue-700 */}
      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Nên có nền trắng và shadow nhẹ để tách biệt với nội dung */}
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Nội dung chính */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {/* Outlet sẽ render các trang như Employee, Payroll... */}
          <div className="max-w-[1600px] mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}