// config/dashboard.config.ts

import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import type {
  StatCardConfig,
  QuickAction,
  SkeletonConfig,
} from "@/lib/types/dashboard";

export const mainStatsCards: StatCardConfig[] = [
  {
    title: "Total Karyawan",
    getValue: (s) => s?.employees.total ?? 0,
    getDescription: (s) => `${s?.employees.active ?? 0} aktif`,
    icon: Users,
    className: "bg-linear-to-br from-blue-50 to-blue-100 border-blue-200",
  },
  {
    title: "Hadir Hari Ini",
    getValue: (s) => s?.today.present ?? 0,
    getDescription: (s) => `dari ${s?.today.scheduled ?? 0} dijadwalkan`,
    icon: UserCheck,
    className: "bg-linear-to-br from-green-50 to-green-100 border-green-200",
  },
  {
    title: "Tidak Hadir",
    getValue: (s) => s?.today.absent ?? 0,
    getDescription: () => "Belum clock in",
    icon: UserX,
    className: "bg-linear-to-br from-red-50 to-red-100 border-red-200",
  },
  {
    title: "Tingkat Kehadiran",
    getValue: (s) => `${s?.today.attendanceRate ?? 0}%`,
    getDescription: (s) => `${s?.today.late ?? 0} terlambat`,
    icon: TrendingUp,
    className: "bg-linear-to-br from-purple-50 to-purple-100 border-purple-200",
  },
];

export const monthlyStatsCards: StatCardConfig[] = [
  {
    title: "Presensi Bulan Ini",
    getValue: (s) => s?.thisMonth.totalAttendances ?? 0,
    getDescription: () => "Total kehadiran",
    icon: Clock,
  },
  {
    title: "Tingkat Ketepatan Waktu",
    getValue: (s) => `${s?.thisMonth.punctualityRate ?? 0}%`,
    getDescription: (s) =>
      `${s?.thisMonth.onTime ?? 0} tepat waktu dari ${
        s?.thisMonth.totalAttendances ?? 0
      }`,
    icon: UserCheck,
  },
  {
    title: "Rata-rata Jam Kerja",
    getValue: (s) => `${s?.thisMonth.averageWorkHours ?? 0} jam`,
    getDescription: () => "Per hari",
    icon: Clock,
  },
];

export const quickActions: QuickAction[] = [
  { href: "/dashboard/employees", icon: Users, label: "Kelola Karyawan" },
  { href: "/dashboard/attendances", icon: Clock, label: "Entri Manual" },
  {
    href: "/dashboard/attendances",
    icon: AlertCircle,
    label: "Lihat Presensi",
  },
  { href: "/dashboard/settings", icon: Clock, label: "Pengaturan" },
];

export const skeletonConfig: SkeletonConfig[] = [
  { count: 4, className: "h-32", gridClass: "md:grid-cols-2 lg:grid-cols-4" },
  { count: 3, className: "h-32", gridClass: "md:grid-cols-3" },
];
