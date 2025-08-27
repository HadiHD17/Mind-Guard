import axios from "axios";

export const API_URL = "http://192.168.0.104:5224/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

export default api;
