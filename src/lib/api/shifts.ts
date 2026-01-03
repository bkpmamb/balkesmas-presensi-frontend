// src/lib/api/shifts.ts

import apiClient from "./client";
import type {
  Shift,
  CreateShiftDto,
  UpdateShiftDto,
  ShiftsResponse,
  ShiftResponse,
  ShiftSchedule,
  CreateScheduleDto,
} from "@/lib/types/shift";

export const shiftsApi = {
  // Get all shifts with pagination
  getAll: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ShiftsResponse> => {
    const { data } = await apiClient.get<ShiftsResponse>(
      `/admin/shifts?page=${page}&limit=${limit}`
    );
    return data;
  },

  // Get all shifts without pagination (for dropdowns/selects)
  getAllForSelect: async (): Promise<Shift[]> => {
    const { data } = await apiClient.get<ShiftsResponse>(
      `/admin/shifts?limit=999`
    );
    return data.data;
  },

  // Get shift by ID
  getById: async (id: string): Promise<Shift> => {
    const { data } = await apiClient.get<ShiftResponse>(`/admin/shifts/${id}`);
    return data.data;
  },

  // Create shift
  create: async (shift: CreateShiftDto): Promise<Shift> => {
    const { data } = await apiClient.post<ShiftResponse>(
      "/admin/shifts",
      shift
    );
    return data.data;
  },

  // Update shift
  update: async (id: string, shift: UpdateShiftDto): Promise<Shift> => {
    const { data } = await apiClient.put<ShiftResponse>(
      `/admin/shifts/${id}`,
      shift
    );
    return data.data;
  },

  // Delete shift
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/shifts/${id}`);
  },

  // Get schedules by shift
  getSchedulesByShift: async (shiftId: string): Promise<ShiftSchedule[]> => {
    const { data } = await apiClient.get<{
      success: boolean;
      data: ShiftSchedule[];
    }>(`/admin/shift-schedules/shift/${shiftId}`);
    return data.data;
  },

  // Create schedule
  createSchedule: async (
    schedule: CreateScheduleDto
  ): Promise<ShiftSchedule> => {
    const { data } = await apiClient.post<{
      success: boolean;
      data: ShiftSchedule;
    }>("/admin/shift-schedules", schedule);
    return data.data;
  },

  // Delete schedule
  deleteSchedule: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/shift-schedules/${id}`);
  },
};
