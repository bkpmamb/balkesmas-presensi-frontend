// components/shifts/ShiftsDialogs.tsx

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
import { ShiftForm } from "@/components/shifts/ShiftForm";
import { ScheduleManager } from "@/components/shifts/ScheduleManager";
import type {
  Shift,
  CreateShiftDto,
  UpdateShiftDto,
  ShiftDialogState,
  Category,
} from "@/lib/types/shift";

interface ShiftsDialogsProps {
  dialogState: ShiftDialogState;
  selectedShift: Shift | null;
  categories: Category[];
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onCloseDialog: (type: keyof ShiftDialogState) => void;
  onCreate: (data: CreateShiftDto) => Promise<void>;
  onEdit: (data: UpdateShiftDto) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function ShiftsDialogs({
  dialogState,
  selectedShift,
  categories,
  isCreating,
  isUpdating,
  isDeleting,
  onCloseDialog,
  onCreate,
  onEdit,
  onDelete,
}: ShiftsDialogsProps) {
  return (
    <>
      {/* Create Dialog */}
      <Dialog
        open={dialogState.create}
        onOpenChange={() => onCloseDialog("create")}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Shift Baru</DialogTitle>
            <DialogDescription>
              Isi form di bawah untuk menambahkan shift baru
            </DialogDescription>
          </DialogHeader>
          <ShiftForm
            categories={categories}
            onSubmit={onCreate}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={dialogState.edit}
        onOpenChange={() => onCloseDialog("edit")}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
            <DialogDescription>
              Ubah informasi shift di bawah ini
            </DialogDescription>
          </DialogHeader>
          {selectedShift && (
            <ShiftForm
              shift={selectedShift}
              categories={categories}
              onSubmit={onEdit}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Manager Dialog */}
      <Dialog
        open={dialogState.schedule}
        onOpenChange={() => onCloseDialog("schedule")}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kelola Jadwal - {selectedShift?.name}</DialogTitle>
            <DialogDescription>
              Atur jadwal karyawan untuk shift ini per hari
            </DialogDescription>
          </DialogHeader>
          {selectedShift && <ScheduleManager shift={selectedShift} />}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={dialogState.delete}
        onOpenChange={() => onCloseDialog("delete")}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Shift</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus shift{" "}
              <span className="font-semibold text-foreground">
                {selectedShift?.name}
              </span>
              ? Semua jadwal yang terkait dengan shift ini juga akan dihapus.
              Tindakan ini tidak dapat dibatalkan.
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
