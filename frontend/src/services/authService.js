export const authService = {
  isAuthenticated: () => !!localStorage.getItem("user"),
  
  getRole: () => localStorage.getItem("role") || "guest",

  logout: () => {
    localStorage.clear();
    window.location.href = "/login";
  }
};