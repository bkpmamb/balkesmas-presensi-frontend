// src/lib/api/employees.ts

import axios from "axios";
import apiClient from "./client";
import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeesResponse,
  EmployeeResponse,
  Category,
  EmployeeDetailResponse,
} from "@/lib/types/employee";

export const employeesApi = {
  // Get all employees
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isActive?: boolean;
  }): Promise<EmployeesResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.category) queryParams.append("category", params.category);
    if (typeof params?.isActive !== "undefined") {
      queryParams.append("isActive", params.isActive.toString());
    }

    const { data } = await apiClient.get<EmployeesResponse>(
      `/admin/employees?${queryParams.toString()}`
    );
    return data;
  },

  // Get employee by ID
  getById: async (id: string): Promise<EmployeeDetailResponse["data"]> => {
    const { data } = await apiClient.get<EmployeeDetailResponse>(
      `/admin/employees/${id}`
    );
    return data.data;
  },

  // Create employee
  create: async (employee: CreateEmployeeDto): Promise<Employee> => {
    const { data } = await apiClient.post<EmployeeResponse>(
      "/admin/employees",
      employee
    );
    return data.data;
  },

  // Update employee
  update: async (
    id: string,
    employee: UpdateEmployeeDto
  ): Promise<Employee> => {
    const { data } = await apiClient.put<EmployeeResponse>(
      `/admin/employees/${id}`,
      employee
    );
    return data.data;
  },

  // Delete employee
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/employees/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        throw new Error(serverMessage || "Gagal menghapus karyawan");
      }
      throw new Error("Terjadi kesalahan sistem");
    }
  },

  // Get categories
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: Category[];
    }>("/admin/categories/list");
    return data.data;
  },

  // Reset Password
  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await apiClient.put(`/admin/employees/${id}/reset-password`, {
      newPassword,
    });
  },
};
