// src/components/dashboard/RecentAttendances.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Attendance {
  _id: string;
  user: {
    name: string;
    employeeId: string;
  };
  shift: {
    name: string;
  };
  clockIn: string;
  clockOut?: string;
  clockInStatus: "ontime" | "late";
  lateMinutes: number;
}

interface RecentAttendancesProps {
  attendances: Attendance[];
}

export function RecentAttendances({ attendances }: RecentAttendancesProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Presensi Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {attendances.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Belum ada presensi hari ini
            </p>
          ) : (
            attendances.slice(0, 5).map((attendance) => (
              <div
                key={attendance._id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {attendance.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {attendance.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {attendance.user.employeeId} • {attendance.shift.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm">
                    <p className="font-medium">
                      {format(new Date(attendance.clockIn), "HH:mm", {
                        locale: id,
                      })}
                    </p>
                    {attendance.clockOut && (
                      <p className="text-muted-foreground">
                        -{" "}
                        {format(new Date(attendance.clockOut), "HH:mm", {
                          locale: id,
                        })}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      attendance.clockInStatus === "ontime"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {attendance.clockInStatus === "ontime"
                      ? "Tepat Waktu"
                      : `Terlambat ${attendance.lateMinutes}m`}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
