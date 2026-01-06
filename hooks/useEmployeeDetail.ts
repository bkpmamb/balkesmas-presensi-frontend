// hooks/useEmployeeDetail.ts
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { employeesApi } from "@/src/lib/api/employees";
import type { ApiError } from "@/lib/types/api";
import type { UpdateEmployeeDto } from "@/lib/types/employee";
import type { EmployeeFormValues } from "@/components/employees/EmployeeForm";

interface UseEmployeeDetailProps {
  employeeId: string;
}

export function useEmployeeDetail({ employeeId }: UseEmployeeDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch employee detail dengan data lengkap
  const {
    data: employeeDetail,
    isLoading: employeeLoading,
    error: employeeError,
  } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => employeesApi.getById(employeeId),
    enabled: !!employeeId,
  });

  // Fetch categories for edit form
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: employeesApi.getCategories,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateEmployeeDto) =>
      employeesApi.update(employeeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEditDialogOpen(false);
      toast.success("Karyawan berhasil diperbarui!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal memperbarui karyawan");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => employeesApi.delete(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Karyawan berhasil dihapus!");
      router.push("/dashboard/employees");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menghapus karyawan");
    },
  });

  // Handlers
  const handleEdit = async (formData: EmployeeFormValues) => {
    await updateMutation.mutateAsync(formData);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
  };

  const handleBack = () => {
    router.push("/dashboard/employees");
  };

  const stats = employeeDetail?.statistics.thisMonth;

  const totalLateFromList =
    employeeDetail?.recentAttendances?.reduce(
      (acc, curr) => acc + (curr.lateMinutes || 0),
      0
    ) || 0;

  return {
    // Data
    employee: employeeDetail?.employee,
    schedules: employeeDetail?.schedules || [],
    statistics: stats
      ? {
          ...stats,
          // Jika API kirim 0, gunakan hasil hitung manual dari list
          totalLateMinutes:
            stats.totalLateMinutes > 0
              ? stats.totalLateMinutes
              : totalLateFromList,
        }
      : undefined,

    recentAttendances: employeeDetail?.recentAttendances || [],

    // Categories for edit form
    categories,

    // State
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,

    // Loading states
    isLoading: employeeLoading,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Error
    error: employeeError,

    // Handlers
    handleEdit,
    handleDelete,
    handleBack,
  };
}
