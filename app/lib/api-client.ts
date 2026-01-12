// app/lib/api-client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Fix: get token dari localStorage hanya di client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - PERBAIKAN
apiClient.interceptors.response.use(
  (response) => {
    // Kubb expects the full response, not response.data
    // Jadi kita return response, bukan response.data

    return response;
  },
  (error) => {
    // Fix error handling

    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Export default dengan nama yang diharapkan Kubb
export default apiClient;

// Export juga sebagai 'fetch' untuk compat dengan Kubb
export const fetch = apiClient;
