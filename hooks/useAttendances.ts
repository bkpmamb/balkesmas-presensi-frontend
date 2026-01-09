// hooks/useAttendances.ts

import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { attendancesApi } from "@/src/lib/api/attendances";
import { employeesApi } from "@/src/lib/api/employees";
import { shiftsApi } from "@/src/lib/api/shifts";
import { useDebounce } from "@/hooks/useDebounce";
import type { ApiError } from "@/lib/types/api";
import type {
  Attendance,
  ManualEntryDto,
  ManualEntryFormValues,
  AttendanceDialogState,
  AttendanceFilters,
  ExportFilters,
  ExportDialogState,
} from "@/lib/types/attendance";

const initialDialogState: AttendanceDialogState = {
  manualEntry: false,
  view: false,
  delete: false,
};

const initialFilters: AttendanceFilters = {
  search: "",
  startDate: "",
  endDate: "",
  clockInStatus: undefined,
};

const initialExportDialog: ExportDialogState = {
  isOpen: false,
  format: null,
};

export function useAttendances() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AttendanceFilters>(initialFilters);
  const [dialogState, setDialogState] =
    useState<AttendanceDialogState>(initialDialogState);
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportDialog, setExportDialog] =
    useState<ExportDialogState>(initialExportDialog);

  // Debounce search filter
  const debouncedSearch = useDebounce(filters.search, 500);

  // Memoize filters for query
  const queryFilters = useMemo(
    () => ({
      search: debouncedSearch,
      startDate: filters.startDate,
      endDate: filters.endDate,
      clockInStatus: filters.clockInStatus,
    }),
    [debouncedSearch, filters.startDate, filters.endDate, filters.clockInStatus]
  );

  // Fetch attendances
  const { data, isLoading } = useQuery({
    queryKey: ["attendances", page, queryFilters],
    queryFn: () =>
      attendancesApi.getAll({
        page,
        limit: 10,
        search: queryFilters.search,
        startDate: queryFilters.startDate,
        endDate: queryFilters.endDate,
        clockInStatus: queryFilters.clockInStatus,
      }),
  });

  // Fetch employees for manual entry & export
  const { data: employeesData } = useQuery({
    queryKey: ["employees-all"],
    queryFn: () => employeesApi.getAll({ limit: 100 }),
  });

  // Fetch shifts for manual entry & export
  const { data: shifts = [] } = useQuery({
    queryKey: ["shifts-all"],
    queryFn: () => shiftsApi.getAllForSelect(),
  });

  // Fetch categories for export
  const { data: categories = [] } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => employeesApi.getCategories(),
  });

  // Create manual entry mutation
  const createManualEntryMutation = useMutation({
    mutationFn: (entry: ManualEntryDto) =>
      attendancesApi.createManualEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      closeDialog("manualEntry");
      toast.success("Presensi manual berhasil ditambahkan!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menambahkan presensi manual");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => attendancesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      closeDialog("delete");
      setSelectedAttendance(null);
      toast.success("Presensi berhasil dihapus!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menghapus presensi");
    },
  });

  // Dialog handlers
  const openDialog = (
    type: keyof AttendanceDialogState,
    attendance?: Attendance
  ) => {
    if (attendance) setSelectedAttendance(attendance);
    setDialogState((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof AttendanceDialogState) => {
    setDialogState((prev) => ({ ...prev, [type]: false }));
    if (type !== "manualEntry") {
      setTimeout(() => setSelectedAttendance(null), 200);
    }
  };

  // Export dialog handlers
  const openExportDialog = (format?: "excel" | "pdf") => {
    setExportDialog({ isOpen: true, format: format || null });
  };

  const closeExportDialog = () => {
    setExportDialog({ isOpen: false, format: null });
  };

  // Filter handlers
  const updateFilter = <K extends keyof AttendanceFilters>(
    key: K,
    value: AttendanceFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key !== "search") {
      setPage(1);
    }
  };

  useMemo(() => {
    if (debouncedSearch !== "") {
      setPage(1);
    }
  }, [debouncedSearch]);

  const resetFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.startDate !== "" ||
    filters.endDate !== "" ||
    filters.clockInStatus !== undefined;

  // Form handlers
  const handleManualEntrySubmit = async (formData: ManualEntryFormValues) => {
    const clockInDateTime = `${formData.date}T${formData.clockIn}:00.000Z`;
    const clockOutDateTime = formData.clockOut
      ? `${formData.date}T${formData.clockOut}:00.000Z`
      : undefined;

    const entry: ManualEntryDto = {
      userId: formData.userId,
      shiftId: formData.shiftId,
      date: formData.date,
      clockIn: clockInDateTime,
      clockOut: clockOutDateTime,
      notes: formData.notes,
    };

    await createManualEntryMutation.mutateAsync(entry);
  };

  const handleDelete = async () => {
    if (!selectedAttendance) return;
    await deleteMutation.mutateAsync(selectedAttendance._id);
  };

  // Export handler with full filters - rename parameter 'format' to 'exportFormat'
  const handleExport = async (
    exportFormat: "excel" | "pdf",
    exportFilters: ExportFilters
  ) => {
    setExporting(true);
    try {
      const params = {
        startDate: exportFilters.startDate || undefined,
        endDate: exportFilters.endDate || undefined,
        categoryId: exportFilters.categoryId || undefined,
        userId: exportFilters.employeeId || undefined,
        shiftId: exportFilters.shiftId || undefined,
        clockInStatus: exportFilters.clockInStatus || undefined,
        clockOutStatus: exportFilters.clockOutStatus || undefined,
        includePhotos: exportFilters.includePhotos,
        sortBy: exportFilters.sortBy,
        sortOrder: exportFilters.sortOrder,
      };

      let blob: Blob;
      let filename: string;

      if (exportFormat === "excel") {
        blob = await attendancesApi.exportExcel(params);
        filename = `Laporan_Presensi_${format(
          new Date(),
          "yyyyMMdd_HHmmss"
        )}.xlsx`;
      } else {
        blob = await attendancesApi.exportPDF(params);
        filename = `Laporan_Presensi_${format(
          new Date(),
          "yyyyMMdd_HHmmss"
        )}.pdf`;
      }

      downloadFile(blob, filename);
      toast.success(`File ${exportFormat.toUpperCase()} berhasil diunduh!`);
      closeExportDialog();
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(
        apiError.message || `Gagal export ke ${exportFormat.toUpperCase()}`
      );
    } finally {
      setExporting(false);
    }
  };

  return {
    // Data
    attendances: data?.data ?? [],
    pagination: data?.pagination,
    summary: data?.summary,
    employees: employeesData?.data ?? [],
    shifts,
    categories,
    selectedAttendance,

    // State
    page,
    setPage,
    filters,
    dialogState,
    hasActiveFilters,
    isLoading,
    exporting,
    exportDialog,

    // Loading states
    isCreating: createManualEntryMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Dialog handlers
    openDialog,
    closeDialog,
    openExportDialog,
    closeExportDialog,

    // Filter handlers
    updateFilter,
    resetFilters,

    // Form handlers
    handleManualEntrySubmit,
    handleDelete,

    // Export handler
    handleExport,
  };
}

// Helper function
function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
