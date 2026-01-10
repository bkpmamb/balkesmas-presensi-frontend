// src/app/dashboard/attendances/page.tsx

"use client";

import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format, startOfMonth } from "date-fns";

// ✅ Components yang load segera
import {
  AttendancesHeader,
  AttendancesFilters,
  AttendancesSkeleton,
} from "@/components/attendances";

// ✅ Lazy load heavy components
const AttendancesStatsCards = lazy(() =>
  import("@/components/attendances").then((mod) => ({
    default: mod.AttendancesStatsCards,
  }))
);
const AttendanceTable = lazy(() =>
  import("@/components/attendances").then((mod) => ({
    default: mod.AttendanceTable,
  }))
);
const AttendancesPagination = lazy(() =>
  import("@/components/attendances").then((mod) => ({
    default: mod.AttendancesPagination,
  }))
);
const AttendancesDialogs = lazy(() =>
  import("@/components/attendances").then((mod) => ({
    default: mod.AttendancesDialogs,
  }))
);
const ExportDialog = lazy(() =>
  import("@/components/attendances/ExportDialog").then((mod) => ({
    default: mod.ExportDialog,
  }))
);

import { useAttendances } from "@/hooks/useAttendances";

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
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-24" />
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

export default function AttendancesPage() {
  const {
    attendances,
    pagination,
    summary,
    employees,
    shifts,
    categories,
    selectedAttendance,
    page,
    setPage,
    filters,
    dialogState,
    hasActiveFilters,
    isLoading,
    exporting,
    exportDialog,
    isCreating,
    isDeleting,
    openDialog,
    closeDialog,
    openExportDialog,
    closeExportDialog,
    updateFilter,
    resetFilters,
    handleManualEntrySubmit,
    handleDelete,
    handleExport,
  } = useAttendances();

  // Quick export handlers
  const handleQuickExportExcel = () => {
    handleExport("excel", {
      startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      categoryId: "",
      employeeId: "",
      shiftId: "",
      clockInStatus: "",
      clockOutStatus: "",
      includePhotos: false,
      sortBy: "date",
      sortOrder: "desc",
    });
  };

  const handleQuickExportPDF = () => {
    handleExport("pdf", {
      startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      categoryId: "",
      employeeId: "",
      shiftId: "",
      clockInStatus: "",
      clockOutStatus: "",
      includePhotos: false,
      sortBy: "date",
      sortOrder: "desc",
    });
  };

  if (isLoading) {
    return <AttendancesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* ✅ Header - load segera */}
      <AttendancesHeader
        exporting={exporting}
        onExportDialog={() => openExportDialog()}
        onExportExcel={handleQuickExportExcel}
        onExportPDF={handleQuickExportPDF}
        onManualEntry={() => openDialog("manualEntry")}
      />

      {/* ✅ Lazy: Stats Cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <AttendancesStatsCards summary={summary} />
      </Suspense>

      {/* ✅ Filters - load segera (user interaction) */}
      <AttendancesFilters
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {/* ✅ Lazy: Table */}
      <Suspense fallback={<TableSkeleton />}>
        <AttendanceTable
          attendances={attendances}
          onView={(attendance) => openDialog("view", attendance)}
          onDelete={(attendance) => openDialog("delete", attendance)}
        />
      </Suspense>

      {/* ✅ Lazy: Pagination */}
      {pagination && (
        <Suspense fallback={<PaginationSkeleton />}>
          <AttendancesPagination
            pagination={pagination}
            currentPage={page}
            onPageChange={setPage}
          />
        </Suspense>
      )}

      {/* ✅ Lazy: Dialogs - only loads when needed */}
      <Suspense fallback={null}>
        <AttendancesDialogs
          dialogState={dialogState}
          selectedAttendance={selectedAttendance}
          employees={employees}
          shifts={shifts}
          isCreating={isCreating}
          isDeleting={isDeleting}
          onCloseDialog={closeDialog}
          onManualEntrySubmit={handleManualEntrySubmit}
          onDelete={handleDelete}
        />
      </Suspense>

      {/* ✅ Lazy: Export Dialog */}
      <Suspense fallback={null}>
        <ExportDialog
          isOpen={exportDialog.isOpen}
          format={exportDialog.format}
          categories={categories}
          employees={employees}
          shifts={shifts}
          exporting={exporting}
          onClose={closeExportDialog}
          onExport={handleExport}
        />
      </Suspense>
    </div>
  );
}
