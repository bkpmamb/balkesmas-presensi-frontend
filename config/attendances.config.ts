// config/attendances.config.ts

import { Users, Clock, AlertCircle } from "lucide-react";
import type { AttendanceStatCardConfig } from "@/lib/types/attendance";

export const attendanceStatsCards: AttendanceStatCardConfig[] = [
  {
    title: "Total Presensi",
    getValue: (summary) => summary?.totalAttendances ?? 0,
    getDescription: (summary) => `${summary?.totalAttendances ?? 0} records`,
    icon: Users,
  },
  {
    title: "Tepat Waktu",
    getValue: (summary) => summary?.totalOnTime ?? 0,
    getDescription: (summary) => {
      const total = summary?.totalAttendances ?? 0;
      const onTime = summary?.totalOnTime ?? 0;
      const percentage = total ? Math.round((onTime / total) * 100) : 0;
      return `${percentage}% dari total`;
    },
    icon: Clock,
    colorClass: "text-green-600",
  },
  {
    title: "Terlambat",
    getValue: (summary) => summary?.totalLate ?? 0,
    getDescription: (summary) => {
      const total = summary?.totalAttendances ?? 0;
      const late = summary?.totalLate ?? 0;
      const percentage = total ? Math.round((late / total) * 100) : 0;
      return `${percentage}% dari total`;
    },
    icon: AlertCircle,
    colorClass: "text-red-600",
  },
  {
    title: "Belum Clock Out",
    getValue: (summary) => summary?.totalNotClockedOut ?? 0,
    getDescription: () => "Masih dalam shift",
    icon: Clock,
    colorClass: "text-orange-600",
  },
];

export const statusOptions = [
  { value: "all", label: "Semua Status" },
  { value: "ontime", label: "Tepat Waktu" },
  { value: "late", label: "Terlambat" },
];

export const skeletonConfig = {
  headerButtons: 3,
  statsCount: 4,
  statsHeight: "h-32",
  tableHeight: "h-96",
};
