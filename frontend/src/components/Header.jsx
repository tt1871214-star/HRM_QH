import {
  Bell,
  Search,
  Menu,
  ChevronDown,
} from "lucide-react";

export default function Header({
  openSidebar,
  setOpenSidebar,
}) {

  return (
    // Sử dụng backdrop-blur để tạo cảm giác cao cấp khi cuộn trang
    <div className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">

      {/* LEFT - Thông tin chào mừng */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setOpenSidebar(!openSidebar)}
          className="p-2.5 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            HRM Dashboard
          </h1>
          <p className="text-[12px] text-slate-400 font-medium">
            Chào buổi sáng, Admin! 👋
          </p>
        </div>
      </div>

      {/* RIGHT - Công cụ và Profile */}
      <div className="flex items-center gap-6">

        {/* SEARCH - Làm gọn và tinh tế hơn */}
        <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-72 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            className="bg-transparent outline-none ml-3 w-full text-sm text-slate-600 placeholder:text-slate-400"
          />
        </div>

        {/* NOTIFICATION - Hiệu ứng ping cho thông báo */}
        <button className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        {/* SEPARATOR */}
        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

        {/* USER PROFILE - Gọn gàng hơn */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/100"
              alt="avatar"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-100 transition-all"
            />
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                Admin Strator
              </h3>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Quản trị viên
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}