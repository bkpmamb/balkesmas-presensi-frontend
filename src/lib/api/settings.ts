// src/lib/api/settings.ts

import axios from "axios";
import apiClient from "./client";
import type {
  Settings,
  UpdateSettingsDto,
  SettingsResponse,
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoriesResponse,
} from "@/lib/types/settings";

export const settingsApi = {
  // Get settings
  getSettings: async (): Promise<Settings> => {
    const { data } = await apiClient.get<SettingsResponse>("/admin/settings");
    return data.data;
  },

  // Update settings
  updateSettings: async (settings: UpdateSettingsDto): Promise<Settings> => {
    const { data } = await apiClient.put<SettingsResponse>(
      "/admin/settings",
      settings
    );
    return data.data;
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<CategoriesResponse>(
      "/admin/categories/list"
    );
    return data.data;
  },

  createCategory: async (category: CreateCategoryDto): Promise<Category> => {
    const { data } = await apiClient.post<{ success: boolean; data: Category }>(
      "/admin/categories",
      category
    );
    return data.data;
  },

  updateCategory: async (
    id: string,
    category: UpdateCategoryDto
  ): Promise<Category> => {
    const { data } = await apiClient.put<{ success: boolean; data: Category }>(
      `/admin/categories/${id}`,
      category
    );
    return data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/categories/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        throw new Error(serverMessage || "Gagal menghapus kategori");
      }
      throw new Error("Terjadi kesalahan sistem");
    }
  },
};
