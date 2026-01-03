// hooks/useSettings.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsApi } from "@/src/lib/api/settings";
import type { ApiError } from "@/lib/types/api";
import type {
  UpdateSettingsDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  GPSFormValues,
} from "@/lib/types/settings";

export function useSettings() {
  const queryClient = useQueryClient();

  // Fetch settings
  const {
    data: settings,
    isLoading: settingsLoading,
    error: settingsError,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.getSettings,
  });

  // Fetch categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: settingsApi.getCategories,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: UpdateSettingsDto) => settingsApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Pengaturan berhasil diperbarui!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal memperbarui pengaturan");
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => settingsApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil ditambahkan!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menambahkan kategori");
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      settingsApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil diperbarui!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal memperbarui kategori");
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => settingsApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil dihapus!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menghapus kategori");
    },
  });

  // Handler functions
  const handleUpdateSettings = async (data: GPSFormValues) => {
    const updateData: UpdateSettingsDto = {
      targetLatitude: data.latitude,
      targetLongitude: data.longitude,
      radiusMeters: data.maxDistance,
    };
    await updateSettingsMutation.mutateAsync(updateData);
  };

  const handleCreateCategory = async (data: CreateCategoryDto) => {
    await createCategoryMutation.mutateAsync(data);
  };

  const handleUpdateCategory = async (id: string, data: UpdateCategoryDto) => {
    await updateCategoryMutation.mutateAsync({ id, data });
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategoryMutation.mutateAsync(id);
  };

  return {
    // Data
    settings,
    categories,

    // Loading states
    isLoading: settingsLoading || categoriesLoading,
    isSettingsUpdating: updateSettingsMutation.isPending,
    isCategoryMutating:
      createCategoryMutation.isPending ||
      updateCategoryMutation.isPending ||
      deleteCategoryMutation.isPending,

    // Errors
    error: settingsError || categoriesError,

    // Handlers
    handleUpdateSettings,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  };
}
