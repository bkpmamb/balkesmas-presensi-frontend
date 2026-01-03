// lib/types/dashboard.ts

import { LucideIcon } from "lucide-react";

// API Response Types
export interface DashboardStats {
  employees: {
    total: number;
    active: number;
    inactive: number;
  };
  today: {
    present: number;
    absent: number;
    late: number;
    scheduled: number;
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

export interface TodaySummary {
  summary: {
    present: number;
    absent: number;
    late: number;
    onTime: number;
  };
  attendances: TodayAttendance[];
}

export interface TodayAttendance {
  _id: string;
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
  clockInStatus: "ontime" | "late";
  lateMinutes: number;
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalAttendances: number;
  dailyBreakdown: DailyBreakdown[];
}

export interface DailyBreakdown {
  date: string;
  total: number;
  onTime: number;
  late: number;
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

export interface SkeletonConfig {
  count: number;
  className: string;
  gridClass: string;
}
