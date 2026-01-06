// components/schedules/SchedulesHeader.tsx

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SchedulesHeaderProps {
  onAddClick: () => void;
}

export function SchedulesHeader({ onAddClick }: SchedulesHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      {/* Teks Judul & Deskripsi */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Jadwal
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Kelola jadwal shift karyawan per hari
        </p>
      </div>

      {/* Tombol Aksi */}
      <div className="flex items-center">
        <Button
          onClick={onAddClick}
          className="w-full shadow-sm sm:w-auto transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="inline">Tambah Jadwal</span>
        </Button>
      </div>
    </div>
  );
}
