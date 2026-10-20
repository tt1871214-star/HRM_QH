import api from "./api";

export const payrollService = {
  getAll: () => api.get("/payroll"),

  create: async (data) => {

    const response = await api.post(
      "/payroll/",
      data
    );

    return response.data;
  },

  update: (id, data) => api.put(`/payroll/${id}`, data),

  delete: (id) => api.delete(`/payroll/${id}`),

  calculate: (data) => api.post("/payroll/calculate", data),
};