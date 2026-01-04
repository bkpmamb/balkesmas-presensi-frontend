// hooks/useSchedules.ts

import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { schedulesApi } from "@/src/lib/api/schedules";
import { employeesApi } from "@/src/lib/api/employees";
import { shiftsApi } from "@/src/lib/api/shifts";
import type { ApiError } from "@/lib/types/api";
import type {
  Schedule,
  BulkCreateScheduleDto,
  ScheduleDialogState,
  ScheduleFilters,
  ScheduleFormData,
  ShiftByScheduleCount,
} from "@/lib/types/schedule";

const initialDialogState: ScheduleDialogState = {
  add: false,
  delete: false,
};

const initialFilters: ScheduleFilters = {
  employee: "all",
  shift: "all",
};

export function useSchedules() {
  const queryClient = useQueryClient();
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [dialogState, setDialogState] =
    useState<ScheduleDialogState>(initialDialogState);
  const [filters, setFilters] = useState<ScheduleFilters>(initialFilters);

  // Fetch schedules
  const { data: schedules = [], isLoading: schedulesLoading } = useQuery({
    queryKey: ["schedules", filters.employee, filters.shift],
    queryFn: () =>
      schedulesApi.getAll({
        userId: filters.employee !== "all" ? filters.employee : undefined,
        shiftId: filters.shift !== "all" ? filters.shift : undefined,
      }),
  });

  // Fetch employees
  const { data: employeesData } = useQuery({
    queryKey: ["employees-all"],
    queryFn: () => employeesApi.getAll({ limit: 100 }),
  });

  // Fetch shifts
  const { data: shifts = [] } = useQuery({
    queryKey: ["shifts-all"],
    queryFn: () => shiftsApi.getAllForSelect(),
  });

  // Bulk create mutation
  const bulkCreateMutation = useMutation({
    mutationFn: (data: BulkCreateScheduleDto) => schedulesApi.bulkCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      closeDialog("add");
      toast.success("Jadwal berhasil ditambahkan!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menambahkan jadwal");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => schedulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      closeDialog("delete");
      setSelectedSchedule(null);
      toast.success("Jadwal berhasil dihapus!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menghapus jadwal");
    },
  });

  // Computed values
  const employees = employeesData?.data ?? [];
  const totalEmployees = employees.length;
  const uniqueEmployees = useMemo(() => {
    const validSchedules = schedules.filter((s) => {
      if (!s.user) {
        console.warn("⚠️ Schedule tanpa user:", s);
        return false;
      }
      return true;
    });

    return new Set(validSchedules.map((s) => s.user._id)).size;
  }, [schedules]);

  const schedulesByShift: ShiftByScheduleCount[] = useMemo(
    () =>
      shifts.map((shift) => ({
        shift,
        count: schedules.filter((s) => s.shift && s.shift._id === shift._id)
          .length,
      })),
    [shifts, schedules]
  );

  // Dialog handlers
  const openDialog = (type: keyof ScheduleDialogState, schedule?: Schedule) => {
    if (schedule) setSelectedSchedule(schedule);
    setDialogState((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof ScheduleDialogState) => {
    setDialogState((prev) => ({ ...prev, [type]: false }));
    if (type === "delete") {
      setTimeout(() => setSelectedSchedule(null), 200);
    }
  };

  // Filter handlers
  const updateFilter = (key: keyof ScheduleFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters =
    filters.employee !== "all" || filters.shift !== "all";

  // Form handlers
  const handleAddSchedule = async (data: ScheduleFormData) => {
    const bulkData: BulkCreateScheduleDto = {
      userId: data.userId,
      shiftId: data.shiftId,
      days: data.days,
    };
    await bulkCreateMutation.mutateAsync(bulkData);
  };

  const handleDelete = async () => {
    if (!selectedSchedule) return;
    await deleteMutation.mutateAsync(selectedSchedule._id);
  };

  return {
    // Data
    schedules,
    employees,
    shifts,
    selectedSchedule,
    totalEmployees,
    uniqueEmployees,
    schedulesByShift,

    // State
    dialogState,
    filters,
    hasActiveFilters,
    isLoading: schedulesLoading,

    // Loading states
    isCreating: bulkCreateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Dialog handlers
    openDialog,
    closeDialog,

    // Filter handlers
    updateFilter,
    resetFilters,

    // Form handlers
    handleAddSchedule,
    handleDelete,
  };
}
