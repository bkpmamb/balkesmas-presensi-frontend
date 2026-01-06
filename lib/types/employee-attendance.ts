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
}

export interface CameraState {
  isOpen: boolean;
  photo: string | null;
  error: string | null;
}

export type AttendanceAction = "clock-in" | "clock-out" | null;
