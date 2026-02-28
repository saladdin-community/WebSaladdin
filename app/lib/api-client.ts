import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      Cookies.remove("access_token");
      Cookies.remove("user_role");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      // Prevent redirect loop/refresh if already on login or signup page
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/signup";
      if (!isAuthPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;

export const fetch = apiClient;

export type RequestConfig = AxiosRequestConfig;
export type ResponseErrorConfig<T> = AxiosError<T>;
