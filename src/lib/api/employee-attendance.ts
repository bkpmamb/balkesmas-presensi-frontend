// src/lib/api/employee-attendance.ts

import apiClient from "./client";
import type {
  EmployeeProfile,
  TodaySchedule,
  TodayAttendance,
  ClockInResponse,
  ClockOutResponse,
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

  // Get today's attendance
  getTodayAttendance: async (): Promise<TodayAttendance | null> => {
    // Tambahkan timestamp agar Vercel tidak memberikan data cache
    const timestamp = new Date().getTime();
    const { data } = await apiClient.get<{
      success: boolean;
      data: TodayAttendance | null;
    }>(`/employee/attendance/today?t=${timestamp}`); // <-- Tambahkan ?t=...

    return data.data;
  },

  // Clock in
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

  // Clock out
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
};
