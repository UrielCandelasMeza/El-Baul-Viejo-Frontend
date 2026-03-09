import axios from "./axios.js";

export const loginUser = (data) => axios.post("/auth/login", data);
export const verifyToken = () => axios.get("/auth/verify");
