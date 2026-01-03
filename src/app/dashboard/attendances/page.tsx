// src/app/dashboard/attendances/page.tsx

"use client";

import {
  AttendanceTable,
  AttendancesHeader,
  AttendancesStatsCards,
  AttendancesFilters,
  AttendancesPagination,
  AttendancesDialogs,
  AttendancesSkeleton,
} from "@/components/attendances";
import { useAttendances } from "@/hooks/useAttendances";

export default function AttendancesPage() {
  const {
    attendances,
    pagination,
    summary,
    employees,
    shifts,
    selectedAttendance,
    page,
    setPage,
    filters,
    dialogState,
    hasActiveFilters,
    isLoading,
    exporting,
    isCreating,
    isDeleting,
    openDialog,
    closeDialog,
    updateFilter,
    resetFilters,
    handleManualEntrySubmit,
    handleDelete,
    handleExportExcel,
    handleExportPDF,
  } = useAttendances();

  if (isLoading) {
    return <AttendancesSkeleton />;
  }

  return (
    <div className="space-y-6">
      <AttendancesHeader
        exporting={exporting}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        onManualEntry={() => openDialog("manualEntry")}
      />

      <AttendancesStatsCards summary={summary} />

      <AttendancesFilters
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      <AttendanceTable
        attendances={attendances}
        onView={(attendance) => openDialog("view", attendance)}
        onDelete={(attendance) => openDialog("delete", attendance)}
      />

      {pagination && (
        <AttendancesPagination
          pagination={pagination}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

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
    </div>
  );
}