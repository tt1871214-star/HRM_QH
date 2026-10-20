import { useEffect, useState } from "react";
import { payrollService } from "../services/payrollService";
import { employeeService } from "../services/employeeService";
import * as XLSX from "xlsx";

export default function Payroll() {

  // =====================================================
  // STATES
  // =====================================================

  const [payrolls, setPayrolls] = useState([]);

  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [form, setForm] = useState({

    employee_id: "",

    employee_name: "",

    salary_month: "",

    base_salary: "",

    bonus: "",

    deductions: "",
  });


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatCurrency = (value) =>

    Number(value || 0).toLocaleString("vi-VN");


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    loadData();

  }, []);


  const loadData = async () => {

    setLoading(true);

    setError(null);

    try {

      const [payrollRes, employeeRes] = await Promise.all([

        payrollService.getAll(),

        employeeService.getAll(),
      ]);

      setPayrolls(payrollRes || []);

      setEmployees(employeeRes || []);

    } catch (err) {

      console.error(err);

      setError("Không thể tải dữ liệu!");

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  const exportToExcel = () => {

    if (payrolls.length === 0) {

      alert("Không có dữ liệu để xuất!");

      return;
    }

    const dataForExport = filtered.map((p) => ({

      "Nhân viên": p.employee_name || "N/A",

      "Tháng lương": p.salary_month,

      "Lương cơ bản": p.base_salary,

      "Thưởng": p.bonus,

      "Khấu trừ": p.deductions,

      "Thực nhận": p.net_salary,
    }));

    const worksheet = XLSX.utils.json_to_sheet(
      dataForExport
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Payroll"
    );

    XLSX.writeFile(
      workbook,
      `Bang_Luong_${new Date().toLocaleDateString()}.xlsx`
    );
  };


  // =====================================================
  // OPEN ADD
  // =====================================================

  const openAdd = () => {

    setForm({

      employee_id: "",

      employee_name: "",

      salary_month: new Date()
        .toISOString()
        .substring(0, 7),

      base_salary: "",

      bonus: "",

      deductions: "",
    });

    setEditingId(null);

    setIsOpen(true);
  };


  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEdit = (item) => {

    setForm({

      employee_id:
        item.employee_id ||
        item.EmployeeID,

      employee_name:
        item.employee_name ||
        item.EmployeeName,

      salary_month: (
        item.salary_month ||
        item.SalaryMonth ||
        ""
      ).substring(0, 7),

      base_salary:
        item.base_salary ||
        item.BaseSalary,

      bonus:
        item.bonus ||
        item.Bonus,

      deductions:
        item.deductions ||
        item.Deductions,
    });

    setEditingId(
      item.id ||
      item.PayrollID
    );

    setIsOpen(true);
  };


  // =====================================================
  // CALCULATE NET
  // =====================================================

  const calculateSalary = () => {

    return (

      Number(form.base_salary || 0)

      + Number(form.bonus || 0)

      - Number(form.deductions || 0)
    );
  };


  // =====================================================
  // SAVE DATA
  // =====================================================

  const handleSubmit = async () => {

    if (
      !form.employee_id ||
      !form.base_salary
    ) {

      alert("Vui lòng nhập đầy đủ!");

      return;
    }

    const payload = {

      employee_id: Number(
        form.employee_id
      ),

      salary_month:
        form.salary_month,

      base_salary: Number(
        form.base_salary || 0
      ),

      bonus: Number(
        form.bonus || 0
      ),

      deductions: Number(
        form.deductions || 0
      ),

      net_salary:
        calculateSalary(),
    };

    console.log(
      "PAYLOAD =",
      payload
    );

    try {

      if (editingId) {

        await payrollService.update(
          editingId,
          payload
        );

        alert(
          "Updated successfully!"
        );

      } else {

        await payrollService.create(
          payload
        );

        alert(
          "Created successfully!"
        );
      }

      await loadData();

      setIsOpen(false);

    } catch (err) {

      console.error(err);

      console.log(
        err?.response?.data
      );

      alert(

        err?.response?.data?.error ||

        "Lưu thất bại!"
      );
    }
  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(

        "Are you sure you want to delete this payroll?"
      );

    if (!confirmDelete) return;

    try {

      await payrollService.delete(id);

      await loadData();

      alert(
        "Deleted successfully!"
      );

    } catch (err) {

      console.error(err);

      alert("Delete failed!");
    }
  };


  // =====================================================
  // FILTER
  // =====================================================

  const filtered = payrolls.filter((p) =>

    (p.employee_name || "")

      .toLowerCase()

      .includes(
        search.toLowerCase()
      )
  );


  // =====================================================
  // TOTAL
  // =====================================================

  const totalSalary = payrolls.reduce(

    (sum, p) =>

      sum + Number(
        p.net_salary || 0
      ),

    0
  );


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="p-4 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold text-blue-700">

          Payroll Management

        </h2>

        <div className="flex gap-2">

          <button

            onClick={exportToExcel}

            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Export Excel
          </button>

          <button

            onClick={openAdd}

            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            + Add Payroll
          </button>

        </div>
      </div>


      {/* ERROR */}

      {error && (

        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">

          {error}

        </div>
      )}


      {/* LOADING */}

      {loading ? (

        <div className="text-center py-10 font-bold">

          Loading...

        </div>

      ) : (

        <>

          {/* SUMMARY */}

          <div className="grid grid-cols-3 gap-4 mb-6">

            <div className="bg-white p-4 rounded-xl shadow text-center border-b-4 border-blue-500">

              <p className="text-gray-500">

                Records

              </p>

              <h3 className="text-xl font-bold">

                {payrolls.length}

              </h3>

            </div>

            <div className="bg-white p-4 rounded-xl shadow text-center border-b-4 border-green-500">

              <p className="text-gray-500">

                Total Net Salary

              </p>

              <h3 className="text-xl font-bold text-green-600">

                {formatCurrency(totalSalary)} VNĐ

              </h3>

            </div>

            <div className="bg-white p-4 rounded-xl shadow text-center border-b-4 border-purple-500">

              <p className="text-gray-500">

                Employees

              </p>

              <h3 className="text-xl font-bold text-purple-600">

                {employees.length}

              </h3>

            </div>

          </div>


          {/* SEARCH */}

          <input

            className="border p-2 rounded w-full md:w-1/3 mb-4 shadow-sm"

            placeholder="Search employee..."

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          {/* TABLE */}

          <div className="bg-white rounded shadow overflow-hidden">

            <table className="w-full text-left">

              <thead className="bg-blue-600 text-white">

                <tr>

                  <th className="p-3">Employee</th>

                  <th className="p-3">Month</th>

                  <th className="p-3">Base</th>

                  <th className="p-3">Bonus</th>

                  <th className="p-3">Net</th>

                  <th className="p-3">Action</th>

                </tr>

              </thead>

              <tbody>

                {filtered.map((p) => (

                  <tr
                    key={p.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-3 font-medium">

                      {p.employee_name}

                    </td>

                    <td className="p-3">

                      {p.salary_month}

                    </td>

                    <td className="p-3">

                      {formatCurrency(
                        p.base_salary
                      )}

                    </td>

                    <td className="p-3 text-green-600">

                      +{formatCurrency(
                        p.bonus
                      )}

                    </td>

                    <td className="p-3 font-bold text-blue-600">

                      {formatCurrency(
                        p.net_salary
                      )}

                    </td>

                    <td className="p-3">

                      <button

                        onClick={() =>
                          openEdit(p)
                        }

                        className="text-blue-600 mr-3 underline"
                      >
                        Edit
                      </button>

                      <button

                        onClick={() =>
                          handleDelete(p.id)
                        }

                        className="text-red-500 underline"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>


          {/* MODAL */}

          {isOpen && (

            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

              <div className="bg-white p-6 rounded-lg w-[400px] shadow-2xl space-y-4">

                <h2 className="text-xl font-bold border-b pb-2">

                  {editingId
                    ? "Edit Payroll"
                    : "Add Payroll"}

                </h2>


                <div className="space-y-3">

                  <label className="block text-sm font-medium">

                    Nhân viên

                  </label>

                  <select

                    value={form.employee_id}

                    onChange={(e) => {

                      const emp =
                        employees.find(

                          (x) =>

                            (x.id || x.EmployeeID)
                            == e.target.value
                        );

                      if (emp) {

                        setForm({

                          ...form,

                          employee_id:
                            emp.id ||
                            emp.EmployeeID,

                          employee_name:
                            emp.name ||
                            emp.FullName,
                        });
                      }
                    }}

                    className="border w-full p-2 rounded bg-gray-50"
                  >

                    <option value="">

                      Select employee

                    </option>

                    {employees.map((e) => (

                      <option

                        key={e.id || e.EmployeeID}

                        value={e.id || e.EmployeeID}
                      >

                        {e.name || e.FullName}

                      </option>
                    ))}

                  </select>


                  <input

                    type="month"

                    value={form.salary_month}

                    onChange={(e) =>
                      setForm({
                        ...form,
                        salary_month:
                          e.target.value,
                      })
                    }

                    className="border w-full p-2 rounded"
                  />


                  <input

                    type="number"

                    placeholder="Base Salary"

                    value={form.base_salary}

                    onChange={(e) =>
                      setForm({
                        ...form,
                        base_salary:
                          e.target.value,
                      })
                    }

                    className="border w-full p-2 rounded"
                  />


                  <input

                    type="number"

                    placeholder="Bonus"

                    value={form.bonus}

                    onChange={(e) =>
                      setForm({
                        ...form,
                        bonus:
                          e.target.value,
                      })
                    }

                    className="border w-full p-2 rounded"
                  />


                  <input

                    type="number"

                    placeholder="Deductions"

                    value={form.deductions}

                    onChange={(e) =>
                      setForm({
                        ...form,
                        deductions:
                          e.target.value,
                      })
                    }

                    className="border w-full p-2 rounded"
                  />


                  <div className="p-3 bg-blue-50 font-bold text-green-700 rounded">

                    Net Income:
                    {" "}
                    {formatCurrency(
                      calculateSalary()
                    )}

                  </div>

                </div>


                <div className="flex justify-end gap-2 pt-4">

                  <button

                    onClick={() =>
                      setIsOpen(false)
                    }

                    className="bg-gray-200 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button

                    onClick={handleSubmit}

                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save Data
                  </button>

                </div>

              </div>

            </div>
          )}

        </>
      )}

    </div>
  );
}