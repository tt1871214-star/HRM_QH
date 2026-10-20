import api from "./api";

export const attendanceService = {
  // GET ALL
  getAll: async () => {
    const response = await api.get("/attendance/");
    return response.data;
  },

  // CREATE
  create: async (data) => {
    const response = await api.post("/attendance/", data);
    return response.data;
  },

  // UPDATE
  update: async (id, data) => {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
  },

  // DELETE
  delete: async (id) => {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
  },
};