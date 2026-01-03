// components/schedules/SchedulesStatsCards.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import type { ShiftByScheduleCount } from "@/lib/types/schedule";

interface SchedulesStatsCardsProps {
  totalSchedules: number;
  uniqueEmployees: number;
  totalEmployees: number;
  schedulesByShift: ShiftByScheduleCount[];
}

export function SchedulesStatsCards({
  totalSchedules,
  uniqueEmployees,
  totalEmployees,
  schedulesByShift,
}: SchedulesStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Jadwal</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSchedules}</div>
          <p className="text-xs text-muted-foreground">Semua shift & hari</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Karyawan Terjadwal
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueEmployees}</div>
          <p className="text-xs text-muted-foreground">
            Dari {totalEmployees} total
          </p>
        </CardContent>
      </Card>

      {schedulesByShift.slice(0, 2).map((item) => (
        <Card key={item.shift._id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.shift.name}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.count}</div>
            <p className="text-xs text-muted-foreground">
              {item.shift.startTime} - {item.shift.endTime}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
