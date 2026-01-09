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
import { ExportDialog } from "@/components/attendances/ExportDialog";
import { useAttendances } from "@/hooks/useAttendances";
import { format, startOfMonth } from "date-fns";

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

  // Quick export handlers (uses current month as default)
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
      <AttendancesHeader
        exporting={exporting}
        onExportDialog={() => openExportDialog()}
        onExportExcel={handleQuickExportExcel}
        onExportPDF={handleQuickExportPDF}
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

      {/* Export Dialog */}
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
    </div>
  );
}
