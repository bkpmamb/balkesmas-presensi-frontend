// components/attendances/AttendancesFilters.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, Filter } from "lucide-react";
import { statusOptions } from "@/config/attendances.config";
import type { AttendanceFilters } from "@/lib/types/attendance";

interface AttendancesFiltersProps {
  filters: AttendanceFilters;
  hasActiveFilters: boolean;
  onFilterChange: <K extends keyof AttendanceFilters>(
    key: K,
    value: AttendanceFilters[K]
  ) => void;
  onReset: () => void;
}

export function AttendancesFilters({
  filters,
  hasActiveFilters,
  onFilterChange,
  onReset,
}: AttendancesFiltersProps) {
  return (
    <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:space-y-0 lg:gap-3">
      {/* Search - Full width di mobile */}
      <div className="relative w-full lg:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama karyawan..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Date Range Container */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-2 text-muted-foreground shrink-0">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium lg:hidden">Periode:</span>
        </div>

        <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:flex-row">
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange("startDate", e.target.value)}
            className="w-full sm:w-36 lg:w-40"
          />
          <div className="hidden sm:block text-muted-foreground text-xs">
            s/d
          </div>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange("endDate", e.target.value)}
            className="w-full sm:w-36 lg:w-40"
          />
        </div>
      </div>

      {/* Status & Reset Button Wrapper */}
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <Select
          value={filters.clockInStatus ?? "all"}
          onValueChange={(value) =>
            onFilterChange("clockInStatus", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="flex-1 lg:w-44">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
