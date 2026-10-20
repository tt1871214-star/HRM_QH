import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // login bình thường
  const login = (username, password) => {
    if (username === "admin" && password === "123") {
      setUser({ username, role: "admin", method: "password" });
    } else if (username === "user" && password === "123") {
      setUser({ username, role: "user", method: "password" });
    } else {
      alert("Wrong account");
    }
  };

  // login OAuth
  const oauthLogin = (provider, tokenData) => {
    // tokenData là dữ liệu trả về từ Google/Facebook
    // Thường gọi API backend để xác thực token, nhưng ở đây fake luôn
    let oauthUser = null;

    if (provider === "google") {
      // tokenData chứa credential, ví dụ { credential: "abc123" }
      oauthUser = {
        username: "googleUser",
        role: "user",
        method: "google",
        token: tokenData.credential,
      };
    } else if (provider === "facebook") {
      oauthUser = {
        username: tokenData.name || "facebookUser",
        role: "user",
        method: "facebook",
        token: tokenData.accessToken,
      };
    }

    setUser(oauthUser);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, oauthLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);