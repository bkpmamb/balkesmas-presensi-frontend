// config/shifts.config.ts

import { Clock, Users, Calendar } from "lucide-react";
import type { ShiftStatCardConfig } from "@/lib/types/shift";

export const shiftStatsCards: ShiftStatCardConfig[] = [
  {
    title: "Total Shift",
    getValue: (_, pagination) => pagination?.totalData ?? 0,
    getDescription: () => "Semua shift",
    icon: Clock,
  },
  {
    title: "Halaman Ini",
    getValue: (shifts) => shifts.length,
    getDescription: (shifts) => {
      const activeCount = shifts.filter((s) => s.isActive).length;
      return `${activeCount} aktif`;
    },
    icon: Users,
    colorClass: "text-blue-600",
  },
  {
    title: "Shift Non-Aktif",
    getValue: (shifts) => shifts.filter((s) => !s.isActive).length,
    getDescription: () => "Di halaman ini",
    icon: Calendar,
    colorClass: "text-gray-600",
  },
];

export const skeletonConfig = {
  statsCount: 3,
  statsHeight: "h-32",
  tableHeight: "h-96",
};