// src/app/dashboard/employees/page.tsx

"use client";

import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ✅ Components yang load segera (above the fold)
import {
  EmployeesHeader,
  EmployeesFilters,
  EmployeesSkeleton,
} from "@/components/employees";

// ✅ Lazy load heavy components
const EmployeesStatsCards = lazy(() =>
  import("@/components/employees").then((mod) => ({
    default: mod.EmployeesStatsCards,
  }))
);
const EmployeeTable = lazy(() =>
  import("@/components/employees").then((mod) => ({
    default: mod.EmployeeTable,
  }))
);
const EmployeesPagination = lazy(() =>
  import("@/components/employees").then((mod) => ({
    default: mod.EmployeesPagination,
  }))
);
const EmployeesDialogs = lazy(() =>
  import("@/components/employees").then((mod) => ({
    default: mod.EmployeesDialogs,
  }))
);

import { useEmployees } from "@/hooks/useEmployees";

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

export default function EmployeesPage() {
  const {
    employees,
    pagination,
    categories,
    selectedEmployee,
    statsCards,
    page,
    setPage,
    filters,
    dialogState,
    hasActiveFilters,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    openDialog,
    closeDialog,
    updateFilter,
    resetFilters,
    handleCreate,
    handleEdit,
    handleDelete,
    handleViewDetail,
  } = useEmployees();

  if (isLoading) {
    return <EmployeesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* ✅ Header & Filters - load segera */}
      <EmployeesHeader onAddClick={() => openDialog("create")} />

      <EmployeesFilters
        filters={filters}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {/* ✅ Lazy: Stats Cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <EmployeesStatsCards stats={statsCards} />
      </Suspense>

      {/* ✅ Lazy: Table */}
      <Suspense fallback={<TableSkeleton />}>
        <EmployeeTable
          employees={employees}
          onEdit={(employee) => openDialog("edit", employee)}
          onDelete={(employee) => openDialog("delete", employee)}
          onView={handleViewDetail}
        />
      </Suspense>

      {/* ✅ Lazy: Pagination */}
      {pagination && (
        <Suspense fallback={<PaginationSkeleton />}>
          <EmployeesPagination
            pagination={pagination}
            currentPage={page}
            onPageChange={setPage}
          />
        </Suspense>
      )}

      {/* ✅ Lazy: Dialogs - only loads when needed */}
      <Suspense fallback={null}>
        <EmployeesDialogs
          dialogState={dialogState}
          selectedEmployee={selectedEmployee}
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
