// components/attendances/AttendancesPagination.tsx

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { AttendancePagination } from "@/lib/types/attendance";

interface AttendancesPaginationProps {
  pagination: AttendancePagination;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function AttendancesPagination({
  pagination,
  currentPage,
  onPageChange,
}: AttendancesPaginationProps) {
  if (pagination.totalPages <= 1) return null;

  const maxVisiblePages = 5;
  const pageNumbers = Array.from(
    { length: Math.min(pagination.totalPages, maxVisiblePages) },
    (_, i) => i + 1
  );

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={
              !pagination.hasPrevPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              onClick={() => onPageChange(pageNumber)}
              isActive={currentPage === pageNumber}
              className="cursor-pointer"
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              onPageChange(Math.min(pagination.totalPages, currentPage + 1))
            }
            className={
              !pagination.hasNextPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}