// components/attendances/AttendancesHeader.tsx

import { Button } from "@/components/ui/button";
import { Plus, Download, FileText, Loader2 } from "lucide-react";

interface AttendancesHeaderProps {
  exporting: boolean;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onManualEntry: () => void;
}

export function AttendancesHeader({
  exporting,
  onExportExcel,
  onExportPDF,
  onManualEntry,
}: AttendancesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Bagian Judul */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Presensi
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Kelola data presensi karyawan
        </p>
      </div>

      {/* Bagian Tombol Aksi */}
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {/* Export Excel & PDF - Berjejer di mobile (grid 2 kolom) */}
        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto">
          <Button
            variant="outline"
            onClick={onExportExcel}
            disabled={exporting}
            className="w-full text-xs md:text-sm"
          >
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            <span className="hidden xs:inline">Excel</span>
            <span className="inline xs:hidden">XL</span>
          </Button>

          <Button
            variant="outline"
            onClick={onExportPDF}
            disabled={exporting}
            className="w-full text-xs md:text-sm"
          >
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>

        {/* Entry Manual - Full width di mobile paling bawah */}
        <Button
          onClick={onManualEntry}
          className="w-full sm:w-auto shadow-sm active:scale-95 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Entry Manual
        </Button>
      </div>
    </div>
  );
}
