// components/employees/EmployeeRecentAttendances.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Attendance } from "@/lib/types/attendance";

interface EmployeeRecentAttendancesProps {
  attendances: Attendance[];
  isLoading: boolean;
}

export function EmployeeRecentAttendances({
  attendances,
  isLoading,
}: EmployeeRecentAttendancesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Presensi Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : attendances.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Belum ada data presensi</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Durasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.map((attendance) => (
                <TableRow key={attendance._id}>
                  <TableCell>
                    {format(new Date(attendance.date), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {attendance.shift?.name ?? "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {attendance.clockIn
                      ? format(new Date(attendance.clockIn), "HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {attendance.clockOut
                      ? format(new Date(attendance.clockOut), "HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    {attendance.workMinutes > 0
                      ? `${Math.floor(attendance.workMinutes / 60)}j ${
                          attendance.workMinutes % 60
                        }m`
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
