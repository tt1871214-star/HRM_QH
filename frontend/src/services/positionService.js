import api from "./api";

export const positionService = {
  getAll: () => api.get("/positions"),
};
