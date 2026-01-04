// src/app/dashboard/employees/[id]/page.tsx
"use client";
import {
  EmployeeDetailHeader,
  EmployeeInfoCard,
  EmployeeRecentAttendances,
  EmployeeDetailSkeleton,
  EmployeeDetailDialogs,
  EmployeeNotFound,
} from "@/components/detailEmployee";
import { useEmployeeDetail } from "@/hooks/useEmployeeDetail";
import { EmployeeScheduleCard } from "@/components/detailEmployee/EmployeeScheduleCard";
import { EmployeeStatsCard } from "@/components/detailEmployee/EmployeeStatsCard";
import { use } from "react";

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeDetailPage({
  params,
}: EmployeeDetailPageProps) {
  const { id } = use(params);

  const {
    employee,
    schedules,
    statistics,
    recentAttendances,
    categories,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    isLoading,
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

  // just added a web hook

  return (
    <div className="space-y-6">
      <EmployeeDetailHeader
        employee={employee}
        onBack={handleBack}
        onEdit={() => setEditDialogOpen(true)}
        onDelete={() => setDeleteDialogOpen(true)}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Kolom kiri */}
        <div className="space-y-6">
          <EmployeeInfoCard employee={employee} />
          <EmployeeScheduleCard schedules={schedules} />
        </div>

        {/* Kolom kanan - 2 kolom */}
        <div className="md:col-span-2 space-y-6">
          <EmployeeStatsCard statistics={statistics} />
          <EmployeeRecentAttendances
            isLoading={isLoading}
            attendances={recentAttendances}
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
