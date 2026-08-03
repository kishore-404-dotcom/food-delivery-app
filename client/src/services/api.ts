import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
if (!configuredApiUrl) {
  throw new Error("VITE_API_URL is required");
}

export const API_BASE_URL = configuredApiUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  // Render free services may need more than 50 seconds to wake from sleep.
  timeout: 90000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
