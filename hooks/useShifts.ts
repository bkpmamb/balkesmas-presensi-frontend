// hooks/useShifts.ts

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { shiftsApi } from "@/src/lib/api/shifts";
import { settingsApi } from "@/src/lib/api/settings";
import type { ApiError } from "@/lib/types/api";
import type {
  Shift,
  CreateShiftDto,
  UpdateShiftDto,
  ShiftDialogState,
} from "@/lib/types/shift";

const initialDialogState: ShiftDialogState = {
  create: false,
  edit: false,
  schedule: false,
  delete: false,
};

export function useShifts() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [dialogState, setDialogState] =
    useState<ShiftDialogState>(initialDialogState);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: settingsApi.getCategories,
  });

  // Fetch shifts with pagination
  const { data: shiftsResponse, isLoading } = useQuery({
    queryKey: ["shifts", page],
    queryFn: () => shiftsApi.getAll(page),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateShiftDto) => shiftsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      closeDialog("create");
      toast.success("Shift berhasil ditambahkan!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menambahkan shift");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShiftDto }) =>
      shiftsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      closeDialog("edit");
      setSelectedShift(null);
      toast.success("Shift berhasil diperbarui!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal memperbarui shift");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => shiftsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      closeDialog("delete");
      setSelectedShift(null);
      toast.success("Shift berhasil dihapus!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menghapus shift");
    },
  });

  // Dialog handlers
  const openDialog = (type: keyof ShiftDialogState, shift?: Shift) => {
    if (shift) setSelectedShift(shift);
    setDialogState((prev) => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: keyof ShiftDialogState) => {
    setDialogState((prev) => ({ ...prev, [type]: false }));
    if (type !== "create") {
      // Delay clearing selected shift to avoid UI flash
      setTimeout(() => setSelectedShift(null), 200);
    }
  };

  // Form handlers
  const handleCreate = async (data: CreateShiftDto) => {
    await createMutation.mutateAsync(data);
  };

  const handleEdit = async (data: UpdateShiftDto) => {
    if (!selectedShift) return;
    await updateMutation.mutateAsync({ id: selectedShift._id, data });
  };

  const handleDelete = async () => {
    if (!selectedShift) return;
    await deleteMutation.mutateAsync(selectedShift._id);
  };

  return {
    // Data
    shifts: shiftsResponse?.data ?? [],
    pagination: shiftsResponse?.pagination,
    categories,
    selectedShift,

    // State
    page,
    setPage,
    dialogState,
    isLoading,

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Dialog handlers
    openDialog,
    closeDialog,

    // Form handlers
    handleCreate,
    handleEdit,
    handleDelete,
  };
}
