// components/shifts/ShiftsHeader.tsx

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ShiftsHeaderProps {
  onAddClick: () => void;
}

export function ShiftsHeader({ onAddClick }: ShiftsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shift</h1>
        <p className="text-muted-foreground">
          Kelola shift dan jadwal karyawan
        </p>
      </div>
      <Button onClick={onAddClick}>
        <Plus className="mr-2 h-4 w-4" />
        Tambah Shift
      </Button>
    </div>
  );
}
