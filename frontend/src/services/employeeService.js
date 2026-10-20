import api from "./api";

export const employeeService = {
  getAll: () => api.get("/employees"),

  create: (data) => api.post("/employees", data),

  update: (id, data) => api.put(`/employees/${id}`, data),

  delete: (id) => api.delete(`/employees/${id}`),
};
