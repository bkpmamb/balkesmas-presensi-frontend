// src/types/employee.ts

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
