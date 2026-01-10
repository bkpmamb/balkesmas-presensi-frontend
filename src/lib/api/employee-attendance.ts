// src/lib/api/employee-attendance.ts

import { getErrorMessage } from "../utils/getErrorMessage";
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
  AttendanceHistoryResponse,
  WorkSchedule,
  EmployeeInitResponse,
} from "@/lib/types/employee-attendance";

export const employeeAttendanceApi = {

  // Get init data (profile + schedule + attendance)
  getInit: async (): Promise<EmployeeInitResponse> => {
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: EmployeeInitResponse;
      }>("/employee/init");
      return data.data;
    } catch (error) {
      throw getErrorMessage(error, "Gagal memuat data. Silakan coba lagi.");
    }
  },

  getProfile: async (): Promise<EmployeeProfile> => {
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: EmployeeProfile;
      }>("/employee/profile");
      return data.data;
    } catch (error) {
      throw getErrorMessage(error, "Gagal memuat profil.");
    }
  },

  getTodaySchedule: async (): Promise<TodaySchedule | null> => {
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: TodaySchedule | null;
      }>("/employee/schedule/today");
      return data.data;
    } catch (error) {
      throw getErrorMessage(error, "Gagal memuat jadwal hari ini.");
    }
  },

  getAllSchedules: async (): Promise<WorkSchedule[]> => {
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: WorkSchedule[];
      }>("/employee/schedules");
      return data.data;
    } catch (error) {
      throw getErrorMessage(error, "Gagal memuat semua jadwal.");
    }
  },

  getTodayAttendance: async (): Promise<TodayAttendance | null> => {
    try {
      const timestamp = new Date().getTime();
      const { data } = await apiClient.get<{
        success: boolean;
        data: TodayAttendance | null;
      }>(`/employee/attendance/today?t=${timestamp}`); // ada t

      return data.data;
    } catch (error) {
      throw getErrorMessage(error, "Gagal memuat data presensi hari ini.");
    }
  },

  clockIn: async (formData: FormData): Promise<ClockInResponse> => {
    try {
      const { data } = await apiClient.post<ClockInResponse>(
        "/attendance/clock-in",
        formData,
        {
          headers: {},
        }
      );
      return data;
    } catch (error) {
      throw getErrorMessage(
        error,
        "Gagal melakukan clock in. Silakan coba lagi."
      );
    }
  },

  clockOut: async (formData: FormData): Promise<ClockOutResponse> => {
    try {
      const { data } = await apiClient.post<ClockOutResponse>(
        "/attendance/clock-out",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error) {
      throw getErrorMessage(
        error,
        "Gagal melakukan clock out. Silakan coba lagi."
      );
    }
  },

  getStatistics: async (): Promise<EmployeeStatistics> => {
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: EmployeeStatistics;
      }>("/employee/statistics");
      return data.data;
    } catch (error) {
      throw getErrorMessage(error, "Gagal memuat statistik.");
    }
  },

  getAttendanceHistory: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<AttendanceHistoryResponse> => {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());

      const { data } = await apiClient.get<AttendanceHistoryResponse>(
        `/employee/attendance/history?${query.toString()}`
      );

      return data;
    } catch (error) {
      throw getErrorMessage(error, "Gagal memuat riwayat presensi.");
    }
  },

  changePassword: async (
    passwords: ChangePasswordDto
  ): Promise<GenericResponse> => {
    try {
      const { data } = await apiClient.put<{
        success: boolean;
        message: string;
      }>("/employee/profile/change-password", passwords);
      return data;
    } catch (error) {
      throw getErrorMessage(error, "Gagal mengubah password.");
    }
  },
};
