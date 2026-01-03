// components/schedules/SchedulesHeader.tsx

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SchedulesHeaderProps {
  onAddClick: () => void;
}

export function SchedulesHeader({ onAddClick }: SchedulesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jadwal</h1>
        <p className="text-muted-foreground">
          Kelola jadwal shift karyawan per hari
        </p>
      </div>
      <Button onClick={onAddClick}>
        <Plus className="mr-2 h-4 w-4" />
        Tambah Jadwal
      </Button>
    </div>
  );
}
