// src/lib/api/client.ts

import axios, { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/lib/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log("🌐 API URL:", API_URL);

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

let logoutTimer: NodeJS.Timeout | null = null;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

function resetLogoutTimer() {
  if (logoutTimer) clearTimeout(logoutTimer);

  logoutTimer = setTimeout(() => {
    console.log("⏰ Session timeout - Auto logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login?reason=timeout";
  }, INACTIVITY_TIMEOUT);
}

// Reset timer on user activity
if (typeof window !== "undefined") {
  ["mousedown", "keydown", "scroll", "touchstart"].forEach((event) => {
    document.addEventListener(event, resetLogoutTimer, true);
  });

  // Start timer
  resetLogoutTimer();
}

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log("🔑 Token:", token ? "Present" : "Missing");
    }

    console.log(
      "📤 API Request:",
      config.method?.toUpperCase(),
      config.url,
      "Auth:",
      config.headers.Authorization ? "YES" : "NO"
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log("📥 API Response:", response.config.url, response.status);
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    console.error("📥 Response Error:", error.response?.status, error.message);

    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      console.log("🔐 Unauthorized - Clearing auth");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // ✅ Type-safe error extraction
    const message =
      error.response?.data?.message || error.message || "An error occurred";

    console.error("❌ Error message:", message);

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default apiClient;
