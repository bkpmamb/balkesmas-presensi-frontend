// config/employee-detail.config.ts

import type { AttendanceSummary } from "@/lib/types/attendance";

interface AttendanceStatConfig {
  key: string;
  title: string;
  getValue: (summary: AttendanceSummary | undefined) => string | number;
  description?: string;
  getDescription?: (summary: AttendanceSummary | undefined) => string;
  colorClass?: string;
}

export const attendanceStatsConfig: AttendanceStatConfig[] = [
  {
    key: "totalAttendances",
    title: "Total Kehadiran",
    getValue: (summary) => summary?.totalAttendances ?? 0,
    description: "Semua presensi",
  },
  {
    key: "totalOnTime",
    title: "Tepat Waktu",
    getValue: (summary) => summary?.totalOnTime ?? 0,
    getDescription: (summary) => {
      const total = summary?.totalAttendances ?? 0;
      const onTime = summary?.totalOnTime ?? 0;
      return total > 0 ? `${Math.round((onTime / total) * 100)}%` : "0%";
    },
    colorClass: "text-green-600",
  },
  {
    key: "totalLate",
    title: "Terlambat",
    getValue: (summary) => summary?.totalLate ?? 0,
    getDescription: (summary) => {
      const total = summary?.totalAttendances ?? 0;
      const late = summary?.totalLate ?? 0;
      return total > 0 ? `${Math.round((late / total) * 100)}%` : "0%";
    },
    colorClass: "text-red-600",
  },
  {
    key: "averageWorkHours",
    title: "Rata-rata Jam Kerja",
    getValue: (summary) => {
      const avgMinutes = summary?.averageWorkMinutes ?? 0;
      const hours = Math.round((avgMinutes / 60) * 10) / 10;
      return `${hours} jam`;
    },
    description: "Per hari",
  },
];

export const skeletonConfig = {
  infoItems: 6,
  statsCount: 4,
};
