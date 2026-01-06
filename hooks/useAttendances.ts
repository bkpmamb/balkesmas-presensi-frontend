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
  ExportParams,
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

export function useAttendances() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AttendanceFilters>(initialFilters);
  const [dialogState, setDialogState] =
    useState<AttendanceDialogState>(initialDialogState);
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);
  const [exporting, setExporting] = useState(false);

  // ✅ Debounce search filter
  const debouncedSearch = useDebounce(filters.search, 500);

  // ✅ Memoize filters untuk query - gunakan debouncedSearch
  const queryFilters = useMemo(
    () => ({
      search: debouncedSearch,
      startDate: filters.startDate,
      endDate: filters.endDate,
      clockInStatus: filters.clockInStatus,
    }),
    [debouncedSearch, filters.startDate, filters.endDate, filters.clockInStatus]
  );

  // Fetch attendances - gunakan queryFilters bukan filters langsung
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

  // Fetch employees for manual entry
  const { data: employeesData } = useQuery({
    queryKey: ["employees-all"],
    queryFn: () => employeesApi.getAll({ limit: 100 }),
  });

  // Fetch shifts for manual entry
  const { data: shifts = [] } = useQuery({
    queryKey: ["shifts-all"],
    queryFn: () => shiftsApi.getAllForSelect(),
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

  // Filter handlers - ✅ Tidak perlu reset page untuk search karena debounce handle itu
  const updateFilter = <K extends keyof AttendanceFilters>(
    key: K,
    value: AttendanceFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Reset page hanya untuk filter non-search (karena search sudah debounced)
    if (key !== "search") {
      setPage(1);
    }
  };

  // ✅ Reset page ketika debounced search berubah
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

  // Export handlers
  const getExportParams = (): ExportParams => ({
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    clockInStatus: filters.clockInStatus,
  });

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const blob = await attendancesApi.exportExcel(getExportParams());
      downloadFile(
        blob,
        `Laporan_Presensi_${format(new Date(), "yyyyMMdd")}.xlsx`
      );
      toast.success("File Excel berhasil diunduh!");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Gagal export ke Excel");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const blob = await attendancesApi.exportPDF(getExportParams());
      downloadFile(
        blob,
        `Laporan_Presensi_${format(new Date(), "yyyyMMdd")}.pdf`
      );
      toast.success("File PDF berhasil diunduh!");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Gagal export ke PDF");
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
    selectedAttendance,

    // State
    page,
    setPage,
    filters,
    dialogState,
    hasActiveFilters,
    isLoading,
    exporting,

    // Loading states
    isCreating: createManualEntryMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Dialog handlers
    openDialog,
    closeDialog,

    // Filter handlers
    updateFilter,
    resetFilters,

    // Form handlers
    handleManualEntrySubmit,
    handleDelete,

    // Export handlers
    handleExportExcel,
    handleExportPDF,
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
