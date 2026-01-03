// components/shifts/ShiftsPaginationInfo.tsx

import type { PaginationInfo } from "@/lib/types/shift";

interface ShiftsPaginationInfoProps {
  pagination: PaginationInfo;
  currentCount: number;
}

export function ShiftsPaginationInfo({
  pagination,
  currentCount,
}: ShiftsPaginationInfoProps) {
  return (
    <div className="text-sm text-muted-foreground text-center">
      Menampilkan {currentCount} dari {pagination.totalData} shift
      {" • "}
      Halaman {pagination.currentPage} dari {pagination.totalPages}
    </div>
  );
}
