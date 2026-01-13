// src/lib/types/leave.ts

export interface LeaveType {
  _id: string;
  name: string;
  code: string;
  category: "cuti" | "izin";
  maxDaysPerYear: number | null;
  requiresAttachment: boolean;
  minDaysInAdvance: number;
  isPaid: boolean;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    employeeId: string;
    category?: {
      _id: string;
      name: string;
    };
  };
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  attachmentUrl?: string;
  status: LeaveRequestStatus;
  approvedBy?: {
    _id: string;
    name: string;
  };
  approvedAt?: string;
  approvalNote?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  requestNumber: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaveRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export interface LeaveBalance {
  leaveType: {
    _id: string;
    name: string;
    code: string;
    category: "cuti" | "izin";
  };
  year: number;
  totalAllowance: number | null;
  used: number;
  pending: number;
  remaining: number | null;
  totalRequests: number;
}

export interface LeaveStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled?: number;
}

// ==========================================
// DTOs
// ==========================================

export interface CreateLeaveTypeDto {
  name: string;
  code: string;
  category: "cuti" | "izin";
  maxDaysPerYear?: number | null;
  requiresAttachment?: boolean;
  minDaysInAdvance?: number;
  isPaid?: boolean;
  description?: string;
}

export interface UpdateLeaveTypeDto extends Partial<CreateLeaveTypeDto> {
  isActive?: boolean;
}

export interface CreateLeaveRequestDto {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveRequestFilters {
  status?: LeaveRequestStatus | "all";
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  search?: string;
}

// ==========================================
// API Response Types
// ==========================================

export interface LeaveRequestsResponse {
  success: boolean;
  message: string;
  data: LeaveRequest[];
  stats: LeaveStats;
  pagination: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface LeaveTypesResponse {
  success: boolean;
  message: string;
  data: LeaveType[];
}

export interface LeaveBalanceResponse {
  success: boolean;
  data: LeaveBalance[];
}
