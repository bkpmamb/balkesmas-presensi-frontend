// components/schedules/SchedulesDialogs.tsx

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
import { ScheduleForm } from "@/components/schedules/ScheduleForm";
import { DAY_NAMES } from "@/config/schedules.config";
import type { Employee } from "@/lib/types/employee";
import type { Shift } from "@/lib/types/shift";
import type {
  Schedule,
  ScheduleDialogState,
  ScheduleFormData,
} from "@/lib/types/schedule";

interface SchedulesDialogsProps {
  dialogState: ScheduleDialogState;
  selectedSchedule: Schedule | null;
  employees: Employee[];
  shifts: Shift[];
  isCreating: boolean;
  isDeleting: boolean;
  onCloseDialog: (type: keyof ScheduleDialogState) => void;
  onAdd: (data: ScheduleFormData) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function SchedulesDialogs({
  dialogState,
  selectedSchedule,
  employees,
  shifts,
  isCreating,
  isDeleting,
  onCloseDialog,
  onAdd,
  onDelete,
}: SchedulesDialogsProps) {
  return (
    <>
      {/* Add Schedule Dialog */}
      <Dialog open={dialogState.add} onOpenChange={() => onCloseDialog("add")}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Baru</DialogTitle>
            <DialogDescription>
              Pilih karyawan, shift, dan hari untuk membuat jadwal
            </DialogDescription>
          </DialogHeader>
          <ScheduleForm
            employees={employees}
            shifts={shifts}
            onSubmit={onAdd}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={dialogState.delete}
        onOpenChange={() => onCloseDialog("delete")}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jadwal</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus jadwal{" "}
              <span className="font-semibold text-foreground">
                {selectedSchedule?.user.name}
              </span>{" "}
              pada hari{" "}
              <span className="font-semibold text-foreground">
                {selectedSchedule && DAY_NAMES[selectedSchedule.dayOfWeek]}
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
