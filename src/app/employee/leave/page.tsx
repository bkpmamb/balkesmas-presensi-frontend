// src/app/employee/leave/page.tsx

"use client";

import Link from "next/link";
import { Plus, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SimplePagination } from "@/components/ui/simple-pagination";

import { LeaveRequestCard } from "@/components/leave/LeaveRequestCard";
import { LeaveStatsCards } from "@/components/leave/LeaveStatsCards";

import { useEmployeeLeave } from "@/hooks/useEmployeeLeave";
import { EmployeeHeader } from "@/components/employee/EmployeeHeader";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { employeeAttendanceApi } from "@/src/lib/api/employee-attendance";

export default function EmployeeLeavePage() {
  const {
    leaveRequests,
    leaveStats,
    leaveBalance,
    pagination,
    isLoadingRequests,
    isLoadingBalance,
    page,
    setPage,
    cancelRequest,
    isCancelling,
  } = useEmployeeLeave();

  const { data: profile } = useQuery({
    queryKey: ["employee-profile"],
    queryFn: employeeAttendanceApi.getProfile,
  });

  const handleCancel = async (id: string) => {
    await cancelRequest({ id });
  };

  const router = useRouter();
  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      <EmployeeHeader profile={profile} onLogout={handleLogout} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cuti & Izin Saya</h1>
          <p className="text-muted-foreground">
            Kelola pengajuan cuti dan izin Anda
          </p>
        </div>
        <Button asChild>
          <Link href="/employee/leave/new">
            <Plus className="mr-2 h-4 w-4" />
            Ajukan Baru
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <LeaveStatsCards stats={leaveStats} />

      {/* Leave Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Saldo Cuti/Izin Tahun Ini</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingBalance ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {leaveBalance.map((balance) => (
                <div
                  key={balance.leaveType._id}
                  className="p-4 rounded-lg bg-muted"
                >
                  <p className="text-sm text-muted-foreground">
                    {balance.leaveType.name}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {balance.used}
                    {balance.totalAllowance && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /{balance.totalAllowance}
                      </span>
                    )}
                  </p>
                  {balance.pending > 0 && (
                    <p className="text-xs text-yellow-600 mt-1">
                      {balance.pending} menunggu
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leave Requests List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Riwayat Pengajuan</h2>

        {isLoadingRequests ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : leaveRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Belum ada pengajuan cuti/izin
              </p>
              <Button asChild className="mt-4">
                <Link href="/employee/leave/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajukan Sekarang
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <LeaveRequestCard
                key={request._id}
                request={request}
                onCancel={handleCancel}
                isCancelling={isCancelling}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <SimplePagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
