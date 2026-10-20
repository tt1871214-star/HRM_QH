import { useState } from "react";

/* ================= MAIN ================= */
export default function Security() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [twoFA, setTwoFA] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= HANDLER ================= */
  const handleChangePassword = () => {
    if (!password || !newPassword || !confirm) {
      setMessage("Please fill all fields");
      return;
    }

    if (newPassword !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    setMessage("Password updated successfully");
    setPassword("");
    setNewPassword("");
    setConfirm("");
  };

  const toggle2FA = () => {
    setTwoFA(!twoFA);
  };

  /* ================= UI ================= */
  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">
        Security Settings
      </h2>

      {/* Change Password */}
      <div className="bg-blue-100 p-4 rounded-2xl shadow mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          Change Password
        </h3>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          <button
            onClick={handleChangePassword}
            className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-xl"
          >
            Update Password
          </button>

          {message && (
            <p className="text-sm text-red-600 mt-2">{message}</p>
          )}
        </div>
      </div>

      {/* 2FA Section */}
      <div className="bg-blue-100 p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          Two-Factor Authentication (2FA)
        </h3>

        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-800">
            Enable extra security for your account
          </p>

          <button
            onClick={toggle2FA}
            className={`px-4 py-2 rounded-xl text-white ${
              twoFA ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {twoFA ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>
    </div>
  );
}