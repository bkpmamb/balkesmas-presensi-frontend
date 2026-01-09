// lib/types/employee-attendance.ts

export interface EmployeeProfile {
  _id: string;
  name: string;
  username: string;
  employeeId: string;
  role: "admin" | "employee";
  category: {
    _id: string;
    name: string;
    prefix: string;
  };
  phone?: string;
  isActive: boolean;
}

export interface TodaySchedule {
  _id: string;
  shift: {
    _id: string;
    name: string;
    startTime: string;
    endTime: string;
    toleranceMinutes: number;
  };
  dayOfWeek: number;
  isActive: boolean;
  canClockInNow?: boolean;
  clockInWindowStart?: string;
  minutesUntilClockIn?: number | null;
}

export interface TodayAttendance {
  _id: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  clockInStatus: "ontime" | "late";
  clockOutStatus?: "normal" | "early";
  lateMinutes: number;
  workMinutes: number;
  photoUrl: string;
  photoOutUrl?: string;
  shift: {
    _id: string;
    name: string;
    startTime: string;
    endTime: string;
  };
  canClockOutNow?: boolean;
  onClockIn?: boolean;
  isOvernightShift?: boolean;
}

export interface ClockInResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    clockIn: string;
    clockInStatus: "ontime" | "late";
    lateMinutes: number;
    shift: {
      name: string;
      startTime: string;
      endTime: string;
    };
    location: {
      distance: number;
      isValid: boolean;
    };
  };
}

export interface ClockOutResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    clockIn: string;
    clockOut: string;
    clockInStatus: "ontime" | "late";
    clockOutStatus: "normal" | "early";
    lateMinutes: number;
    workDuration: string;
    workMinutes: number;
    shift: {
      name: string;
      startTime: string;
      endTime: string;
    };
    location: {
      distance: number;
      isValid: boolean;
    };
  };
}

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  address?: string | null;
}

export interface CameraState {
  isOpen: boolean;
  photo: string | null;
  error: string | null;
}

export interface EmployeeStatistics {
  thisMonth: {
    totalAttendances: number;
    onTimeAttendances: number;
    lateAttendances: number;
    totalLateMinutes: number;
    attendanceRate: number;
  };
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  response?: {
    data?: {
      success?: boolean;
      message?: string;
    };
  };
}

export interface AttendanceSummary {
  totalAttendances: number;
  totalOnTime: number;
  totalLate: number;
  totalLateMinutes: number;
  totalWorkMinutes: number;
  attendanceRate?: number; // Opsional jika backend mengirimkannya
}

export interface PaginationData {
  totalData: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AttendanceHistoryResponse {
  success: boolean;
  message: string;
  data: TodayAttendance[]; // Kita gunakan interface TodayAttendance yang sudah ada
  summary: AttendanceSummary;
  pagination: PaginationData;
}

export interface WorkSchedule {
  _id: string;
  user: string;
  dayOfWeek: number; // 0-6
  shift: {
    _id: string;
    name: string;
    startTime: string;
    endTime: string;
  };
  isActive: boolean;
}

export interface EmployeeInitResponse {
  profile: EmployeeProfile;
  schedule: TodaySchedule | null;
  attendance: TodayAttendance | null;
}

export type AttendanceAction = "clock-in" | "clock-out" | null;
