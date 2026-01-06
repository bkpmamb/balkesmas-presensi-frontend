// components/employees/EmployeesHeader.tsx

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmployeesHeaderProps {
  onAddClick: () => void;
}

export function EmployeesHeader({ onAddClick }: EmployeesHeaderProps) {
  return (
    <div className="flex flex-col items-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Karyawan</h1>
        <p className="text-muted-foreground">
          Kelola data karyawan dan informasi mereka
        </p>
      </div>
      <Button onClick={onAddClick} className="mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Tambah Karyawan
      </Button>
    </div>
  );
}
