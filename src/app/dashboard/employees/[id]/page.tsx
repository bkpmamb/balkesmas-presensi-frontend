// src/app/dashboard/employees/[id]/page.tsx

"use client";

import { use } from "react";
import {
  EmployeeDetailHeader,
  EmployeeInfoCard,
  EmployeeAttendanceStats,
  EmployeeRecentAttendances,
  EmployeeDetailSkeleton,
  EmployeeDetailDialogs,
  EmployeeNotFound,
} from "@/components/detailEmployee";
import { useEmployeeDetail } from "@/hooks/useEmployeeDetail";

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const { id } = use(params);
  
  const {
    employee,
    categories,
    attendances,
    attendanceSummary,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    isLoading,
    isAttendancesLoading,
    isUpdating,
    isDeleting,
    error,
    handleEdit,
    handleDelete,
    handleBack,
  } = useEmployeeDetail({ employeeId: id });

  if (isLoading) {
    return <EmployeeDetailSkeleton />;
  }

  if (error || !employee) {
    return <EmployeeNotFound />;
  }

  return (
    <div className="space-y-6">
      <EmployeeDetailHeader
        employee={employee}
        onBack={handleBack}
        onEdit={() => setEditDialogOpen(true)}
        onDelete={() => setDeleteDialogOpen(true)}
      />

      <EmployeeAttendanceStats summary={attendanceSummary} />

      <div className="grid gap-6 md:grid-cols-3">
        <EmployeeInfoCard employee={employee} />

        <div className="md:col-span-2">
          <EmployeeRecentAttendances
            attendances={attendances}
            isLoading={isAttendancesLoading}
          />
        </div>
      </div>

      <EmployeeDetailDialogs
        employee={employee}
        categories={categories}
        editDialogOpen={editDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        onEditDialogChange={setEditDialogOpen}
        onDeleteDialogChange={setDeleteDialogOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
