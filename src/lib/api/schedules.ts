// src/lib/api/schedules.ts

import apiClient from "./client";
import type {
  Schedule,
  CreateScheduleDto,
  BulkCreateScheduleDto,
  SchedulesResponse,
  ScheduleResponse,
} from "@/lib/types/schedule";

export const schedulesApi = {
  // Get all schedules (now works!)
  getAll: async (params?: {
    userId?: string;
    shiftId?: string;
    dayOfWeek?: number;
  }): Promise<Schedule[]> => {
    const queryParams = new URLSearchParams();

    // ✅ Only add params if they exist and are not "all"
    if (params?.userId && params.userId !== "all") {
      queryParams.append("userId", params.userId);
    }
    if (params?.shiftId && params.shiftId !== "all") {
      queryParams.append("shiftId", params.shiftId);
    }
    if (typeof params?.dayOfWeek !== "undefined") {
      queryParams.append("dayOfWeek", params.dayOfWeek.toString());
    }

    // ✅ Build URL - only add ? if there are params
    const queryString = queryParams.toString();
    const url = queryString
      ? `/admin/shift-schedules?${queryString}`
      : `/admin/shift-schedules`;

    const { data } = await apiClient.get<SchedulesResponse>(url);
    return data.data;
  },

  // Get schedules by employee
  getByEmployee: async (userId: string): Promise<Schedule[]> => {
    const { data } = await apiClient.get<SchedulesResponse>(
      `/admin/shift-schedules/user/${userId}`
    );
    return data.data;
  },

  // Get schedules by shift
  getByShift: async (shiftId: string): Promise<Schedule[]> => {
    const { data } = await apiClient.get<SchedulesResponse>(
      `/admin/shift-schedules/shift/${shiftId}`
    );
    return data.data;
  },

  // Create single schedule
  create: async (schedule: CreateScheduleDto): Promise<Schedule> => {
    const { data } = await apiClient.post<ScheduleResponse>(
      "/admin/shift-schedules",
      schedule
    );
    return data.data;
  },

  // ✅ FIX: Bulk create schedules
  bulkCreate: async (bulk: BulkCreateScheduleDto): Promise<Schedule[]> => {
    // Transform frontend format to backend format
    const backendFormat = {
      userId: bulk.userId,
      schedules: bulk.days.map((dayOfWeek) => ({
        dayOfWeek,
        shiftId: bulk.shiftId,
      })),
    };

    console.log("📤 Bulk create request (transformed):", backendFormat);

    const { data } = await apiClient.post<{
      success: boolean;
      message: string;
      data: {
        successful: Array<{ dayOfWeek: number; scheduleId: string }>;
        failed: Array<{ dayOfWeek: number; error: string }>;
      };
    }>("/admin/shift-schedules/bulk", backendFormat);

    // Backend returns { successful: [...], failed: [...] }
    if (data.data.successful.length > 0) {
      // ✅ FIX: Backend returns nested structure
      const userSchedulesResponse = await apiClient.get<{
        success: boolean;
        data: {
          user: object;
          schedules: Array<{
            dayOfWeek: number;
            dayName: string;
            schedule: Schedule | null;
          }>;
        };
      }>(`/admin/shift-schedules/user/${bulk.userId}`);

      // Extract schedules from the response
      const allSchedules = userSchedulesResponse.data.data.schedules
        .map((item) => item.schedule)
        .filter((schedule): schedule is Schedule => schedule !== null);

      // Filter only the newly created ones
      const newScheduleIds = data.data.successful.map((s) => s.scheduleId);
      return allSchedules.filter((schedule) =>
        newScheduleIds.includes(schedule._id)
      );
    }

    return [];
  },

  // Delete schedule
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/shift-schedules/${id}`);
  },

  // Delete all schedules for employee
  deleteByEmployee: async (userId: string): Promise<void> => {
    await apiClient.delete(`/admin/shift-schedules/user/${userId}`);
  },
};
