// components/attendances/AttendancesDialogs.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ManualEntryForm } from "@/components/attendances/ManualEntryForm";
import { AttendanceDetailDialog } from "@/components/attendances/AttendanceDetailDialog";
import type { Employee } from "@/lib/types/employee";
import type {
  Attendance,
  Shift,
  AttendanceDialogState,
  ManualEntryFormValues,
} from "@/lib/types/attendance";

interface AttendancesDialogsProps {
  dialogState: AttendanceDialogState;
  selectedAttendance: Attendance | null;
  employees: Employee[];
  shifts: Shift[];
  isCreating: boolean;
  isDeleting: boolean;
  onCloseDialog: (type: keyof AttendanceDialogState) => void;
  onManualEntrySubmit: (data: ManualEntryFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function AttendancesDialogs({
  dialogState,
  selectedAttendance,
  isCreating,
  isDeleting,
  onCloseDialog,
  onManualEntrySubmit,
  onDelete,
}: AttendancesDialogsProps) {
  return (
    <>
      {/* Manual Entry Dialog */}
      <Dialog
        open={dialogState.manualEntry}
        onOpenChange={() => onCloseDialog("manualEntry")}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Presensi Manual</DialogTitle>
            <DialogDescription>
              Isi form di bawah untuk menambahkan presensi manual
            </DialogDescription>
          </DialogHeader>
          <ManualEntryForm
            onSubmit={onManualEntrySubmit}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* View Detail Dialog */}
      <AttendanceDetailDialog
        open={dialogState.view}
        onOpenChange={() => onCloseDialog("view")}
        attendance={selectedAttendance}
      />

      {/* Delete Dialog */}
      <AlertDialog
        open={dialogState.delete}
        onOpenChange={() => onCloseDialog("delete")}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Presensi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus presensi{" "}
              <span className="font-semibold">
                {selectedAttendance?.user?.name ?? "User"}
              </span>{" "}
              pada tanggal{" "}
              <span className="font-semibold">
                {selectedAttendance?.date
                  ? format(new Date(selectedAttendance.date), "dd MMM yyyy", {
                      locale: id,
                    })
                  : "-"}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
