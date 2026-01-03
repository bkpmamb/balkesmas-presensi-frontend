export interface AttendanceReport {
  _id: string;
  employeeName: string;
  clockIn: string;
  status: string;
  employeeId?: string;
  category?: string;
}
