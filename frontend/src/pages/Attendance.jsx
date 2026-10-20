import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);

  // ADD FORM
  const [formData, setFormData] = useState({
    employee_id: '',
    WorkDays: 0,
    AbsentDays: 0,
    LeaveDays: 0,
    AttendanceMonth: ''
  });

  // EDIT FORM
  const [editData, setEditData] = useState({
    AttendanceID: '',
    employee_id: '',
    WorkDays: 0,
    AbsentDays: 0,
    LeaveDays: 0,
    AttendanceMonth: ''
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:5000/attendance/";

  // FETCH ATTENDANCE
  const fetchAttendance = async () => {
    setLoading(true);

    try {
      const res = await axios.get(API_URL);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setRecords(data);
    } catch (error) {
      console.error("Fetch attendance error:", error);
    } finally {
      setLoading(false);
    }
  };

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/employees");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setEmployees(data);
    } catch (error) {
      console.error("Fetch employees error:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  // EXPORT EXCEL
  const exportToExcel = () => {
    if (records.length === 0) {
      alert("No data to export!");
      return;
    }

    const dataToExport = records.map((r) => ({
      ID: r.AttendanceID,
      Employee: r.employee_name || `ID: ${r.employee_id}`,
      Month: r.AttendanceMonth,
      WorkDays: r.WorkDays,
      AbsentDays: r.AbsentDays,
      LeaveDays: r.LeaveDays,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    XLSX.writeFile(
      workbook,
      `Attendance_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // ADD RECORD
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!formData.employee_id || !formData.AttendanceMonth) {
      alert("Please select employee and month!");
      return;
    }

    const payload = {
      employee_id: Number(formData.employee_id),
      attendance_month: formData.AttendanceMonth,
      work_days: Number(formData.WorkDays) || 0,
      absent_days: Number(formData.AbsentDays) || 0,
      leave_days: Number(formData.LeaveDays) || 0,
    };

    try {
      await axios.post(API_URL, payload);

      alert("Added successfully!");

      setFormData({
        employee_id: '',
        WorkDays: 0,
        AbsentDays: 0,
        LeaveDays: 0,
        AttendanceMonth: ''
      });

      fetchAttendance();
    } catch (error) {
      alert(error.response?.data?.error || error.message);
    }
  };

  // UPDATE RECORD
  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      employee_id: Number(editData.employee_id),
      attendance_month: editData.AttendanceMonth,
      work_days: Number(editData.WorkDays) || 0,
      absent_days: Number(editData.AbsentDays) || 0,
      leave_days: Number(editData.LeaveDays) || 0,
    };

    try {
      await axios.put(
        `${API_URL}${editData.AttendanceID}`,
        payload
      );

      alert("Updated successfully!");

      setShowEditModal(false);

      fetchAttendance();
    } catch (error) {
      alert(error.response?.data?.error || error.message);
    }
  };

  // DELETE
  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await axios.delete(`${API_URL}${id}`);

      fetchAttendance();
    } catch (error) {
      alert("Delete failed!");
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (r) => {
    setEditData({
      AttendanceID: r.AttendanceID,
      employee_id: r.employee_id,
      AttendanceMonth: r.AttendanceMonth,
      WorkDays: r.WorkDays,
      AbsentDays: r.AbsentDays,
      LeaveDays: r.LeaveDays,
    });

    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

        <div>
          <h1 className="text-3xl font-extrabold text-indigo-900">
            Attendance Management
          </h1>

          <p className="text-slate-500 text-sm">
            Monitor employee attendance records
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold"
        >
          📥 Export Excel
        </button>
      </div>

      {/* ADD FORM */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">

        <h2 className="text-xl font-bold text-indigo-700 mb-6">
          ➕ Add Attendance
        </h2>

        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5"
        >

          {/* EMPLOYEE */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Employee
            </label>

            <select
              value={formData.employee_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  employee_id: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mt-1"
            >
              <option value="">Select Employee</option>

              {employees.map((emp) => (
                <option
                  key={emp.id || emp.EmployeeID}
                  value={emp.id || emp.EmployeeID}
                >
                  {emp.name || emp.FullName}
                </option>
              ))}
            </select>
          </div>

          {/* MONTH */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Month
            </label>

            <input
              type="month"
              value={formData.AttendanceMonth}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  AttendanceMonth: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mt-1"
            />
          </div>

          {/* WORK */}
          <div>
            <label className="text-xs font-bold text-emerald-600 uppercase">
              Work Days
            </label>

            <input
              type="number"
              value={formData.WorkDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  WorkDays: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mt-1"
            />
          </div>

          {/* ABSENT */}
          <div>
            <label className="text-xs font-bold text-rose-600 uppercase">
              Absent
            </label>

            <input
              type="number"
              value={formData.AbsentDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  AbsentDays: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mt-1"
            />
          </div>

          {/* LEAVE */}
          <div>
            <label className="text-xs font-bold text-amber-600 uppercase">
              Leave
            </label>

            <input
              type="number"
              value={formData.LeaveDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  LeaveDays: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mt-1"
            />
          </div>

          {/* BUTTON */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-bold"
            >
              SAVE DATA
            </button>
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {loading ? (
          <div className="py-20 flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>

            <p className="mt-4 text-slate-400">
              Loading attendance...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="bg-slate-50 border-b text-xs uppercase tracking-widest text-slate-500">
                  <th className="p-4">ID</th>
                  <th className="p-4 text-left">Employee</th>
                  <th className="p-4">Month</th>
                  <th className="p-4">Work</th>
                  <th className="p-4">Absent</th>
                  <th className="p-4">Leave</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>

                {records.length > 0 ? (
                  records.map((r) => (

                    <tr
                      key={r.AttendanceID}
                      className="border-b hover:bg-slate-50 transition"
                    >

                      <td className="p-4 text-center">
                        {r.AttendanceID}
                      </td>

                      <td className="p-4">
                        <div className="font-bold">
                          {r.employee_name || "N/A"}
                        </div>

                        <div className="text-xs text-slate-400">
                          #{r.employee_id}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        {r.AttendanceMonth}
                      </td>

                      <td className="p-4 text-center">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                          {r.WorkDays}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">
                          {r.AbsentDays}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                          {r.LeaveDays}
                        </span>
                      </td>

                      <td className="p-4">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => openEditModal(r)}
                            className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteRecord(r.AttendanceID)}
                            className="bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 px-3 py-1 rounded-lg text-xs font-bold transition"
                          >
                            Delete
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-20 text-center text-slate-400"
                    >
                      No attendance records found.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-indigo-700">
                ✏️ Edit Attendance
              </h2>

              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* EMPLOYEE */}
              <div>
                <label className="font-semibold text-sm">
                  Employee
                </label>

                <select
                  value={editData.employee_id}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      employee_id: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl mt-1"
                >
                  {employees.map((emp) => (
                    <option
                      key={emp.id || emp.EmployeeID}
                      value={emp.id || emp.EmployeeID}
                    >
                      {emp.name || emp.FullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* MONTH */}
              <div>
                <label className="font-semibold text-sm">
                  Month
                </label>

                <input
                  type="month"
                  value={editData.AttendanceMonth?.substring(0, 7)}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      AttendanceMonth: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl mt-1"
                />
              </div>

              {/* WORK */}
              <div>
                <label className="font-semibold text-sm text-emerald-600">
                  Work Days
                </label>

                <input
                  type="number"
                  value={editData.WorkDays}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      WorkDays: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl mt-1"
                />
              </div>

              {/* ABSENT */}
              <div>
                <label className="font-semibold text-sm text-rose-600">
                  Absent Days
                </label>

                <input
                  type="number"
                  value={editData.AbsentDays}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      AbsentDays: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl mt-1"
                />
              </div>

              {/* LEAVE */}
              <div>
                <label className="font-semibold text-sm text-amber-600">
                  Leave Days
                </label>

                <input
                  type="number"
                  value={editData.LeaveDays}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      LeaveDays: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl mt-1"
                />
              </div>

              {/* BUTTON */}
              <div className="flex items-end">

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-bold"
                >
                  UPDATE RECORD
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;