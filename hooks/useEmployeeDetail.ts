// hooks/useEmployeeDetail.ts

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { employeesApi } from "@/src/lib/api/employees";
import { attendancesApi } from "@/src/lib/api/attendances";
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

  // Fetch employee detail
  const {
    data: employee,
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

  // Fetch employee attendances
  const { data: attendancesData, isLoading: attendancesLoading } = useQuery({
    queryKey: ["employee-attendances", employeeId],
    queryFn: () =>
      attendancesApi.getAll({
        userId: employeeId,
        limit: 10,
      }),
    enabled: !!employeeId,
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

  return {
    // Data
    employee,
    categories,
    attendances: attendancesData?.data ?? [],
    attendanceSummary: attendancesData?.summary,

    // State
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,

    // Loading states
    isLoading: employeeLoading,
    isAttendancesLoading: attendancesLoading,
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
