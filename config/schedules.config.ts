// config/schedules.config.ts

import { Calendar, Users } from "lucide-react";
import type { LegendItem } from "@/lib/types/schedule";

export const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

export const legendItems: LegendItem[] = [
  {
    color: "bg-blue-100",
    borderColor: "border-blue-200",
    label: "Shift Pagi",
  },
  {
    color: "bg-green-100",
    borderColor: "border-green-200",
    label: "Shift Siang",
  },
  {
    color: "bg-purple-100",
    borderColor: "border-purple-200",
    label: "Shift Malam",
  },
  {
    color: "bg-gray-100",
    borderColor: "border-gray-200",
    label: "Shift Lainnya",
  },
];

export const staticStatsCards = [
  {
    title: "Total Jadwal",
    icon: Calendar,
    descriptionText: "Semua shift & hari",
  },
  {
    title: "Karyawan Terjadwal",
    icon: Users,
    descriptionPrefix: "Dari",
    descriptionSuffix: "total",
  },
];

export const skeletonConfig = {
  statsCount: 4,
  statsHeight: "h-32",
  calendarHeight: "h-150",
};
