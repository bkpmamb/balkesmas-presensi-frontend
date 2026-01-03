// src/app/dashboard/schedules/page.tsx

"use client";

import {
  SchedulesHeader,
  SchedulesStatsCards,
  SchedulesFilters,
  SchedulesCalendarSection,
  SchedulesLegend,
  SchedulesSkeleton,
  SchedulesDialogs,
} from "@/components/schedules";
import { useSchedules } from "@/hooks/useSchedules";

export default function SchedulesPage() {
  const {
    schedules,
    employees,
    shifts,
    selectedSchedule,
    totalEmployees,
    uniqueEmployees,
    schedulesByShift,
    dialogState,
    filters,
    hasActiveFilters,
    isLoading,
    isCreating,
    isDeleting,
    openDialog,
    closeDialog,
    updateFilter,
    resetFilters,
    handleAddSchedule,
    handleDelete,
  } = useSchedules();

  if (isLoading) {
    return <SchedulesSkeleton />;
  }

  return (
    <div className="space-y-6">
      <SchedulesHeader onAddClick={() => openDialog("add")} />

      <SchedulesStatsCards
        totalSchedules={schedules.length}
        uniqueEmployees={uniqueEmployees}
        totalEmployees={totalEmployees}
        schedulesByShift={schedulesByShift}
      />

      <SchedulesFilters
        filters={filters}
        employees={employees}
        shifts={shifts}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      <SchedulesCalendarSection
        schedules={schedules}
        onDelete={(schedule) => openDialog("delete", schedule)}
      />

      <SchedulesLegend />

      <SchedulesDialogs
        dialogState={dialogState}
        selectedSchedule={selectedSchedule}
        employees={employees}
        shifts={shifts}
        isCreating={isCreating}
        isDeleting={isDeleting}
        onCloseDialog={closeDialog}
        onAdd={handleAddSchedule}
        onDelete={handleDelete}
      />
    </div>
  );
}
