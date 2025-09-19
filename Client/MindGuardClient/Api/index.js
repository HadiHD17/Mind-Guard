import axios from "axios";

export const API_URL = "http://108042-HAIDAR.local:5224/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

export default api;
