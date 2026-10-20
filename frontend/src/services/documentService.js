import api from "./api";

export const documentService = {
  getAll: () => api.get("/documents"),

  upload: (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    return api.post("/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: (id) => api.delete(`/documents/${id}`),
};