import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/employees";

/* ================= OPTIONS ================= */

const DEPARTMENTS = [
  "Phòng Nhân sự",
  "Phòng Kế toán",
  "Phòng Kỹ thuật",
  "Phòng Kinh doanh",
  "Phòng Hành chính",
  "Phòng Marketinng",
  "Phòng Sản xuất",
  "Phòng Bảo trì",
  "Phòng Nghiên cứu & Phát triển",
  "Phòng Dịch vụ khách hàng",
];

const POSITIONS = [
  "Nhân viên",
  "Trưởng nhóm",
  "Phó phòng",
  "Trưởng phòng",
  "Giám đốc",
  "Thư ký",
  "Kỹ sư",
  "Nhân viên thử việc",
  "Thực tập sinhhhh",
  "Cố vấn kỹ thuật",
];

const STATUSES = [
  "Đang làm việc",
  "Nghỉ phép",
  "Thử việc",
  "Thực tập",
];

/* ================= HELPERS ================= */

const emptyForm = {
  name: "",
  date_of_birth: "",
  gender: "",
  phone: "",
  email: "",
  hire_date: "",
  department: "",
  position: "",
  status: "Đang làm việc",
  avatar: "",
};

const getAvatar = (name) => {
  const seed = encodeURIComponent(name || "user");
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
};

const getBadgeColor = (position) => {
  if (!position) return "bg-gray-100 text-gray-700";

  if (position.includes("Giám"))
    return "bg-red-100 text-red-700";

  if (position.includes("Trưởng"))
    return "bg-yellow-100 text-yellow-700";

  if (position.includes("Kỹ"))
    return "bg-green-100 text-green-700";

  return "bg-blue-100 text-blue-700";
};

const getStatusColor = (status) => {
  if (status === "Đang làm việc")
    return "bg-green-100 text-green-700";

  if (status === "Nghỉ phép")
    return "bg-yellow-100 text-yellow-700";

  if (status === "Thử việc")
    return "bg-blue-100 text-blue-700";

  if (status === "Thực tập")
    return "bg-purple-100 text-purple-700";

  return "bg-gray-100 text-gray-700";
};

const formatEmployee = (emp) => ({
  id: emp.id,

  name: emp.name || "",

  date_of_birth: emp.date_of_birth || "",

  gender: emp.gender || "",

  phone: emp.phone || "",

  email: emp.email || "",

  hire_date: emp.hire_date || "",

  department: emp.department || "Chưa xác định",

  position: emp.position || "Nhân viên",

  status: emp.status || "Đang làm việc",

  avatar: emp.avatar || "",
});

/* ================= COMPONENT ================= */

export default function Employee() {
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [sortAsc, setSortAsc] = useState(true);

  const [filterDept, setFilterDept] = useState("");

  const [filterStatus, setFilterStatus] =
    useState("");

  const [page, setPage] = useState(1);

  const perPage = 5;

  const [isOpen, setIsOpen] = useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  /* ================= LOAD ================= */

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_URL);

      const data = await res.json();

      const arr = Array.isArray(data)
        ? data
        : data.data || [];

      setEmployees(arr.map(formatEmployee));

    } catch (err) {
      console.error("Lỗi load employee:", err);

      alert("Không tải được dữ liệu nhân viên");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ================= OPEN ================= */

  const openAdd = () => {
    setEditingId(null);

    setForm(emptyForm);

    setIsOpen(true);
  };

  const openEdit = (emp) => {
    setEditingId(emp.id);

    setForm(emp);

    setIsOpen(true);
  };

  /* ================= VALIDATE ================= */

  const validateForm = () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập họ tên");
      return false;
    }

    if (!form.email.trim()) {
      alert("Vui lòng nhập email");
      return false;
    }
    if (!form.phone.trim()) {
  alert("Vui lòng nhập số điện thoại");
  return false;
}

// chỉ cho phép số
if (!/^\d+$/.test(form.phone)) {
  alert("Số điện thoại chỉ được chứa số");
  return false;
}

