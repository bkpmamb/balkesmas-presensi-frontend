// src/lib/api/client.ts

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// console.log("🌐 API URL:", API_URL);

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  // headers: {
  //   "Content-Type": "application/json",
  // },
  timeout: 10000,
});

const clearAuthAndRedirect = (reason?: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = reason ? `/login?reason=${reason}` : "/login";
  }
};

let logoutTimer: NodeJS.Timeout | null = null;
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

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
      // Cek SessionStorage dulu (Admin), jika tidak ada cek LocalStorage (Employee)
      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config.url.includes("/auth/login");

    // Hanya redirect jika error 401 terjadi BUKAN di halaman login
    if (error.response?.status === 401 && !isLoginRequest) {
      console.log("🔐 Unauthorized - Clearing all storages");
      clearAuthAndRedirect();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
