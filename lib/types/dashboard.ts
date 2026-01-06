// lib/types/dashboard.ts

import { LucideIcon } from "lucide-react";

// API Response Types
export interface DashboardStats {
  employees: {
    total: number;
    active: number;
    inactive: number;
    byCategory: Array<{
      _id: string;
      count: number;
    }>;
  };
  today: {
    date: string;
    scheduled: number;
    present: number;
    absent: number;
    onTime: number;
    late: number;
    notClockedOut: number;
    attendanceRate: number;
  };
  thisMonth: {
    totalAttendances: number;
    onTime: number;
    late: number;
    punctualityRate: number;
    averageWorkHours: number;
  };
}

export interface AbsentEmployee {
  user: {
    _id: string;
    name: string;
    employeeId: string;
    category?: {
      _id: string;
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
}

export interface LateEmployee {
  user: {
    _id: string;
    name: string;
    employeeId: string;
  };
  shift: {
    _id: string;
    name: string;
  };
  clockIn: string;
  lateMinutes: number;
}

export interface TodayAttendance {
  _id: string;
  user: {
    _id: string;
    name: string;
    employeeId: string;
    category?: {
      _id: string;
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
  clockIn: string;
  clockOut?: string;
  clockInStatus: "ontime" | "late";
  clockOutStatus?: "normal" | "early";
  lateMinutes: number;
  workMinutes: number;
}

export interface TodaySummary {
  date: string;
  dayName: string;
  summary: {
    scheduled: number;
    present: number;
    absent: number;
    onTime: number;
    late: number;
    notClockedOut: number;
    earlyClockOut: number;
  };
  attendances: TodayAttendance[];
  absentEmployees: AbsentEmployee[];
  lateEmployees: LateEmployee[];
}

export interface DailyBreakdown {
  date: string;
  total: number;
  onTime: number;
  late: number;
}

export interface MonthlyStats {
  period: {
    year: number;
    month: number;
    monthName: string;
    startDate: string;
    endDate: string;
  };
  summary: {
    totalAttendances: number;
    totalOnTime: number;
    totalLate: number;
    punctualityRate: number;
    averageWorkHours: number;
  };
  dailyBreakdown: DailyBreakdown[];
}

export interface ChartData {
  date: string;
  total: number;
  onTime: number;
  late: number;
}

// UI Configuration Types
export interface StatCardConfig {
  title: string;
  getValue: (stats: DashboardStats | undefined) => string | number;
  getDescription: (stats: DashboardStats | undefined) => string;
  icon: LucideIcon;
  className?: string;
}

export interface QuickAction {
  href: string;
  icon: LucideIcon;
  label: string;
}
