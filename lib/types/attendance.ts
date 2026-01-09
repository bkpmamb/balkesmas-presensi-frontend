// lib/types/attendance.ts

import type { LucideIcon } from "lucide-react";
export interface Shift {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceUser {
  _id: string;
  name: string;
  employeeId: string;
  category?: {
    _id: string;
    name: string;
    prefix: string;
  };
}

export interface Attendance {
  _id: string;
  user: AttendanceUser;
  shift: Shift;
  date: string;
  clockIn: string;
  clockOut?: string;
  clockInLocation: {
    type: string;
    coordinates: [number, number];
  };
  clockOutLocation?: {
    type: string;
    coordinates: [number, number];
  };
  photoUrl: string;
  photoOutUrl?: string;
  clockInStatus: "ontime" | "late";
  clockOutStatus: "normal" | "early" | "ontime";
  lateMinutes: number;
  workMinutes: number;
  isManualEntry: boolean;
  manualEntryNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendancesResponse {
  success: boolean;
  message: string;
  data: Attendance[];
  pagination: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  summary: {
    totalAttendances: number;
    totalOnTime: number;
    totalLate: number;
    totalEarlyClockOut: number;
    totalNormalClockOut: number;
    totalNotClockedOut: number;
    averageWorkMinutes: number;
  };
}

export interface ManualEntryDto {
  userId: string;
  shiftId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface ManualEntryFormValues {
  userId: string;
  shiftId: string;
  date: string; // yyyy-mm-dd
  clockIn: string; // HH:mm
  clockOut?: string; // HH:mm
  notes?: string;
}

export interface AttendanceSummary {
  totalAttendances: number;
  totalOnTime: number;
  totalLate: number;
  totalEarlyClockOut: number;
  totalNormalClockOut: number;
  totalNotClockedOut: number;
  averageWorkMinutes: number;
}

export interface AttendancePagination {
  totalData: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// UI Configuration Types
export interface AttendanceDialogState {
  manualEntry: boolean;
  view: boolean;
  delete: boolean;
}

export interface AttendanceFilters {
  search: string;
  startDate: string;
  endDate: string;
  clockInStatus: string | undefined;
}

export interface AttendanceStatCardConfig {
  title: string;
  getValue: (summary: AttendanceSummary | undefined) => number;
  getDescription: (summary: AttendanceSummary | undefined) => string;
  icon: LucideIcon;
  colorClass?: string;
}

export interface ExportParams {
  startDate?: string;
  endDate?: string;
  clockInStatus?: string;
}

export interface AttendanceHistoryItem extends Omit<Attendance, "user"> {
  workDuration?: string;
}

/**
 * Interface untuk Summary khusus Riwayat Pribadi
 * Berdasarkan controller: totalHadir, totalTerlambat, totalPulangAwal, totalMenitKerja
 */
export interface AttendanceHistorySummary {
  totalHadir: number;
  totalTerlambat: number;
  totalPulangAwal: number;
  totalMenitKerja: number;
}

/**
 * Response interface untuk endpoint /api/attendance/my-history
 */
export interface AttendanceHistoryResponse {
  success: boolean;
  message: string;
  summary: AttendanceHistorySummary;
  data: AttendanceHistoryItem[];
  pagination: AttendancePagination;
}

export interface ExportFilters {
  startDate: string;
  endDate: string;
  categoryId: string;
  employeeId: string;
  shiftId: string;
  clockInStatus: string;
  clockOutStatus: string;
  includePhotos: boolean;
  sortBy: "date" | "employee" | "shift";
  sortOrder: "asc" | "desc";
}

export interface ExportDialogState {
  isOpen: boolean;
  format: "excel" | "pdf" | null;
}

export interface ExportParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  employeeId?: string;
  shiftId?: string;
  clockInStatus?: string;
  clockOutStatus?: string;
  includePhotos?: boolean;
  sortBy?: string;
  sortOrder?: string;
}
