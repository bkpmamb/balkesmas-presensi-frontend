// src/lib/store/authStore.ts

import { create } from "zustand";
import { authApi } from "../api/auth";
import type { AuthState, User } from "@/lib/types/auth";
import type { ApiError } from "@/lib/types/api";
import { toast } from "sonner";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  initialize: () => {
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
        console.log(`🔄 Initializing ${user.role} auth`);
        set({ token, user, isAuthenticated: true });
      }
    }
  },

  login: async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password });

      console.log("🔍 Processing login response:", response);

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
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token"); // Bersihkan jika ada bekas employee
        console.log("🛡️ Admin detected: Saving token to sessionStorage");
      } else {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token"); // Bersihkan jika ada bekas admin
        console.log("🏠 Employee detected: Saving token to localStorage");
      }

      // Simpan data profil tetap di localStorage agar UI tidak kosong saat refresh
      localStorage.setItem("user", JSON.stringify(user));

      set({ token, user, isAuthenticated: true });
      toast.success("Login berhasil!");
    } catch (error) {
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
