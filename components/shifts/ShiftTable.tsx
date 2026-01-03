// src/components/shifts/ShiftTable.tsx

"use client";

import { Shift } from "@/lib/types/shift";
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
import { MoreHorizontal, Pencil, Trash2, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ShiftTableProps {
  shifts: Shift[];
  onEdit: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;
  onManageSchedule: (shift: Shift) => void;
}

export function ShiftTable({
  shifts,
  onEdit,
  onDelete,
  onManageSchedule,
}: ShiftTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12.5">#</TableHead>
            <TableHead>Nama Shift</TableHead>
            <TableHead>Kategori Shift</TableHead>
            <TableHead>Jam Mulai</TableHead>
            <TableHead>Jam Selesai</TableHead>
            <TableHead>Toleransi</TableHead>
            <TableHead>Durasi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="w-17.5">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-8 text-muted-foreground"
              >
                Tidak ada data shift
              </TableCell>
            </TableRow>
          ) : (
            shifts.map((shift, index) => {
              // Calculate duration
              const [startHour, startMinute] = shift.startTime
                .split(":")
                .map(Number);
              const [endHour, endMinute] = shift.endTime.split(":").map(Number);

              let durationMinutes =
                endHour * 60 + endMinute - (startHour * 60 + startMinute);
              if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle overnight shifts

              const hours = Math.floor(durationMinutes / 60);
              const minutes = durationMinutes % 60;

              return (
                <TableRow key={shift._id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{shift.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{shift.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{shift.startTime}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{shift.endTime}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {shift.toleranceMinutes} menit
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {hours}j {minutes}m
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={shift.isActive ? "default" : "secondary"}>
                      {shift.isActive ? "Aktif" : "Non-Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(shift.createdAt), "d MMM yyyy", {
                      locale: id,
                    })}
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
                        <DropdownMenuItem
                          onClick={() => onManageSchedule(shift)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Kelola Jadwal
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(shift)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(shift)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
