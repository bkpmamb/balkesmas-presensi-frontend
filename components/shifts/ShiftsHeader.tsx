// components/shifts/ShiftsHeader.tsx

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ShiftsHeaderProps {
  onAddClick: () => void;
}

export function ShiftsHeader({ onAddClick }: ShiftsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Judul dan Deskripsi */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Shift</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Kelola shift dan jadwal karyawan
        </p>
      </div>

      {/* Tombol Aksi */}
      <Button
        onClick={onAddClick}
        className="w-full sm:w-auto shadow-sm transition-all active:scale-95"
      >
        <Plus className="mr-2 h-4 w-4" />
        <span>Tambah Shift</span>
      </Button>
    </div>
  );
}
