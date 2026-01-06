// src/lib/api/employee-attendance.ts

import apiClient from "./client";
import type {
  EmployeeProfile,
  TodaySchedule,
  TodayAttendance,
  ClockInResponse,
  ClockOutResponse,
  EmployeeStatistics,
  ChangePasswordDto,
  GenericResponse,
  AttendanceSummary,
  PaginationData,
  AttendanceHistoryResponse,
  WorkSchedule,
} from "@/lib/types/employee-attendance";

export const employeeAttendanceApi = {
  // Get profile
  getProfile: async (): Promise<EmployeeProfile> => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: EmployeeProfile;
    }>("/employee/profile");
    return data.data;
  },

  // Get today's schedule
  getTodaySchedule: async (): Promise<TodaySchedule | null> => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: TodaySchedule | null;
    }>("/employee/schedule/today");
    return data.data;
  },

  getAllSchedules: async (): Promise<WorkSchedule[]> => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: WorkSchedule[];
    }>("/employee/schedules");
    return data.data;
  },

  // Get today's attendance
  getTodayAttendance: async (): Promise<TodayAttendance | null> => {
    // Tambahkan timestamp agar Vercel tidak memberikan data cache
    const timestamp = new Date().getTime();
    const { data } = await apiClient.get<{
      success: boolean;
      data: TodayAttendance | null;
    }>(`/employee/attendance/today?t=${timestamp}`); // ada t

    return data.data;
  },

  clockIn: async (formData: FormData): Promise<ClockInResponse> => {
    const { data } = await apiClient.post<ClockInResponse>(
      "/employee/attendance/clock-in",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  clockOut: async (formData: FormData): Promise<ClockOutResponse> => {
    const { data } = await apiClient.post<ClockOutResponse>(
      "/employee/attendance/clock-out",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  getStatistics: async (): Promise<EmployeeStatistics> => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: EmployeeStatistics;
    }>("/employee/statistics");
    return data.data;
  },

  getAttendanceHistory: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<AttendanceHistoryResponse> => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    const { data } = await apiClient.get<AttendanceHistoryResponse>(
      `/employee/attendance/history?${query.toString()}`
    );

    return data;
  },

  changePassword: async (
    passwords: ChangePasswordDto
  ): Promise<GenericResponse> => {
    const { data } = await apiClient.put<{ success: boolean; message: string }>(
      "/employee/profile/change-password",
      passwords
    );
    return data;
  },
};
