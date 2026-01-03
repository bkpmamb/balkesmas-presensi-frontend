// src/lib/types/shift.ts

import { LucideIcon } from "lucide-react";

export interface Category {
  _id: string;
  name: string;
  prefix: string;
}

export interface Shift {
  _id: string;
  name: string;
  category: Category;
  startTime: string;
  endTime: string;
  toleranceMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftDto {
  name: string;
  category: string; // ✅ Fixed: should be string (ID), not Category object
  startTime: string;
  endTime: string;
  toleranceMinutes: number;
}

export interface UpdateShiftDto {
  name?: string;
  category?: string; // ✅ Fixed: should be string (ID), not Category object
  startTime?: string;
  endTime?: string;
  toleranceMinutes?: number;
  isActive?: boolean;
}

export interface ShiftResponse {
  success: boolean;
  message: string;
  data: Shift;
}

export interface ShiftsResponse {
  success: boolean;
  message: string;
  data: Shift[];
  pagination: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ShiftSchedule {
  _id: string;
  user: {
    _id: string;
    name: string;
    employeeId: string;
  };
  shift: Shift;
  dayOfWeek: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleDto {
  userId: string;
  shiftId: string;
  dayOfWeek: number;
}

export interface PaginationInfo {
  totalData: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ShiftStatCardConfig {
  title: string;
  getValue: (shifts: Shift[], pagination?: PaginationInfo) => number;
  getDescription: (shifts: Shift[]) => string;
  icon: LucideIcon;
  colorClass?: string;
}

export interface ShiftDialogState {
  create: boolean;
  edit: boolean;
  schedule: boolean;
  delete: boolean;
}
