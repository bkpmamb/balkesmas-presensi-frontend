// src/app/employee/leave/new/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";
import { useEmployeeLeave } from "@/hooks/useEmployeeLeave";
import type { CreateLeaveRequestDto } from "@/lib/types/leave";
import { useAuthStore } from "@/src/lib/store/authStore";
import { EmployeeHeader } from "@/components/employee";
import { useQuery } from "@tanstack/react-query";
import { employeeAttendanceApi } from "@/src/lib/api/employee-attendance";

export default function NewLeaveRequestPage() {
  const router = useRouter();
  const { leaveTypes, isLoadingTypes, submitRequest, isSubmitting } =
    useEmployeeLeave();

  const handleSubmit = async (
    dto: CreateLeaveRequestDto,
    attachment?: File
  ) => {
    await submitRequest({ dto, attachment });
    router.push("/employee/leave");
  };

  const { data: profile } = useQuery({
    queryKey: ["employee-profile"],
    queryFn: employeeAttendanceApi.getProfile,
  });

  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <EmployeeHeader profile={profile} onLogout={handleLogout} />

      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/employee/leave")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ajukan Cuti/Izin</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTypes ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <LeaveRequestForm
              leaveTypes={leaveTypes}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
