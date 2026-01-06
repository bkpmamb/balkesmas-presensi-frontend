// src/components/detailEmployee/EmployeeStatsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Timer,
} from "lucide-react";
import type { MonthlyStatistics } from "@/lib/types/employee";

interface EmployeeStatsCardProps {
  statistics?: MonthlyStatistics;
}

export function EmployeeStatsCard({ statistics }: EmployeeStatsCardProps) {
  if (!statistics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistik Bulan Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Tidak ada data statistik
          </p>
        </CardContent>
      </Card>
    );
  }

  const attendanceRate = statistics.attendanceRate || 0;
  const averageWorkHours = statistics.averageWorkHours || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Statistik Bulan Ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Attendance Rate */}
          {/* <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tingkat Kehadiran</span>
              </div>
              <span className="font-bold">{attendanceRate.toFixed(1)}%</span>
            </div>
            <Progress value={attendanceRate} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {statistics.totalAttendances} dari {statistics.workingDays} hari
                kerja
              </span>
              <span>
                {statistics.onTimeAttendances} tepat waktu,{" "}
                {statistics.lateAttendances} terlambat
              </span>
            </div>
          </div> */}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Hadir</span>
              </div>
              <p className="text-2xl font-bold">
                {statistics.totalAttendances}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium">Menit Terlambat</span>
              </div>
              <p className="text-2xl font-bold truncate">
                {statistics.totalLateMinutes}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  menit
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Jam Kerja Rata-rata</span>
              </div>
              <p className="text-2xl font-bold">
                {averageWorkHours.toFixed(1)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Hari Kerja</span>
              </div>
              <p className="text-2xl font-bold">{statistics.workingDays}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
