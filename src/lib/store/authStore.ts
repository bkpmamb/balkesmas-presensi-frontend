// src/lib/store/authStore.ts

import { create } from "zustand";
import { authApi } from "../api/auth";
import type { AuthState, User } from "@/lib/types/auth";
import type { ApiError } from "@/lib/types/api";
import { toast } from "sonner";
import { createTimer } from "@/src/lib/utils/logger";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true, // ✅ Tambahkan loading state

  initialize: async () => {
    const timer = createTimer("AUTH_INITIALIZE");

    if (typeof window !== "undefined") {
      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      let user = null;
      if (userStr && userStr !== "undefined") {
        try {
          user = JSON.parse(userStr);
        } catch (error) {
          console.error("Failed to parse user from localStorage:", error);
          localStorage.removeItem("user");
        }
      }

      if (token && user) {
        timer.lap("Token found, warming up backend");

        // ✅ Warm up backend SEBELUM set authenticated
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        try {
          await fetch(`${apiUrl}/health`);
          timer.lap("Backend warmed up");
        } catch {
          timer.lap("Backend warming up in background...");
        }

        console.log(`🔄 Initializing ${user.role} auth`);
        set({ token, user, isAuthenticated: true, isInitializing: false });
        timer.stop("Auth initialized with existing token");
      } else {
        timer.stop("No existing auth found");
        set({ isInitializing: false });
      }
    } else {
      set({ isInitializing: false });
    }
  },

  login: async (username: string, password: string) => {
    const timer = createTimer("AUTH_STORE_LOGIN");

    try {
      timer.lap("Calling API /auth/login");
      const response = await authApi.login({ username, password });
      timer.lap("API response received");

      // ✅ Create user object
      const user: User = {
        _id: response._id,
        name: response.name,
        username: response.username,
        role: response.role,
      };

      const token = response.token;

      // ✅ Update store
      set({
        token: token,
        user: user,
        isAuthenticated: true,
      });
      // ✅ STRATEGI PENYIMPANAN BERDASARKAN ROLE
      if (user.role === "admin") {
        timer.lap("Storing admin token in sessionStorage");
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token"); // Bersihkan jika ada bekas employee
      } else {
        timer.lap("Storing employee token in localStorage");
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token"); // Bersihkan jika ada bekas admin
      }

      timer.lap("Storing user data");
      localStorage.setItem("user", JSON.stringify(user));

      timer.lap("Updating store state");
      set({ token, user, isAuthenticated: true });

      timer.stop("Auth store login complete");
      toast.success("Login berhasil!");
    } catch (error) {
      timer.stop("Auth store login failed");
      const apiError = error as ApiError;
      toast.error(apiError.message || "Login gagal");
      throw error;
    }
  },

  logout: () => {
    console.log("🚪 Logging out from all storages...");
    authApi.logout();

    // Bersihkan semua kemungkinan tempat penyimpanan
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({ token: null, user: null, isAuthenticated: false });
    toast.success("Logout berhasil");
  },
}));
