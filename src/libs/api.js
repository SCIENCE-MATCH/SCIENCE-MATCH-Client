import axios from "axios";
import { getCookie } from "./cookie";

export const api = axios.create({
  baseURL: `https://www.science-match.p-e.kr`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = getCookie("aToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
