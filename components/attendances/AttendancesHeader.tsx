// components/attendances/AttendancesHeader.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Plus,
  ChevronDown,
  Settings2,
} from "lucide-react";

interface AttendancesHeaderProps {
  exporting: boolean;
  onExportDialog: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onManualEntry: () => void;
}

export function AttendancesHeader({
  exporting,
  onExportDialog,
  onExportExcel,
  onExportPDF,
  onManualEntry,
}: AttendancesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Presensi</h1>
        <p className="text-muted-foreground">
          Kelola dan pantau data presensi karyawan
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={exporting}>
              <Download className="mr-2 h-4 w-4" />
              Export
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onExportDialog}>
              <Settings2 className="mr-2 h-4 w-4" />
              Export dengan Filter...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExportExcel}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Quick Export Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Quick Export PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Manual Entry Button */}
        <Button onClick={onManualEntry}>
          <Plus className="mr-2 h-4 w-4" />
          Presensi Manual
        </Button>
      </div>
    </div>
  );
}
