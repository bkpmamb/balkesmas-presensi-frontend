import axios from "axios";
import { AttendanceReport } from "@/lib/types/attendanceReport";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAttendanceReport = async (
  startDate: string,
  endDate: string
) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/admin/report`, {
    params: { startDate, endDate },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data as AttendanceReport[];
};
