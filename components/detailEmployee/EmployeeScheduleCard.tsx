// src/components/detailEmployee/EmployeeScheduleCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import type { Schedule } from "@/lib/types/employee";

interface EmployeeScheduleCardProps {
  schedules: Schedule[];
}

export function EmployeeScheduleCard({ schedules }: EmployeeScheduleCardProps) {
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const activeSchedules = schedules.filter((schedule) => schedule.isActive);

  if (activeSchedules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Jadwal Kerja
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Tidak ada jadwal yang aktif
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Jadwal Kerja
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeSchedules.map((schedule) => (
            <div
              key={schedule._id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {dayNames[schedule.dayOfWeek]}
                  </Badge>
                  <span className="font-medium">{schedule.shift.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {schedule.shift.startTime} - {schedule.shift.endTime}
                  </span>
                </div>
              </div>
              <Badge variant="secondary">
                {schedule.isActive ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
