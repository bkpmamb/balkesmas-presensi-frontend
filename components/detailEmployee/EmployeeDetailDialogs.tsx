// components/employees/EmployeeDetailDialogs.tsx

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
import type { Employee, Category } from "@/lib/types/employee";

interface EmployeeDetailDialogsProps {
  employee: Employee;
  categories: Category[];
  editDialogOpen: boolean;
  deleteDialogOpen: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onEditDialogChange: (open: boolean) => void;
  onDeleteDialogChange: (open: boolean) => void;
  onEdit: (data: EmployeeFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function EmployeeDetailDialogs({
  employee,
  categories,
  editDialogOpen,
  deleteDialogOpen,
  isUpdating,
  isDeleting,
  onEditDialogChange,
  onDeleteDialogChange,
  onEdit,
  onDelete,
}: EmployeeDetailDialogsProps) {
  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={onEditDialogChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Karyawan</DialogTitle>
            <DialogDescription>
              Ubah informasi karyawan di bawah ini
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            employee={employee}
            categories={categories}
            onSubmit={onEdit}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteEmployeeDialog
        employee={employee}
        open={deleteDialogOpen}
        onOpenChange={onDeleteDialogChange}
        onConfirm={onDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
