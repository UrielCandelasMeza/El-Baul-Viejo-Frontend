import axios from "axios";

const url = import.meta.env.VITE_API_URL;

const instance = axios.create({
  withCredentials: true,
  baseURL: url ? `${url}/api` : "/api",
});

export default instance;
