import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

import {
  Users,
  DollarSign,
  Activity,
  Award,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState({
    payrolls: [],
    attendance: [],
    employees: [],
    loading: true
  });

  const API_URLS = {
    payroll: "http://127.0.0.1:5000/payroll/",
    attendance: "http://127.0.0.1:5000/attendance/",
    employee: "http://127.0.0.1:5000/employee"
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [pRes, aRes, eRes] = await Promise.all([
          axios.get(API_URLS.payroll),
          axios.get(API_URLS.attendance),
          axios.get(API_URLS.employee)
        ]);

        setData({
          payrolls: Array.isArray(pRes.data) ? pRes.data : [],
          attendance: Array.isArray(aRes.data) ? aRes.data : [],
          employees: Array.isArray(eRes.data) ? eRes.data : [],
          loading: false
        });

      } catch (error) {
        console.error("Lỗi đồng bộ Dashboard:", error);
        setData(prev => ({
          ...prev,
          loading: false
        }));
      }
    };

    fetchAllData();
  }, []);

  // ===============================
  // TÍNH TOÁN
  // ===============================

  const totalNetSalary = data.payrolls.reduce(
    (sum, p) => sum + Number(p.net_salary || 0),
    0
  );

  const totalWork = data.attendance.reduce(
    (sum, r) => sum + Number(r.WorkDays || r.work_days || 0),
    0
  );

  const totalAbsent = data.attendance.reduce(
    (sum, r) => sum + Number(r.AbsentDays || r.absent_days || 0),
    0
  );

  const totalLeave = data.attendance.reduce(
    (sum, r) => sum + Number(r.LeaveDays || r.leave_days || 0),
    0
  );

  const attendancePieData = [
    {
      name: "Đi làm",
      value: totalWork,
      color: "#4F46E5"
    },
    {
      name: "Vắng mặt",
      value: totalAbsent,
      color: "#F43F5E"
    },
    {
      name: "Nghỉ phép",
      value: totalLeave,
      color: "#F59E0B"
    }
  ];

  // ===============================
  // TOP NHÂN VIÊN
  // ===============================

  const topEmployees = [...data.payrolls]
    .map(p => {
      const att = data.attendance.find(
        a =>
          (a.employee_id || a.EmployeeID) ===
          (p.employee_id || p.EmployeeID)
      ) || {};

      return {
        name: p.employee_name || "N/A",
        salary: Number(p.net_salary || 0),
        days: Number(att.WorkDays || att.work_days || 0)
      };
    })
    .sort((a, b) => b.salary - a.salary)
    .slice(0, 3);

  const formatVND = (val) =>
    new Intl.NumberFormat("vi-VN").format(val) + "đ";

  // ===============================
  // LOADING
  // ===============================

  if (data.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>

          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">
            Đang đồng bộ dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
            <Zap className="text-indigo-600" fill="currentColor" />
            Dashboard Hệ Thống
          </h1>

          <p className="text-slate-500 text-sm font-bold ml-1">
            Dữ liệu nhân sự & tiền lương thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-slate-600 font-bold text-sm">

          <Calendar size={16} className="text-indigo-500" />

          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </div>
      </div>

      {/* CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Link to="/employee">
          <StatCard
            icon={<Users />}
            label="Tổng nhân sự"
            value={data.employees.length}
            unit="Thành viên"
            color="text-blue-600"
            bg="bg-white"
            border="border-b-4 border-blue-600"
          />
        </Link>

        <Link to="/payroll">
          <StatCard
            icon={<DollarSign />}
            label="Tổng quỹ lương"
            value={formatVND(totalNetSalary)}
            unit="Tháng hiện tại"
            color="text-emerald-600"
            bg="bg-white"
            border="border-b-4 border-emerald-600"
          />
        </Link>

        <Link to="/attendance">
          <StatCard
            icon={<Activity />}
            label="Ngày công tổng"
            value={totalWork}
            unit="Toàn công ty"
            color="text-orange-500"
            bg="bg-white"
            border="border-b-4 border-orange-500"
          />
        </Link>

        <Link to="/payroll">
          <StatCard
            icon={<TrendingUp />}
            label="Thực lĩnh bình quân"
            value={formatVND(
              totalNetSalary / (data.payrolls.length || 1)
            )}
            unit="VNĐ / Nhân viên"
            color="text-indigo-600"
            bg="bg-white"
            border="border-b-4 border-indigo-600"
          />
        </Link>
      </div>

      {/* CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* BAR CHART */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">

          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              Phân tích thu nhập cá nhân
            </h3>

            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase">
              Đơn vị: VNĐ
            </span>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={data.payrolls}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="employee_name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 800,
                    fill: "#94A3B8"
                  }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "#94A3B8"
                  }}
                />

                <Tooltip
                  cursor={{ fill: "#F8FAFC" }}
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow:
                      "0 20px 25px -5px rgb(0 0 0 / 0.1)"
                  }}
                />

                <Bar
                  dataKey="net_salary"
                  fill="#4F46E5"
                  radius={[10, 10, 0, 0]}
                  name="Lương thực nhận"
                  barSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col">

          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">
            Tỷ lệ chuyên cần tháng
          </h3>

          <div className="h-[280px] flex-grow">

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={attendancePieData}
                  innerRadius={80}
                  outerRadius={105}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {attendancePieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-center">

            <div className="p-3 bg-indigo-50 rounded-2xl">
              <p className="text-[9px] font-black text-indigo-400 uppercase">
                Tổng công
              </p>

              <p className="text-lg font-black text-indigo-700">
                {totalWork}
              </p>
            </div>

            <div className="p-3 bg-rose-50 rounded-2xl">
              <p className="text-[9px] font-black text-rose-400 uppercase">
                Vắng/Phép
              </p>

              <p className="text-lg font-black text-rose-700">
                {totalAbsent + totalLeave}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TOP EMPLOYEE */}
      <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">

        <div className="flex items-center gap-4 mb-10">

          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-inner">
            <Award size={28} />
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              Gương mặt tiêu biểu tháng
            </h3>

            <p className="text-xs text-slate-400 font-bold">
              Xếp hạng dựa trên thu nhập và kỷ luật lao động
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {topEmployees.map((emp, index) => (
            <div
              key={index}
              className="relative group p-8 rounded-[32px] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2"
            >

              <div
                className={`absolute -top-4 -right-4 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg rotate-12 group-hover:rotate-0 transition-transform text-lg ${
                  index === 0
                    ? "bg-gradient-to-br from-amber-300 to-amber-500"
                    : index === 1
                    ? "bg-slate-400"
                    : "bg-orange-400"
                }`}
              >
                {index + 1}
              </div>

              <div className="flex flex-col items-center text-center space-y-4">

                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm text-3xl group-hover:scale-110 transition-transform border border-slate-50">
                  👤
                </div>

                <div>
                  <h4 className="font-black text-slate-700 uppercase text-base mb-1 tracking-tight">
                    {emp.name}
                  </h4>

                  <p className="text-emerald-600 font-black text-lg">
                    {formatVND(emp.salary)}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase shadow-md shadow-indigo-100">

                  <Zap size={12} fill="currentColor" />

                  {emp.days} Ngày công
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===============================
// COMPONENT CARD
// ===============================

const StatCard = ({
  icon,
  label,
  value,
  unit,
  color,
  bg,
  border
}) => (
  <div
    className={`${bg} ${border} p-7 rounded-[32px] shadow-sm flex flex-col justify-between transition-all hover:shadow-lg hover:bg-slate-50 hover:-translate-y-1 cursor-pointer`}
  >

    <div className="flex justify-between items-start mb-6">

      <div
        className={`p-3 rounded-2xl bg-slate-50 shadow-inner ${color}`}
      >
        {React.cloneElement(icon, { size: 26 })}
      </div>

      <span className="text-[9px] font-black uppercase text-slate-400 bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
        {unit}
      </span>
    </div>

    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
        {label}
      </p>

      <p
        className={`text-2xl font-black ${color} truncate tracking-tighter`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default Dashboard;