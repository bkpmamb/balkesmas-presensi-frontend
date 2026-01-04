// src/components/attendances/AttendanceTable.tsx

"use client";

import { Attendance } from "@/lib/types/attendance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Image as ImageIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AttendanceTableProps {
  attendances: Attendance[];
  onView: (attendance: Attendance) => void;
  onDelete: (attendance: Attendance) => void;
}

export function AttendanceTable({
  attendances,
  onView,
  onDelete,
}: AttendanceTableProps) {
  const getStatusBadge = (status: "ontime" | "late") => {
    return status === "ontime" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Tepat Waktu
      </Badge>
    ) : (
      <Badge variant="destructive">Terlambat</Badge>
    );
  };

  const getClockOutBadge = (status: string) => {
    if (status === "normal") {
      return <Badge variant="secondary">Normal</Badge>;
    } else if (status === "early") {
      return (
        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
          Pulang Awal
        </Badge>
      );
    }
    return <Badge variant="outline">-</Badge>;
  };

  // Helper function to get user initials safely
  const getUserInitials = (name: string | undefined | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12.5">#</TableHead>
            <TableHead>Karyawan</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Clock In</TableHead>
            <TableHead>Clock Out</TableHead>
            <TableHead>Status Masuk</TableHead>
            <TableHead>Status Pulang</TableHead>
            <TableHead>Durasi Kerja</TableHead>
            <TableHead className="w-17.5">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-8 text-muted-foreground"
              >
                Tidak ada data presensi
              </TableCell>
            </TableRow>
          ) : (
            attendances.map((attendance, index) => (
              <TableRow key={attendance._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getUserInitials(attendance.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {attendance.user?.name || "User Tidak Ditemukan"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {attendance.user?.employeeId || "-"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {attendance.date
                    ? format(new Date(attendance.date), "dd MMM yyyy", {
                        locale: id,
                      })
                    : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {attendance.shift?.name || "Shift Tidak Ditemukan"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-medium">
                      {attendance.clockIn
                        ? format(new Date(attendance.clockIn), "HH:mm")
                        : "-"}
                    </p>
                    {attendance.lateMinutes > 0 && (
                      <p className="text-xs text-red-600">
                        +{attendance.lateMinutes}m
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {attendance.clockOut ? (
                    <p className="text-sm font-medium">
                      {format(new Date(attendance.clockOut), "HH:mm")}
                    </p>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {attendance.clockInStatus
                    ? getStatusBadge(attendance.clockInStatus)
                    : "-"}
                </TableCell>
                <TableCell>
                  {attendance.clockOutStatus
                    ? getClockOutBadge(attendance.clockOutStatus)
                    : "-"}
                </TableCell>
                <TableCell>
                  {attendance.workMinutes > 0 ? (
                    <span className="text-sm">
                      {Math.floor(attendance.workMinutes / 60)}j{" "}
                      {attendance.workMinutes % 60}m
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onView(attendance)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      {attendance.photoUrl && (
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(attendance.photoUrl, "_blank")
                          }
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Lihat Foto Masuk
                        </DropdownMenuItem>
                      )}
                      {attendance.photoOutUrl && (
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(attendance.photoOutUrl, "_blank")
                          }
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Lihat Foto Pulang
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDelete(attendance)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
