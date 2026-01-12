// src/lib/api/auth.ts

import apiClient from "./client";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  _id: string; 
  name: string; 
  username: string; 
  role: "admin" | "employee"; 
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const { data } = await apiClient.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return data;
    } catch (error) {
      console.error("❌ Login API Error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
