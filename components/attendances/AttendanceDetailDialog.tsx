// components/attendances/AttendanceDetailDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import type { Attendance } from "@/lib/types/attendance";

interface AttendanceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendance: Attendance | null;
}

export function AttendanceDetailDialog({
  open,
  onOpenChange,
  attendance,
}: AttendanceDetailDialogProps) {
  if (!attendance) return null;

  const detailItems = [
    {
      label: "Karyawan",
      value: attendance.user?.name ?? "User Tidak Ditemukan",
      subValue: attendance.user?.employeeId ?? "-",
    },
    {
      label: "Shift",
      value: attendance.shift?.name ?? "Shift Tidak Ditemukan",
      subValue: attendance.shift
        ? `${attendance.shift.startTime} - ${attendance.shift.endTime}`
        : "-",
    },
    {
      label: "Tanggal",
      value: attendance.date
        ? format(new Date(attendance.date), "dd MMMM yyyy", { locale: id })
        : "-",
    },
    {
      label: "Status Masuk",
      value:
        attendance.clockInStatus === "ontime"
          ? "Tepat Waktu"
          : `Terlambat ${attendance.lateMinutes} menit`,
    },
    {
      label: "Clock In",
      value: attendance.clockIn
        ? format(new Date(attendance.clockIn), "HH:mm:ss")
        : "-",
    },
    {
      label: "Clock Out",
      value: attendance.clockOut
        ? format(new Date(attendance.clockOut), "HH:mm:ss")
        : "-",
    },
    {
      label: "Durasi Kerja",
      value:
        attendance.workMinutes > 0
          ? `${Math.floor(attendance.workMinutes / 60)}j ${attendance.workMinutes % 60}m`
          : "-",
    },
    {
      label: "Entry Manual",
      value: attendance.isManualEntry ? "Ya" : "Tidak",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detail Presensi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {detailItems.map((item) => (
              <div key={item.label}>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-lg font-semibold">{item.value}</p>
                {item.subValue && (
                  <p className="text-sm text-muted-foreground">
                    {item.subValue}
                  </p>
                )}
              </div>
            ))}
          </div>

          {attendance.manualEntryNote && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Catatan Manual Entry
              </p>
              <p className="text-sm bg-gray-50 p-3 rounded">
                {attendance.manualEntryNote}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {attendance.photoUrl && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Foto Clock In
                </p>
                <Image
                  src={attendance.photoUrl}
                  alt="Clock In"
                  width={400}
                  height={300}
                  className="rounded-lg border w-full object-cover"
                />
              </div>
            )}
            {attendance.photoOutUrl && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Foto Clock Out
                </p>
                <Image
                  src={attendance.photoOutUrl}
                  alt="Clock Out"
                  width={400}
                  height={300}
                  className="rounded-lg border w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}