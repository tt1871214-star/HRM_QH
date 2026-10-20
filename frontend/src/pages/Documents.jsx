import { useEffect, useState } from "react";

/* ================= OPTIONS ================= */

const TYPES = [
  "PDF",
  "Word",
  "Excel",
  "Image",
];

const CATEGORIES = [
  "Hợp đồng",
  "Báo cáo",
  "Nhân sự",
  "Tài chính",
];

/* ================= HELPERS ================= */

const getBadgeColor = (type) => {

  if (type === "PDF")
    return "bg-red-200 text-red-800";

  if (type === "Word")
    return "bg-blue-200 text-blue-800";

  if (type === "Excel")
    return "bg-green-200 text-green-800";

  if (type === "Image")
    return "bg-purple-200 text-purple-800";

  return "bg-gray-200";
};

/* ================= MAIN ================= */

export default function Documents() {

  const [docs, setDocs] = useState([]);

  const [search, setSearch] = useState("");

  const [filterType, setFilterType] =
    useState("");

  const [isOpen, setIsOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    category: "",
    date: "",
    file: "",
    fileName: "",
  });

  /* ================= LOAD ================= */

  useEffect(() => {

    fetch("http://127.0.0.1:5000/documents")
      .then((res) => res.json())
      .then((data) => {
        setDocs(data);
      })
      .catch((err) => {
        console.error(
          "Load error:",
          err
        );
      });

  }, []);

  /* ================= ACTION ================= */

  const openAdd = () => {

    setForm({
      name: "",
      type: "",
      category: "",
      date: "",
      file: "",
      fileName: "",
    });

    setEditingId(null);

    setIsOpen(true);
  };

  const openEdit = (doc) => {

    setForm(doc);

    setEditingId(doc.id);

    setIsOpen(true);
  };

  /* ================= SAVE ================= */

  const handleSubmit = async () => {

    if (
      !form.name ||
      !form.type ||
      !form.date
    ) {

      alert("Nhập thiếu!");

      return;
    }

    const newData = {
      ...form,
      id: editingId || Date.now(),
    };

    try {

      const res = await fetch(
        "http://127.0.0.1:5000/documents",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(newData),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Save failed"
        );
      }

      if (editingId) {

        setDocs((prev) =>
          prev.map((d) =>
            d.id === editingId
              ? newData
              : d
          )
        );

      } else {

        setDocs((prev) => [
          ...prev,
          newData,
        ]);
      }

      setIsOpen(false);

    } catch (err) {

      console.error(err);

      alert("Save thất bại");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Xoá tài liệu?"
      )
    ) {
      return;
    }

    try {

      await fetch(
        `http://127.0.0.1:5000/documents/${id}`,
        {
          method: "DELETE",
        }
      );

      setDocs((prev) =>
        prev.filter(
          (d) => d.id !== id
        )
      );

    } catch (err) {

      console.error(err);
    }
  };

  /* ================= FILE UPLOAD ================= */

  const handleFileUpload =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      try {

        const res = await fetch(
          "http://127.0.0.1:5000/documents/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data =
          await res.json();

        setForm((prev) => ({
          ...prev,
          file: data.path,
          fileName:
            data.filename,
        }));

      } catch (err) {

        console.error(
          "Upload error:",
          err
        );

        alert(
          "Upload thất bại!"
        );
      }
    };

  /* ================= DOWNLOAD ================= */

  const handleDownload = (doc) => {

    window.open(
      `http://127.0.0.1:5000/uploads/${doc.fileName}`,
      "_blank"
    );
  };

  /* ================= FILTER ================= */

  const filtered = docs
    .filter((d) =>
      d.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )
    .filter((d) =>
      filterType
        ? d.type === filterType
        : true
    );

  /* ================= UI ================= */

  return (
    <div>

      <h2 className="text-2xl font-semibold text-blue-800 mb-4">
        Document Management
      </h2>

      {/* TOP */}
      <div className="flex flex-wrap gap-3 mb-4 justify-between">

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="p-2 border rounded w-1/4"
        />

        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(
              e.target.value
            )
          }
          className="p-2 border rounded"
        >

          <option value="">
            All Types
          </option>

          {TYPES.map((t, i) => (
            <option key={i}>
              {t}
            </option>
          ))}

        </select>

        <button
          onClick={openAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          + Upload
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-blue-100 p-4 rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Category</th>
              <th>Date</th>
              <th>File</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {filtered.map((d) => (

              <tr
                key={d.id}
                className="border-t"
              >

                <td className="py-2">
                  {d.name}
                </td>

                <td>

                  <span
                    className={`px-2 py-1 rounded ${getBadgeColor(
                      d.type
                    )}`}
                  >
                    {d.type}
                  </span>

                </td>

                <td>
                  {d.category}
                </td>

                <td>
                  {d.date}
                </td>

                <td className="text-sm">
                  {d.fileName}
                </td>

                <td className="space-x-2 py-2">

                  <button
                    onClick={() =>
                      handleDownload(
                        d
                      )
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Download
                  </button>

                  <button
                    onClick={() =>
                      openEdit(d)
                    }
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        d.id
                      )
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
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
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96 space-y-3">
            <h3 className="text-lg font-semibold">
              {editingId ? "Edit" : "Upload"} Document
            </h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
            >
              <option value="">Type</option>
              {TYPES.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
            >
              <option value="">Category</option>
              {CATEGORIES.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
            />

            <input
              type="file"
              onChange={handleFileUpload}
            />

            {form.fileName && (
              <p className="text-sm text-gray-600">
                {form.fileName}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
