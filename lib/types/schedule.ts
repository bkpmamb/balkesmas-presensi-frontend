// lib/types/schedule.ts

import type { LucideIcon } from "lucide-react";
import type { Employee } from "./employee";
import type { Shift } from "./shift";

export interface Schedule {
  _id: string;
  user: {
    _id: string;
    name: string;
    employeeId: string;
    category?: {
      name: string;
      prefix: string;
    };
  };
  shift: {
    _id: string;
    name: string;
    startTime: string;
    endTime: string;
  };
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleDto {
  userId: string;
  shiftId: string;
  dayOfWeek: number;
}

export interface BulkCreateScheduleDto {
  userId: string;
  shiftId: string;
  days: number[]; // Array of dayOfWeek
}

export interface SchedulesResponse {
  success: boolean;
  message: string;
  data: Schedule[];
}

export interface ScheduleResponse {
  success: boolean;
  message: string;
  data: Schedule;
}

// Helper type for calendar view
export interface SchedulesByDay {
  [day: number]: Schedule[];
}

export interface EmployeeSchedule {
  employee: Employee;
  schedules: Schedule[];
}

// UI Configuration Types
export interface ScheduleDialogState {
  add: boolean;
  delete: boolean;
}

export interface ScheduleFilters {
  employee: string;
  shift: string;
}

export interface ScheduleStatCardConfig {
  title: string;
  getValue: (data: ScheduleStatsData) => number | string;
  getDescription: (data: ScheduleStatsData) => string;
  icon: LucideIcon;
}

export interface ScheduleStatsData {
  schedules: Schedule[];
  shifts: Shift[];
  totalEmployees: number;
}

export interface ShiftByScheduleCount {
  shift: Shift;
  count: number;
}

export interface LegendItem {
  color: string;
  borderColor: string;
  label: string;
}

export interface ScheduleFormData {
  userId: string;
  shiftId: string;
  days: number[];
}
