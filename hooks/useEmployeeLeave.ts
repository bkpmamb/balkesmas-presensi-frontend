// hooks/useEmployeeLeave.ts

import { ApiErrorResponse } from "@/lib/types/api";
import { CreateLeaveRequestDto } from "@/lib/types/leave";
import { leaveApi } from "@/src/lib/api/leave";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export function useEmployeeLeave() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // ==========================================
  // LEAVE TYPES (for form dropdown)
  // ==========================================
  const { data: leaveTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ["employee-leave-types"],
    queryFn: () => leaveApi.getAvailableLeaveTypes(),
    staleTime: 5 * 60 * 1000,
  });

  // ==========================================
  // LEAVE BALANCE
  // ==========================================
  const { data: leaveBalance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["employee-leave-balance"],
    queryFn: () => leaveApi.getMyLeaveBalance(),
    staleTime: 60000,
  });

  // ==========================================
  // MY LEAVE REQUESTS
  // ==========================================
  const { data: leaveRequestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["employee-leave-requests", page],
    queryFn: () => leaveApi.getMyLeaveRequests(page, 10),
    staleTime: 30000,
  });

  // ==========================================
  // MUTATIONS
  // ==========================================
  const submitMutation = useMutation({
    mutationFn: ({
      dto,
      attachment,
    }: {
      dto: CreateLeaveRequestDto;
      attachment?: File;
    }) => leaveApi.submitLeaveRequest(dto, attachment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-leave-requests"] });
      queryClient.invalidateQueries({ queryKey: ["employee-leave-balance"] });
      toast.success("Pengajuan berhasil dikirim");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Gagal mengirim pengajuan";

      toast.error(message);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      leaveApi.cancelLeaveRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-leave-requests"] });
      queryClient.invalidateQueries({ queryKey: ["employee-leave-balance"] });
      toast.success("Pengajuan berhasil dibatalkan");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membatalkan pengajuan");
    },
  });

  return {
    // Leave Type
    leaveTypes: leaveTypes || [],
    isLoadingTypes,

    // Leave Balance
    leaveBalance: leaveBalance || [],
    isLoadingBalance,

    // Leave Reequests
    leaveRequests: leaveRequestsData?.data || [],
    leaveStats: leaveRequestsData?.stats,
    pagination: leaveRequestsData?.pagination,
    isLoadingRequests,
    page,
    setPage,

    // Actions
    submitRequest: submitMutation.mutateAsync,
    cancelRequest: cancelMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
}
