// components/employees/EmployeeDetailHeader.tsx

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import type { Employee } from "@/lib/types/employee";

interface EmployeeDetailHeaderProps {
  employee: Employee;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EmployeeDetailHeader({
  employee,
  onBack,
  onEdit,
  onDelete,
}: EmployeeDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {employee.name}
            </h1>
            <Badge variant={employee.isActive ? "default" : "secondary"}>
              {employee.isActive ? "Aktif" : "Tidak Aktif"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {employee.employeeId} •{" "}
            {employee.category?.name ?? "Tanpa Kategori"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus
        </Button>
      </div>
    </div>
  );
}
