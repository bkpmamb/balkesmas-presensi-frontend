// src/app/dashboard/schedules/page.tsx

"use client";

import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ✅ Components yang load segera
import {
  SchedulesHeader,
  SchedulesFilters,
  SchedulesSkeleton,
} from "@/components/schedules";

// ✅ Lazy load heavy components
const SchedulesStatsCards = lazy(() =>
  import("@/components/schedules").then((mod) => ({
    default: mod.SchedulesStatsCards,
  }))
);
const SchedulesCalendarSection = lazy(() =>
  import("@/components/schedules").then((mod) => ({
    default: mod.SchedulesCalendarSection,
  }))
);
const SchedulesLegend = lazy(() =>
  import("@/components/schedules").then((mod) => ({
    default: mod.SchedulesLegend,
  }))
);
const SchedulesDialogs = lazy(() =>
  import("@/components/schedules").then((mod) => ({
    default: mod.SchedulesDialogs,
  }))
);

import { useSchedules } from "@/hooks/useSchedules";

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

function CalendarSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
        {/* Header row */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        {/* Data rows */}
        {[...Array(5)].map((_, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-8 gap-2 mb-2">
            {[...Array(8)].map((_, colIdx) => (
              <Skeleton key={colIdx} className="h-12 w-full" />
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LegendSkeleton() {
  return (
    <div className="flex gap-4 flex-wrap">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

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
      {/* ✅ Header - load segera */}
      <SchedulesHeader onAddClick={() => openDialog("add")} />

      {/* ✅ Lazy: Stats Cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <SchedulesStatsCards
          totalSchedules={schedules.length}
          uniqueEmployees={uniqueEmployees}
          totalEmployees={totalEmployees}
          schedulesByShift={schedulesByShift}
        />
      </Suspense>

      {/* ✅ Filters - load segera (user interaction) */}
      <SchedulesFilters
        filters={filters}
        employees={employees}
        shifts={shifts}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {/* ✅ Lazy: Calendar (heaviest component) */}
      <Suspense fallback={<CalendarSkeleton />}>
        <SchedulesCalendarSection
          schedules={schedules}
          onDelete={(schedule) => openDialog("delete", schedule)}
        />
      </Suspense>

      {/* ✅ Lazy: Legend */}
      <Suspense fallback={<LegendSkeleton />}>
        <SchedulesLegend />
      </Suspense>

      {/* ✅ Lazy: Dialogs - only loads when needed */}
      <Suspense fallback={null}>
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
      </Suspense>
    </div>
  );
}
