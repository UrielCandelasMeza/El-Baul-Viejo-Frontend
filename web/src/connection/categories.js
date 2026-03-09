import axios from "./axios.js";

export const getCategories    = () => axios.get("/category/get");
export const createCategory   = (data) => axios.post("/category/create", data);
export const deleteCategory   = (id) => axios.delete(`/category/delete/${id}`);
