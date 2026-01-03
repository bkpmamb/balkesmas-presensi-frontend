// src/lib/api/attendances.ts

import apiClient from "./client";
import type {
  Attendance,
  AttendancesResponse,
  ManualEntryDto,
} from "@/lib/types/attendance";

export const attendancesApi = {
  // Get all attendances
  getAll: async (params?: {
    page?: number;
    limit?: number;
    userId?: string;
    shiftId?: string;
    startDate?: string;
    endDate?: string;
    clockInStatus?: string;
    clockOutStatus?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<AttendancesResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.userId) queryParams.append("userId", params.userId);
    if (params?.shiftId) queryParams.append("shiftId", params.shiftId);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.clockInStatus)
      queryParams.append("clockInStatus", params.clockInStatus);
    if (params?.clockOutStatus)
      queryParams.append("clockOutStatus", params.clockOutStatus);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const { data } = await apiClient.get<AttendancesResponse>(
      `/admin/all-attendance?${queryParams.toString()}`
    );

    return data;
  },

  // Get attendance by ID
  getById: async (id: string): Promise<Attendance> => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: Attendance;
    }>(`/admin/attendances/${id}`);
    return data.data;
  },

  // Create manual entry
  createManualEntry: async (entry: ManualEntryDto): Promise<Attendance> => {
    const { data } = await apiClient.post<{
      success: boolean;
      data: Attendance;
    }>("/admin/attendance/manual-entry", entry);
    return data.data;
  },

  // Delete attendance
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/attendance/${id}`);
  },

  // Export to Excel
  exportExcel: async (params?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    shiftId?: string;
    clockInStatus?: string;
  }): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.userId) queryParams.append("userId", params.userId);
    if (params?.shiftId) queryParams.append("shiftId", params.shiftId);
    if (params?.clockInStatus)
      queryParams.append("clockInStatus", params.clockInStatus);

    const { data } = await apiClient.get(
      `/admin/export/excel?${queryParams.toString()}`,
      {
        responseType: "blob",
      }
    );
    return data;
  },

  // Export to PDF
  exportPDF: async (params?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    shiftId?: string;
    clockInStatus?: string;
  }): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.userId) queryParams.append("userId", params.userId);
    if (params?.shiftId) queryParams.append("shiftId", params.shiftId);
    if (params?.clockInStatus)
      queryParams.append("clockInStatus", params.clockInStatus);

    const { data } = await apiClient.get(
      `/admin/export/pdf?${queryParams.toString()}`,
      {
        responseType: "blob",
      }
    );
    return data;
  },
};
