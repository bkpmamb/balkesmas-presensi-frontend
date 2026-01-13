// hooks/useLeaveManagement.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { leaveApi } from "@/src/lib/api/leave";
import type {
  LeaveRequestFilters,
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
} from "@/lib/types/leave";

export function useLeaveManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LeaveRequestFilters>({});

  // ==========================================
  // LEAVE TYPES
  // ==========================================

  const { data: leaveTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ["leave-types"],
    queryFn: () => leaveApi.getLeaveTypes(),
    staleTime: 5 * 60 * 1000,
  });

  const createLeaveTypeMutation = useMutation({
    mutationFn: (dto: CreateLeaveTypeDto) => leaveApi.createLeaveType(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-types"] });
      toast.success("Jenis cuti/izin berhasil ditambahkan");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambahkan jenis cuti/izin");
    },
  });

  const updateLeaveTypeMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateLeaveTypeDto }) =>
      leaveApi.updateLeaveType(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-types"] });
      toast.success("Jenis cuti/izin berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui jenis cuti/izin");
    },
  });

  const deleteLeaveTypeMutation = useMutation({
    mutationFn: (id: string) => leaveApi.deleteLeaveType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-types"] });
      toast.success("Jenis cuti/izin berhasil dihapus");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus jenis cuti/izin");
    },
  });

  // ==========================================
  // LEAVE REQUESTS
  // ==========================================

  const { data: leaveRequestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["admin-leave-requests", page, filters],
    queryFn: () => leaveApi.getAllLeaveRequests(filters, page, 10),
    staleTime: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      leaveApi.approveLeaveRequest(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leave-requests"] });
      toast.success("Pengajuan berhasil disetujui");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menyetujui pengajuan");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      leaveApi.rejectLeaveRequest(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leave-requests"] });
      toast.success("Pengajuan berhasil ditolak");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menolak pengajuan");
    },
  });

  return {
    // Leave Types
    leaveTypes: leaveTypes || [],
    isLoadingTypes,
    createLeaveType: createLeaveTypeMutation.mutateAsync,
    updateLeaveType: updateLeaveTypeMutation.mutateAsync,
    deleteLeaveType: deleteLeaveTypeMutation.mutateAsync,
    isCreatingType: createLeaveTypeMutation.isPending,
    isUpdatingType: updateLeaveTypeMutation.isPending,
    isDeletingType: deleteLeaveTypeMutation.isPending,

    // Leave Requests
    leaveRequests: leaveRequestsData?.data || [],
    leaveStats: leaveRequestsData?.stats,
    pagination: leaveRequestsData?.pagination,
    isLoadingRequests,
    page,
    setPage,
    filters,
    setFilters,

    // Actions
    approveRequest: approveMutation.mutateAsync,
    rejectRequest: rejectMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
}
