// src/types/employee.ts

import { Attendance } from "./attendance";

export interface Category {
  _id: string;
  name: string;
  prefix: string;
}

export interface Employee {
  _id: string;
  name: string;
  username: string;
  employeeId: string;
  role: "admin" | "employee";
  category: Category;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  name: string;
  username: string;
  password: string;
  category: string;
  phone?: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  username?: string;
  password?: string;
  category?: string;
  phone?: string;
  isActive?: boolean;
}

export interface EmployeesResponse {
  success: boolean;
  message: string;
  data: Employee[];
  pagination: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface EmployeeResponse {
  success: boolean;
  message: string;
  data: Employee;
}

export interface PaginationData {
  totalData: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface EmployeePagination {
  totalData: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export interface EmployeeDialogState {
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface EmployeeFilters {
  search: string;
  category: string;
  status: string | undefined;
}

export interface EmployeeStatCard {
  id: string;
  title: string;
  count: number;
}

export interface EmployeeAttendanceSummary {
  totalAttendances: number;
  totalOnTime: number;
  totalLate: number;
  totalLateMinutes: number;
  averageWorkHours: number;
  attendanceRate: number;
}

export interface EmployeeDetailStats {
  title: string;
  value: string | number;
  description?: string;
  colorClass?: string;
}

export interface MonthlyStatistics {
  totalAttendances: number;
  onTimeAttendances: number;
  lateAttendances: number;
  workingDays: number;
  attendanceRate: number;
  averageWorkHours: number;
  totalLateMinutes: number;
}

export interface Schedule {
  _id: string;
  user: string;
  dayOfWeek: number;
  isActive: boolean;
  shift: Shift;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Shift {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface EmployeeDetailResponse {
  success: boolean;
  data: {
    employee: Employee;
    schedules: Schedule[];
    statistics: {
      thisMonth: MonthlyStatistics;
    };
    recentAttendances: Attendance[]; 
  };
}
