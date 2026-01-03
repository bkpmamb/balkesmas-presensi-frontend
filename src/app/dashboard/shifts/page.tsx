// src/app/dashboard/shifts/page.tsx

"use client";

import {
  ShiftTable,
  ShiftsStatsCards,
  ShiftsPagination,
  ShiftsPaginationInfo,
  ShiftsHeader,
  ShiftsDialogs,
  ShiftsSkeleton,
} from "@/components/shifts";
import { useShifts } from "@/hooks/useShifts";

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
      <ShiftsHeader onAddClick={() => openDialog("create")} />

      <ShiftsStatsCards shifts={shifts} pagination={pagination} />

      <ShiftTable
        shifts={shifts}
        onEdit={(shift) => openDialog("edit", shift)}
        onDelete={(shift) => openDialog("delete", shift)}
        onManageSchedule={(shift) => openDialog("schedule", shift)}
      />

      {pagination && (
        <>
          <ShiftsPagination
            pagination={pagination}
            currentPage={page}
            onPageChange={setPage}
          />
          <ShiftsPaginationInfo
            pagination={pagination}
            currentCount={shifts.length}
          />
        </>
      )}

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
    </div>
  );
}
