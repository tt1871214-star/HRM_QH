import { useEffect, useState } from "react";
import { 
  Users, Wallet, CalendarCheck, UserMinus, Clock, 
  TrendingUp, Award, ClipboardList, ChevronRight 
} from "lucide-react";

export default function Reports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/report/")
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!report) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-xl font-bold text-blue-800 animate-pulse">
          Đang tải dữ liệu báo cáo...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <span className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
              <TrendingUp size={28} />
            </span>
            Phân Tích Nhân Sự
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Báo cáo tổng quan về tình hình nhân viên, lương và chuyên cần.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm text-slate-500 font-semibold">
          Tháng {new Date().getMonth() + 1} / {new Date().getFullYear()}
        </div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <StatCard 
          icon={<Users className="text-blue-600" />} 
          label="Tổng nhân viên" 
          value={report.total_employees} 
          color="blue" 
        />
        <StatCard 
          icon={<Wallet className="text-emerald-600" />} 
          label="Tổng quỹ lương" 
          value={`${report.total_salary.toLocaleString()} ₫`} 
          color="emerald" 
        />
        <StatCard 
          icon={<CalendarCheck className="text-cyan-600" />} 
          label="Có mặt" 
          value={report.attendance_summary.present} 
          color="cyan" 
        />
        <StatCard 
          icon={<UserMinus className="text-rose-600" />} 
          label="Vắng mặt" 
          value={report.attendance_summary.absent} 
          color="rose" 
        />
        <StatCard 
          icon={<Clock className="text-amber-600" />} 
          label="Nghỉ phép" 
          value={report.attendance_summary.leave} 
          color="amber" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= TOP SALARY SECTION ================= */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Award className="text-amber-500" /> Thu nhập cao nhất
            </h2>
          </div>

          <div className="space-y-4">
            {report.top_salary.map((item, index) => (
              <div key={index} className="group flex justify-between items-center bg-slate-50 hover:bg-blue-600 hover:text-white transition-all duration-300 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-blue-600 text-sm group-hover:bg-blue-500 group-hover:text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-700 group-hover:text-white transition-colors uppercase text-sm">
                      {item.employee_name}
                    </h3>
                    <p className="text-slate-400 text-[11px] group-hover:text-blue-100">
                      Mức lương thỏa thuận
                    </p>
                  </div>
                </div>
                <div className="font-black text-emerald-600 group-hover:text-white">
                  {item.salary.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ATTENDANCE TABLE SECTION ================= */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="text-blue-600" /> Chi tiết chuyên cần
            </h2>
            <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg text-sm font-bold transition-all">
              Xem tất cả
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4">Nhân viên</th>
                  <th className="px-6 py-4 text-center">Ngày công</th>
                  <th className="px-6 py-4 text-center">Vắng mặt</th>
                  <th className="px-6 py-4 text-center">Nghỉ phép</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.attendance.map((a, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {a.employee_name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{a.employee_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-emerald-600">
                      {a.work_days}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold text-[11px] ${a.absent_days > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                        {a.absent_days}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-amber-500">
                      {a.leave_days}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component cho Card Summary
function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "border-blue-500 text-blue-600 bg-blue-50/30",
    emerald: "border-emerald-500 text-emerald-600 bg-emerald-50/30",
    rose: "border-rose-500 text-rose-600 bg-rose-50/30",
    amber: "border-amber-500 text-amber-600 bg-amber-50/30",
    cyan: "border-cyan-500 text-cyan-600 bg-cyan-50/30",
  };

  return (
    <div className={`bg-white rounded-3xl p-6 border-b-4 ${colors[color]} shadow-sm hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
        <ChevronRight size={16} className="text-slate-300" />
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</p>
      <h2 className="text-2xl font-black text-slate-800 mt-2 tracking-tight">
        {value}
      </h2>
    </div>
  );
}