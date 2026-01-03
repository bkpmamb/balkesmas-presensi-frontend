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
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama karyawan..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange("startDate", e.target.value)}
          className="w-37.5"
          placeholder="Dari tanggal"
        />
        <span className="text-sm text-muted-foreground">s/d</span>
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange("endDate", e.target.value)}
          className="w-37.5"
          placeholder="Sampai tanggal"
        />
      </div>

      <Select
        value={filters.clockInStatus ?? "all"}
        onValueChange={(value) =>
          onFilterChange("clockInStatus", value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-45">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Semua Status" />
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
        <Button variant="ghost" onClick={onReset}>
          Reset Filter
        </Button>
      )}
    </div>
  );
}