// kiểm tra không quá 10 số
if (form.phone.length > 10) {
  alert("Số điện thoại không được quá 10 số");
  return false;
}

    if (!form.date_of_birth) {
      alert("Vui lòng chọn ngày sinh");
      return false;
    }

    const birthDate = new Date(
      form.date_of_birth
    );

    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDiff =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 &&
        today.getDate() <
          birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      alert("Nhân viên phải đủ 18 tuổi");
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        name: form.name,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        phone: form.phone,
        email: form.email,
        hire_date: form.hire_date,
        department: form.department,
        position: form.position,
        status: form.status,
      };

      /* ========= UPDATE ========= */

      if (editingId) {
        const res = await fetch(
          `${API_URL}/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          throw new Error(
            "Lỗi cập nhật nhân viên"
          );
        }

        const updated = await res.json();

        setEmployees((prev) =>
          prev.map((e) =>
            e.id === editingId
              ? formatEmployee(updated)
              : e
          )
        );

        alert("Cập nhật thành công");
      }

      /* ========= CREATE ========= */

      else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(
            "Lỗi thêm nhân viên"
          );
        }

        const created = await res.json();

        setEmployees((prev) => [
          ...prev,
          formatEmployee(created),
        ]);

        alert("Thêm nhân viên thành công");
      }

      setIsOpen(false);

      setForm(emptyForm);

    } catch (err) {
      console.error(err);

      alert("Lỗi xử lý dữ liệu");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn chắc chắn muốn xoá?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Xoá thất bại");
      }

      setEmployees((prev) =>
        prev.filter((e) => e.id !== id)
      );

      alert("Xoá thành công");

    } catch (err) {
      console.error(err);

      alert("Lỗi xoá nhân viên");
    }
  };

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    return employees
      .filter((e) =>
        e.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
      .filter((e) =>
        filterDept
          ? e.department === filterDept
          : true
      )
      .filter((e) =>
        filterStatus
          ? e.status === filterStatus
          : true
      )
      .sort((a, b) =>
        sortAsc
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
  }, [
    employees,
    search,
    filterDept,
    filterStatus,
    sortAsc,
  ]);

  /* ================= PAGINATION ================= */

  const totalPages =
    Math.ceil(filtered.length / perPage) || 1;

  const start = (page - 1) * perPage;

  const paginated = filtered.slice(
    start,
    start + perPage
  );

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* TITLE */}

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-blue-700">
          Quản Lý Nhân nhân vie
        </h1>

        <p className="text-gray-500 mt-2 text-lg">
          Quản lý thông tin nhân sự doanh nghiệp
        </p>
      </div>

      {/* TOOLBAR */}

      <div className="bg-white p-5 rounded-3xl shadow mb-6 flex flex-wrap gap-4 justify-between items-center">

        <input
          placeholder="Tìm Th..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border border-gray-300 p-3 rounded-2xl w-[300px] text-base outline-none focus:ring-2 focus:bg-red-500"
        />

        <div className="flex gap-3 flex-wrap">

          <select
            value={filterDept}
            onChange={(e) =>
              setFilterDept(e.target.value)
            }
            className="border bg-red-500 p-3 rounded-2xl text-base"
          >
            <option value="">
              Tất cả phòng ban
            </option>

            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value
              )
            }
            className="border bg-red-500 p-3 rounded-2xl text-base"
          >
            <option value="">
              Tất cả trạng thái
            </option>

            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={() =>
              setSortAsc(!sortAsc)
            }
            className="px-5 py-3 bg-red-500 rounded-2xl font-semibold hover:bg-gray-300"
          >
            {sortAsc ? "A-Z" : "Z-A"}
          </button>

          <button
            onClick={openAdd}
            className="bg-red-500 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg"
          >
            + Thêm nhân viên
          </button>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-red-500 text-white text-[15px]">
              <tr>
                <th className="p-4 text-left">
                  Nhân viên
                </th>

                <th className="p-4 text-left">
                  Chức vụ
                </th>

                <th className="p-4 text-left">
                  Phòng ban
                </th>

                <th className="p-4 text-left">
                  Trạng thái
                </th>

                <th className="p-4 text-center">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-10 text-lg"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-10 text-lg"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                paginated.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b hover:bg-blue-50 transition"
                  >

                    <td className="p-4">

                      <div className="flex items-center gap-4">

                        <img
                          src={
                            emp.avatar ||
                            getAvatar(emp.name)
                          }
                          alt=""
                          className="w-14 h-14 rounded-full border-2 border-blue-200"
                        />

                        <div>
                          <p className="font-bold text-[16px] text-gray-800">
                            {emp.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getBadgeColor(
                          emp.position
                        )}`}
                      >
                        {emp.position}
                      </span>
                    </td>

                    <td className="p-4 text-gray-700 font-medium">
                      {emp.department}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                          emp.status
                        )}`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() =>
                            setSelectedEmployee(
                              emp
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200"
                        >
                          Xem
                        </button>

                        <button
                          onClick={() =>
                            openEdit(emp)
                          }
                          className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              emp.id
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="p-5 flex justify-between items-center">

          <span className="text-gray-500 font-medium">
            Trang {page} / {totalPages}
          </span>

          <div className="flex gap-3">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage(page - 1)
              }
              className="px-5 py-2 rounded-xl border disabled:opacity-40"
            >
              Trước
            </button>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage(page + 1)
              }
              className="px-5 py-2 rounded-xl border disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">

          <div className="bg-white w-full max-w-4xl rounded-3xl p-8 shadow-2xl max-h-[95vh] overflow-y-auto">

            <h2 className="text-3xl font-bold text-blue-700 mb-8">
              {editingId
                ? "Cập nhật nhân viên"
                : "Thêm nhân viên"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <FormInput
                label="Họ tên"
                value={form.name}
                onChange={(v) =>
                  setForm({
                    ...form,
                    name: v,
                  })
                }
              />

              <FormInput
                type="date"
                label="Ngày sinh"
                value={form.date_of_birth}
                onChange={(v) =>
                  setForm({
                    ...form,
                    date_of_birth: v,
                  })
                }
              />

              <FormSelect
                label="Giới tính"
                value={form.gender}
                onChange={(v) =>
                  setForm({
                    ...form,
                    gender: v,
                  })
                }
                options={[
                  "Nam",
                  "Nữ",
                  "Khác",
                ]}
              />

              <FormInput
                label="Số điện thoại"
                value={form.phone}
                onChange={(v) =>
                  setForm({
                    ...form,
                    phone: v,
                  })
                }
              />

              <FormInput
                label="Email"
                value={form.email}
                onChange={(v) =>
                  setForm({
                    ...form,
                    email: v,
                  })
                }
              />

              <FormInput
                type="date"
                label="Ngày vào làm"
                value={form.hire_date}
                onChange={(v) =>
                  setForm({
                    ...form,
                    hire_date: v,
                  })
                }
              />

              <FormSelect
                label="Phòng ban"
                value={form.department}
                onChange={(v) =>
                  setForm({
                    ...form,
                    department: v,
                  })
                }
                options={DEPARTMENTS}
              />

              <FormSelect
                label="Chức vụ"
                value={form.position}
                onChange={(v) =>
                  setForm({
                    ...form,
                    position: v,
                  })
                }
                options={POSITIONS}
              />

              <FormSelect
                label="Trạng thái"
                value={form.status}
                onChange={(v) =>
                  setForm({
                    ...form,
                    status: v,
                  })
                }
                options={STATUSES}
              />

              <FormInput
                label="Avatar URL"
                value={form.avatar}
                onChange={(v) =>
                  setForm({
                    ...form,
                    avatar: v,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() =>
                  setIsOpen(false)
                }
                className="px-6 py-3 bg-gray-200 rounded-2xl font-semibold"
              >
                Hủy
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold"
              >
                {editingId
                  ? "Cập nhật"
                  : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL */}

      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">

          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">

            <div className="text-center mb-8">

              <img
                src={
                  selectedEmployee.avatar ||
                  getAvatar(
                    selectedEmployee.name
                  )
                }
                className="w-28 h-28 rounded-full mx-auto border-4 border-blue-100"
                alt=""
              />

              <h2 className="text-3xl font-bold mt-4">
                {selectedEmployee.name}
              </h2>

              <p className="text-gray-500 text-lg mt-1">
                {
                  selectedEmployee.position
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <DetailItem
                label="ID"
                value={selectedEmployee.id}
              />

              <DetailItem
                label="Ngày sinh"
                value={
                  selectedEmployee.date_of_birth
                }
              />

              <DetailItem
                label="Giới tính"
                value={
                  selectedEmployee.gender
                }
              />

              <DetailItem
                label="SĐT"
                value={
                  selectedEmployee.phone
                }
              />

              <DetailItem
                label="Email"
                value={
                  selectedEmployee.email
                }
              />

              <DetailItem
                label="Ngày vào làm"
                value={
                  selectedEmployee.hire_date
                }
              />

              <DetailItem
                label="Phòng ban"
                value={
                  selectedEmployee.department
                }
              />

              <DetailItem
                label="Trạng thái"
                value={
                  selectedEmployee.status
                }
              />
            </div>

            <button
              onClick={() =>
                setSelectedEmployee(null)
              }
              className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-semibold"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= FORM INPUT ================= */

function FormInput({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label className="block mb-2 text-[15px] font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border border-gray-300 p-3 rounded-2xl text-base focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

/* ================= FORM SELECT ================= */

function FormSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="block mb-2 text-[15px] font-semibold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border border-gray-300 p-3 rounded-2xl text-base focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">
          -- Chọn --
        </option>

        {options.map((item) => (
          <option key={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ================= DETAIL ITEM ================= */

function DetailItem({
  label,
  value,
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl border">

      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>

      <p className="font-semibold text-[15px] text-gray-800">
        {value || "Chưa có"}
      </p>
    </div>
  );
}