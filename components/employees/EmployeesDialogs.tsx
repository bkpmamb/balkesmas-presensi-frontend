// components/employees/EmployeesDialogs.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EmployeeForm,
  EmployeeFormValues,
} from "@/components/employees/EmployeeForm";
import { DeleteEmployeeDialog } from "@/components/employees/DeleteEmployeeDialog";
import type {
  Employee,
  Category,
  EmployeeDialogState,
} from "@/lib/types/employee";

interface EmployeesDialogsProps {
  dialogState: EmployeeDialogState;
  selectedEmployee: Employee | null;
  categories: Category[];
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onCloseDialog: (type: keyof EmployeeDialogState) => void;
  onCreate: (data: EmployeeFormValues) => Promise<void>;
  onEdit: (data: EmployeeFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function EmployeesDialogs({
  dialogState,
  selectedEmployee,
  categories,
  isCreating,
  isUpdating,
  isDeleting,
  onCloseDialog,
  onCreate,
  onEdit,
  onDelete,
}: EmployeesDialogsProps) {
  return (
    <>
      {/* Create Dialog */}
      <Dialog
        open={dialogState.create}
        onOpenChange={() => onCloseDialog("create")}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Karyawan Baru</DialogTitle>
            <DialogDescription>
              Isi form di bawah untuk menambahkan karyawan baru
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
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
            <DialogTitle>Edit Karyawan</DialogTitle>
            <DialogDescription>
              Ubah informasi karyawan di bawah ini
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm
              employee={selectedEmployee}
              categories={categories}
              onSubmit={onEdit}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteEmployeeDialog
        employee={selectedEmployee}
        open={dialogState.delete}
        onOpenChange={() => onCloseDialog("delete")}
        onConfirm={onDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
