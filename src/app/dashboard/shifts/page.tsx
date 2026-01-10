// src/app/dashboard/shifts/page.tsx

"use client";

import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ✅ Components yang load segera
import { ShiftsHeader, ShiftsSkeleton } from "@/components/shifts";

// ✅ Lazy load heavy components
const ShiftsStatsCards = lazy(() =>
  import("@/components/shifts").then((mod) => ({
    default: mod.ShiftsStatsCards,
  }))
);
const ShiftTable = lazy(() =>
  import("@/components/shifts").then((mod) => ({
    default: mod.ShiftTable,
  }))
);
const ShiftsPagination = lazy(() =>
  import("@/components/shifts").then((mod) => ({
    default: mod.ShiftsPagination,
  }))
);
const ShiftsPaginationInfo = lazy(() =>
  import("@/components/shifts").then((mod) => ({
    default: mod.ShiftsPaginationInfo,
  }))
);
const ShiftsDialogs = lazy(() =>
  import("@/components/shifts").then((mod) => ({
    default: mod.ShiftsDialogs,
  }))
);

import { useShifts } from "@/hooks/useShifts";

// ✅ Skeleton fallbacks
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PaginationSkeleton() {
  return (
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-48" />
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-9" />
        ))}
      </div>
    </div>
  );
}

export default function ShiftsPage() {
  const {
    shifts,
    pagination,
    categories,
    selectedShift,
    page,
    setPage,
    dialogState,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    openDialog,
    closeDialog,
    handleCreate,
    handleEdit,
    handleDelete,
  } = useShifts();

  if (isLoading) {
    return <ShiftsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* ✅ Header - load segera */}
      <ShiftsHeader onAddClick={() => openDialog("create")} />

      {/* ✅ Lazy: Stats Cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <ShiftsStatsCards shifts={shifts} pagination={pagination} />
      </Suspense>

      {/* ✅ Lazy: Table */}
      <Suspense fallback={<TableSkeleton />}>
        <ShiftTable
          shifts={shifts}
          onEdit={(shift) => openDialog("edit", shift)}
          onDelete={(shift) => openDialog("delete", shift)}
          onManageSchedule={(shift) => openDialog("schedule", shift)}
        />
      </Suspense>

      {/* ✅ Lazy: Pagination */}
      {pagination && (
        <Suspense fallback={<PaginationSkeleton />}>
          <ShiftsPagination
            pagination={pagination}
            currentPage={page}
            onPageChange={setPage}
          />
          <ShiftsPaginationInfo
            pagination={pagination}
            currentCount={shifts.length}
          />
        </Suspense>
      )}

      {/* ✅ Lazy: Dialogs - only loads when needed */}
      <Suspense fallback={null}>
        <ShiftsDialogs
          dialogState={dialogState}
          selectedShift={selectedShift}
          categories={categories}
          isCreating={isCreating}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onCloseDialog={closeDialog}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Suspense>
    </div>
  );
}
