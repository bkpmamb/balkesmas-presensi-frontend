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
      const token = localStorage.getItem("token");
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
        console.log("🔄 Initializing auth from localStorage");
        console.log("🔑 Token present:", !!token);
        console.log("👤 User:", user.name);
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

      console.log("👤 User object created:", user);
      console.log("🔑 Token received:", token.substring(0, 20) + "...");

      // ✅ Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("💾 Saved to localStorage");
      console.log(
        "💾 Token in localStorage:",
        localStorage.getItem("token")?.substring(0, 20) + "..."
      );

      // ✅ Update store
      set({
        token: token,
        user: user,
        isAuthenticated: true,
      });

      console.log("✅ Store updated successfully");

      toast.success("Login berhasil!");
    } catch (error) {
      const apiError = error as ApiError;
      console.error("❌ Login error in store:", apiError);
      toast.error(apiError.message || "Login gagal");
      throw error;
    }
  },

  logout: () => {
    console.log("🚪 Logging out...");
    authApi.logout();
    set({ token: null, user: null, isAuthenticated: false });
    toast.success("Logout berhasil");
  },
}));
