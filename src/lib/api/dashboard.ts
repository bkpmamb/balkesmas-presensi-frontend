// src/lib/api/dashboard.ts

import apiClient from "./client";

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
  shifts: {
    total: number;
  };
  attendances: {
    allTime: number;
    thisMonth: number;
    today: number;
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
    averageWorkHours: number;
    punctualityRate: number;
  };
}

export interface AttendanceItem {
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
  date: string;
  clockIn: string;
  clockOut?: string;
  clockInStatus: "ontime" | "late";
  clockOutStatus: "normal" | "early" | "ontime";
  lateMinutes: number;
  workMinutes: number;
  photoUrl: string;
  photoOutUrl?: string;
}

export interface EmployeeWithShift {
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

// ✅ Early clock out employee info
export interface EarlyClockOutEmployee {
  user: {
    _id: string;
    name: string;
    employeeId: string;
  };
  shift: {
    _id: string;
    name: string;
  };
  clockOut: string;
  clockOutStatus: "early";
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
  attendances: AttendanceItem[];
  absentEmployees: EmployeeWithShift[];
  lateEmployees: LateEmployee[];
  earlyClockOutEmployees: EarlyClockOutEmployee[];
}

// ✅ Daily breakdown for chart
export interface DailyBreakdown {
  date: string;
  total: number;
  onTime: number;
  late: number;
}

export interface UserStats {
  user: {
    _id: string;
    name: string;
    employeeId: string;
  };
  total: number;
  onTime: number;
  late: number;
  totalLateMinutes: number;
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
    totalLateMinutes: number;
    averageLateMinutes: number;
    totalWorkHours: number;
    averageWorkHours: number;
    punctualityRate: number;
  };
  dailyBreakdown: DailyBreakdown[];
  topPerformers: UserStats[];
  mostLate: UserStats[];
}

export const dashboardApi = {
  // Get overall stats
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get("/admin/dashboard/stats");
    return data.data;
  },

  // Get today's summary
  getTodaySummary: async (): Promise<TodaySummary> => {
    const { data } = await apiClient.get("/admin/dashboard/today");
    return data.data;
  },

  // Get monthly stats
  getMonthlyStats: async (
    year?: number,
    month?: number
  ): Promise<MonthlyStats> => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());

    const { data } = await apiClient.get(
      `/admin/dashboard/monthly?${params.toString()}`
    );
    return data.data;
  },
};
