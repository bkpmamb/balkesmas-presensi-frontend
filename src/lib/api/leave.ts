// src/lib/api/leave.ts

import apiClient from "./client";
import type {
  LeaveType,
  LeaveRequest,
  LeaveBalance,
  LeaveStats,
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
  CreateLeaveRequestDto,
  LeaveRequestFilters,
  LeaveRequestsResponse,
} from "@/lib/types/leave";

export const leaveApi = {
  // ==========================================
  // ADMIN: LEAVE TYPES
  // ==========================================

  getLeaveTypes: async (activeOnly = false): Promise<LeaveType[]> => {
    const params = activeOnly ? "?active=true" : "";
    const { data } = await apiClient.get(`/admin/leave-types${params}`);
    return data.data;
  },

  getLeaveTypeById: async (id: string): Promise<LeaveType> => {
    const { data } = await apiClient.get(`/admin/leave-types/${id}`);
    return data.data;
  },

  createLeaveType: async (dto: CreateLeaveTypeDto): Promise<LeaveType> => {
    const { data } = await apiClient.post("/admin/leave-types", dto);
    return data.data;
  },

  updateLeaveType: async (
    id: string,
    dto: UpdateLeaveTypeDto
  ): Promise<LeaveType> => {
    const { data } = await apiClient.put(`/admin/leave-types/${id}`, dto);
    return data.data;
  },

  deleteLeaveType: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/leave-types/${id}`);
  },

  // ==========================================
  // ADMIN: LEAVE REQUESTS
  // ==========================================

  getAllLeaveRequests: async (
    filters?: LeaveRequestFilters,
    page = 1,
    limit = 10
  ): Promise<{
    data: LeaveRequest[];
    stats: LeaveStats;
    pagination: LeaveRequestsResponse["pagination"];
  }> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status);
    }
    if (filters?.leaveType) {
      params.append("leaveType", filters.leaveType);
    }
    if (filters?.startDate) {
      params.append("startDate", filters.startDate);
    }
    if (filters?.endDate) {
      params.append("endDate", filters.endDate);
    }
    if (filters?.userId) {
      params.append("userId", filters.userId);
    }

    const { data } = await apiClient.get(`/admin/leave-requests?${params}`);
    return {
      data: data.data,
      stats: data.stats,
      pagination: data.pagination,
    };
  },

  getLeaveRequestById: async (id: string): Promise<LeaveRequest> => {
    const { data } = await apiClient.get(`/admin/leave-requests/${id}`);
    return data.data;
  },

  approveLeaveRequest: async (
    id: string,
    note?: string
  ): Promise<LeaveRequest> => {
    const { data } = await apiClient.put(
      `/admin/leave-requests/${id}/approve`,
      {
        note,
      }
    );
    return data.data;
  },

  rejectLeaveRequest: async (
    id: string,
    note: string
  ): Promise<LeaveRequest> => {
    const { data } = await apiClient.put(`/admin/leave-requests/${id}/reject`, {
      note,
    });
    return data.data;
  },

  // ==========================================
  // EMPLOYEE: LEAVE TYPES & BALANCE
  // ==========================================

  getAvailableLeaveTypes: async (): Promise<LeaveType[]> => {
    const { data } = await apiClient.get("/employee/leave-types");
    return data.data;
  },

  getMyLeaveBalance: async (): Promise<LeaveBalance[]> => {
    const { data } = await apiClient.get("/employee/leave-balance");
    return data.data;
  },

  // ==========================================
  // EMPLOYEE: LEAVE REQUESTS
  // ==========================================

  getMyLeaveRequests: async (
    page = 1,
    limit = 10
  ): Promise<{
    data: LeaveRequest[];
    stats: LeaveStats;
    pagination: LeaveRequestsResponse["pagination"];
  }> => {
    const { data } = await apiClient.get(
      `/employee/leave-requests?page=${page}&limit=${limit}`
    );
    return {
      data: data.data,
      stats: data.stats,
      pagination: data.pagination,
    };
  },

  getMyLeaveRequestById: async (id: string): Promise<LeaveRequest> => {
    const { data } = await apiClient.get(`/employee/leave-requests/${id}`);
    return data.data;
  },

  submitLeaveRequest: async (
    dto: CreateLeaveRequestDto,
    attachment?: File
  ): Promise<LeaveRequest> => {
    const formData = new FormData();
    formData.append("leaveTypeId", dto.leaveTypeId);
    formData.append("startDate", dto.startDate);
    formData.append("endDate", dto.endDate);
    formData.append("reason", dto.reason);

    if (attachment) {
      formData.append("attachment", attachment);
    }

    const { data } = await apiClient.post(
      "/employee/leave-requests",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data.data;
  },

  cancelLeaveRequest: async (
    id: string,
    reason?: string
  ): Promise<LeaveRequest> => {
    const { data } = await apiClient.put(
      `/employee/leave-requests/${id}/cancel`,
      {
        reason,
      }
    );
    return data.data;
  },
};
