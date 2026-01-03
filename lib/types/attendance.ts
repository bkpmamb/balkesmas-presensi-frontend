// lib/types/attendance.ts

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
