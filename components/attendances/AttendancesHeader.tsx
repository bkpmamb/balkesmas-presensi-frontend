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
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Presensi</h1>
        <p className="text-muted-foreground">Kelola data presensi karyawan</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onExportExcel} disabled={exporting}>
          {exporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Excel
        </Button>
        <Button variant="outline" onClick={onExportPDF} disabled={exporting}>
          <FileText className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
        <Button onClick={onManualEntry}>
          <Plus className="mr-2 h-4 w-4" />
          Entry Manual
        </Button>
      </div>
    </div>
  );
}
