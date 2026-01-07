// components/employee/EmployeeStats.tsx

import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import type { AttendanceSummary } from "@/lib/types/employee-attendance";

/**
 * Interface Props menggunakan AttendanceSummary yang berasal dari
 * ringkasan riwayat kehadiran (history summary).
 */
interface EmployeeStatsProps {
  stats: AttendanceSummary | undefined;
}

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export function EmployeeStats({ stats }: EmployeeStatsProps) {
  // Mapping data dari interface AttendanceSummary ke tampilan UI
  const items: StatItem[] = [
    // {
    //   label: "Tingkat Kehadiran",
    //   value: `${stats?.attendanceRate ?? 0}%`,
    //   icon: Calendar,
    //   color: "text-blue-600",
    //   bg: "bg-blue-50",
    // },
    {
      label: "Tepat Waktu",
      value: stats?.totalOnTime ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Terlambat",
      value: stats?.totalLate ?? 0,
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total Menit",
      value: `${stats?.totalLateMinutes ?? 0}m`,
      icon: Clock,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <Card key={item.label} className="border-none shadow-sm">
          <CardContent className="p-4">
            <div
              className={`${item.bg} w-8 h-8 rounded-lg flex items-center justify-center mb-2`}
            >
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <p className="text-xs text-muted-foreground leading-none mb-1">
              {item.label}
            </p>
            <p className="text-lg font-bold tracking-tight">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
