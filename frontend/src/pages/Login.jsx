import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleLogin = () => {
    if (form.password === "123") {
      let role = "";
      if (form.username === "ql") role = "admin";
      else if (form.username === "hr") role = "user";
      else return alert("Tài khoản không tồn tại!");

      localStorage.setItem("user", JSON.stringify({ name: form.username }));
      localStorage.setItem("role", role);
      navigate("/");
    } else {
      alert("Sai mật khẩu!");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="w-80 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-bold">HRM LOGIN</h2>
        <input className="mb-3 w-full rounded border p-2" placeholder="Username (ql/hr)" onChange={e => setForm({...form, username: e.target.value})} />
        <input className="mb-4 w-full rounded border p-2" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        <button className="w-full rounded bg-blue-600 p-2 text-white font-bold" onClick={handleLogin}>Đăng nhập</button>
      </div>
    </div>
  );
}