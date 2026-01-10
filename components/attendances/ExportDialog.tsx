// components/attendances/ExportDialog.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  FileText,
  Loader2,
  Calendar,
  Users,
  Clock,
  Filter,
  Download,
  X,
  Building,
  ArrowUpDown,
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { id } from "date-fns/locale";
import type { Category } from "@/lib/types/employee";
import type { Shift } from "@/lib/types/shift";
import type { ExportFilters } from "@/lib/types/attendance";

interface Employee {
  _id: string;
  name: string;
  employeeId: string;
  category?: {
    _id: string;
    name: string;
  };
}

interface ExportDialogProps {
  isOpen: boolean;
  format: "excel" | "pdf" | null;
  categories: Category[];
  employees: Employee[];
  shifts: Shift[];
  exporting: boolean;
  isLoadingData?: boolean;
  onClose: () => void;
  onExport: (format: "excel" | "pdf", filters: ExportFilters) => void;
}

const initialFilters: ExportFilters = {
  startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
  endDate: format(new Date(), "yyyy-MM-dd"),
  categoryId: "",
  employeeId: "",
  shiftId: "",
  clockInStatus: "",
  clockOutStatus: "",
  includePhotos: false,
  sortBy: "date",
  sortOrder: "desc",
};

const datePresets = [
  {
    label: "Hari Ini",
    getValue: () => ({ start: new Date(), end: new Date() }),
  },
  {
    label: "7 Hari Terakhir",
    getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }),
  },
  {
    label: "30 Hari Terakhir",
    getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }),
  },
  {
    label: "Bulan Ini",
    getValue: () => ({ start: startOfMonth(new Date()), end: new Date() }),
  },
  {
    label: "Bulan Lalu",
    getValue: () => ({
      start: startOfMonth(subMonths(new Date(), 1)),
      end: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
];

const clockInStatusOptions = [
  { value: "", label: "Semua Status" },
  { value: "ontime", label: "Tepat Waktu" },
  { value: "late", label: "Terlambat" },
];

const clockOutStatusOptions = [
  { value: "", label: "Semua Status" },
  { value: "normal", label: "Normal" },
  { value: "early", label: "Pulang Awal" },
];

const sortByOptions = [
  { value: "date", label: "Tanggal" },
  { value: "employee", label: "Nama Karyawan" },
  { value: "shift", label: "Shift" },
];

export function ExportDialog({
  isOpen,
  format: initialFormat,
  categories,
  employees,
  shifts,
  exporting,
  isLoadingData = false,
  onClose,
  onExport,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<"excel" | "pdf">(
    initialFormat || "excel"
  );
  const [filters, setFilters] = useState<ExportFilters>(initialFilters);
  const filteredEmployees = useMemo(() => {
    if (filters.categoryId) {
      return employees.filter(
        (emp) => emp.category?._id === filters.categoryId
      );
    }
    return employees;
  }, [filters.categoryId, employees]);

  // Update format when prop changes
  useEffect(() => {
    if (initialFormat && initialFormat !== selectedFormat) {
      setSelectedFormat(initialFormat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFormat]);

  useEffect(() => {
    if (filters.categoryId && filters.employeeId) {
      const stillValid = employees.some(
        (emp) =>
          emp._id === filters.employeeId &&
          emp.category?._id === filters.categoryId
      );
      if (!stillValid) {
        setFilters((prev) => ({ ...prev, employeeId: "" }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.categoryId]);

  // Filter shifts by category
  const filteredShifts = useMemo(() => {
    if (filters.categoryId) {
      return shifts.filter((shift) => {
        const shiftCategoryId =
          typeof shift.category === "string"
            ? shift.category
            : shift.category?._id;
        return shiftCategoryId === filters.categoryId;
      });
    }
    return shifts;
  }, [filters.categoryId, shifts]);

  const updateFilter = <K extends keyof ExportFilters>(
    key: K,
    value: ExportFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyDatePreset = (preset: (typeof datePresets)[0]) => {
    const { start, end } = preset.getValue();
    setFilters((prev) => ({
      ...prev,
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const handleExport = () => {
    onExport(selectedFormat, filters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categoryId) count++;
    if (filters.employeeId) count++;
    if (filters.shiftId) count++;
    if (filters.clockInStatus) count++;
    if (filters.clockOutStatus) count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Laporan Presensi
          </DialogTitle>
          <DialogDescription>
            Pilih format dan filter data yang ingin di-export
          </DialogDescription>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Memuat data filter...
            </span>
          </div>
        ) : (
          <Tabs
            value={selectedFormat}
            onValueChange={(v) => setSelectedFormat(v as "excel" | "pdf")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="excel" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                PDF
              </TabsTrigger>
            </TabsList>

            <TabsContent value="excel" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Export ke format Excel (.xlsx) dengan semua data detail
                    termasuk perhitungan jam kerja.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pdf" className="mt-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Export ke format PDF untuk laporan yang siap cetak dengan
                    format yang rapi.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        {/* Date Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Periode Tanggal
            </Label>
            <div className="flex gap-1 flex-wrap">
              {datePresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => applyDatePreset(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Dari Tanggal</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => updateFilter("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Sampai Tanggal</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => updateFilter("endDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter Data
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFilterCount()} aktif
                </Badge>
              )}
            </Label>
            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Kategori
              </Label>
              <Select
                value={filters.categoryId}
                onValueChange={(value) =>
                  updateFilter("categoryId", value === "all" ? "" : value)
                }
              >
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employee Filter */}
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Karyawan
              </Label>
              <Select
                value={filters.employeeId}
                onValueChange={(value) =>
                  updateFilter("employeeId", value === "all" ? "" : value)
                }
              >
                <SelectTrigger id="employeeId">
                  <SelectValue placeholder="Semua Karyawan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Karyawan</SelectItem>
                  {filteredEmployees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.name} ({employee.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shift Filter */}
            <div className="space-y-2">
              <Label htmlFor="shiftId" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Shift
              </Label>
              <Select
                value={filters.shiftId}
                onValueChange={(value) =>
                  updateFilter("shiftId", value === "all" ? "" : value)
                }
              >
                <SelectTrigger id="shiftId">
                  <SelectValue placeholder="Semua Shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Shift</SelectItem>
                  {filteredShifts.map((shift) => (
                    <SelectItem key={shift._id} value={shift._id}>
                      {shift.name} ({shift.startTime} - {shift.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clock In Status */}
            <div className="space-y-2">
              <Label htmlFor="clockInStatus">Status Masuk</Label>
              <Select
                value={filters.clockInStatus}
                onValueChange={(value) =>
                  updateFilter("clockInStatus", value === "all" ? "" : value)
                }
              >
                <SelectTrigger id="clockInStatus">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  {clockInStatusOptions.map((option) => (
                    <SelectItem
                      key={option.value || "all"}
                      value={option.value || "all"}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clock Out Status */}
            <div className="space-y-2">
              <Label htmlFor="clockOutStatus">Status Pulang</Label>
              <Select
                value={filters.clockOutStatus}
                onValueChange={(value) =>
                  updateFilter("clockOutStatus", value === "all" ? "" : value)
                }
              >
                <SelectTrigger id="clockOutStatus">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  {clockOutStatusOptions.map((option) => (
                    <SelectItem
                      key={option.value || "all"}
                      value={option.value || "all"}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label htmlFor="sortBy" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Urutkan Berdasarkan
              </Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  updateFilter("sortBy", value as ExportFilters["sortBy"])
                }
              >
                <SelectTrigger id="sortBy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortByOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-4">
            <Label>Urutan:</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={filters.sortOrder === "desc" ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter("sortOrder", "desc")}
              >
                Terbaru
              </Button>
              <Button
                type="button"
                variant={filters.sortOrder === "asc" ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter("sortOrder", "asc")}
              >
                Terlama
              </Button>
            </div>
          </div>

          {/* Include Photos (PDF only) */}
          {/* {selectedFormat === "pdf" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includePhotos"
                checked={filters.includePhotos}
                onCheckedChange={(checked) =>
                  updateFilter("includePhotos", checked as boolean)
                }
              />
              <Label
                htmlFor="includePhotos"
                className="text-sm font-normal cursor-pointer"
              >
                Sertakan foto presensi (ukuran file lebih besar)
              </Label>
            </div>
          )} */}
        </div>

        {/* Summary */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Periode:</span>{" "}
                {format(new Date(filters.startDate), "dd MMMM yyyy", {
                  locale: id,
                })}{" "}
                -{" "}
                {format(new Date(filters.endDate), "dd MMMM yyyy", {
                  locale: id,
                })}
              </p>
              <p>
                <span className="font-medium">Format:</span>{" "}
                {selectedFormat === "excel" ? "Excel (.xlsx)" : "PDF (.pdf)"}
              </p>
              {getActiveFilterCount() > 0 && (
                <p>
                  <span className="font-medium">Filter aktif:</span>{" "}
                  {getActiveFilterCount()} filter
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={exporting}>
            Batal
          </Button>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengexport...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export {selectedFormat === "excel" ? "Excel" : "PDF"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
