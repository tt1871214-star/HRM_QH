import api from "./api";

export const notificationService = {
  getAll: () => api.get("/notifications"),

  create: (data) => api.post("/notify", data),

  markRead: (id) => api.put(`/notifications/${id}/read`),

  delete: (id) => api.delete(`/notifications/${id}`),
};