// src/app/dashboard/employees/page.tsx

"use client";

import {
  EmployeeTable,
  EmployeesHeader,
  EmployeesStatsCards,
  EmployeesFilters,
  EmployeesPagination,
  EmployeesDialogs,
  EmployeesSkeleton,
} from "@/components/employees";
import { useEmployees } from "@/hooks/useEmployees";

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
      <EmployeesHeader onAddClick={() => openDialog("create")} />

      <EmployeesFilters
        filters={filters}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      <EmployeesStatsCards stats={statsCards} />

      <EmployeeTable
        employees={employees}
        onEdit={(employee) => openDialog("edit", employee)}
        onDelete={(employee) => openDialog("delete", employee)}
        onView={handleViewDetail}
      />

      {pagination && (
        <EmployeesPagination
          pagination={pagination}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

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
    </div>
  );
}
