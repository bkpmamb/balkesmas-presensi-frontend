// hooks/useEmployees.ts

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { employeesApi } from "@/src/lib/api/employees";
import type { ApiError } from "@/lib/types/api";
import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeDialogState,
  EmployeeFilters,
  EmployeeStatCard,
} from "@/lib/types/employee";
import type { EmployeeFormValues } from "@/components/employees/EmployeeForm";

const initialDialogState: EmployeeDialogState = {
  create: false,
  edit: false,
  delete: false,
};

const initialFilters: EmployeeFilters = {
  search: "",
  category: "",
  status: undefined,
};

export function useEmployees() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<EmployeeFilters>(initialFilters);
  const [dialogState, setDialogState] =
    useState<EmployeeDialogState>(initialDialogState);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Fetch employees
  const { data, isLoading } = useQuery({
    queryKey: ["employees", page, filters],
    queryFn: () =>
      employeesApi.getAll({
        page,
        limit: 10,
        search: filters.search,
        category: filters.category,
        isActive:
          filters.status === "active"
            ? true
            : filters.status === "inactive"
            ? false
            : undefined,
      }),
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: employeesApi.getCategories,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateEmployeeDto) => employeesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      closeDialog("create");
      toast.success("Karyawan berhasil ditambahkan!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menambahkan karyawan");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeDto }) =>
      employeesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      closeDialog("edit");
      setSelectedEmployee(null);
      toast.success("Karyawan berhasil diperbarui!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal memperbarui karyawan");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      closeDialog("delete");
      setSelectedEmployee(null);
      toast.success("Karyawan berhasil dihapus!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menghapus karyawan");
    },
  });

  // Computed: Stats cards
  const statsCards: EmployeeStatCard[] = useMemo(() => {
    const employees = data?.data ?? [];
    const totalCard: EmployeeStatCard = {
      id: "total",
      title: "Total Karyawan",
      count: data?.pagination.totalData ?? 0,
    };

    const categoryCards: EmployeeStatCard[] = categories.map((category) => ({
      id: category._id,
      title: category.name,
      count: employees.filter((emp) => emp.category._id === category._id)
        .length,
    }));

    return [totalCard, ...categoryCards];
  }, [data, categories]);

  // Dialog handlers
  const openDialog = (type: keyof EmployeeDialogState, employee?: Employee) => {
    if (employee) setSelectedEmployee(employee);
    setDialogState((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof EmployeeDialogState) => {
    setDialogState((prev) => ({ ...prev, [type]: false }));
    if (type !== "create") {
      setTimeout(() => setSelectedEmployee(null), 200);
    }
  };

  // Filter handlers
  const updateFilter = <K extends keyof EmployeeFilters>(
    key: K,
    value: EmployeeFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "" ||
    filters.status !== undefined;

  // Form handlers
  const handleCreate = async (formData: EmployeeFormValues) => {
    await createMutation.mutateAsync(formData as CreateEmployeeDto);
  };

  const handleEdit = async (formData: EmployeeFormValues) => {
    if (!selectedEmployee) return;

    // Pisahkan password dari data
    const { password, ...updateData } = formData;

    // Update profile dulu
    await updateMutation.mutateAsync({
      id: selectedEmployee._id,
      data: updateData,
    });

    // Reset password jika diisi
    if (password && password.length >= 6) {
      try {
        await employeesApi.resetPassword(selectedEmployee._id, password);
        toast.success("Password berhasil direset!");
      } catch (error) {
        const apiError = error as ApiError;
        toast.error(apiError.message || "Gagal mereset password");
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    await deleteMutation.mutateAsync(selectedEmployee._id);
  };

  // Navigation handler
  const handleViewDetail = (employee: Employee) => {
    router.push(`/dashboard/employees/${employee._id}`);
  };

  return {
    // Data
    employees: data?.data ?? [],
    pagination: data?.pagination,
    categories,
    selectedEmployee,
    statsCards,

    // State
    page,
    setPage,
    filters,
    dialogState,
    hasActiveFilters,
    isLoading,

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Dialog handlers
    openDialog,
    closeDialog,

    // Filter handlers
    updateFilter,
    resetFilters,

    // Form handlers
    handleCreate,
    handleEdit,
    handleDelete,
    handleViewDetail,
  };
}
