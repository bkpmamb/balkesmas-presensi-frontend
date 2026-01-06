// components/schedules/SchedulesFilters.tsx

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RefreshCcw } from "lucide-react";
import type { Employee } from "@/lib/types/employee";
import type { Shift } from "@/lib/types/shift";
import type { ScheduleFilters } from "@/lib/types/schedule";

interface SchedulesFiltersProps {
  filters: ScheduleFilters;
  employees: Employee[];
  shifts: Shift[];
  hasActiveFilters: boolean;
  onFilterChange: (key: keyof ScheduleFilters, value: string) => void;
  onReset: () => void;
}

export function SchedulesFilters({
  filters,
  employees,
  shifts,
  hasActiveFilters,
  onFilterChange,
  onReset,
}: SchedulesFiltersProps) {
  return (
    <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3">
      {/* Container Label & Selects */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3 flex-1">
        <div className="flex items-center space-x-2 text-muted-foreground shrink-0">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium md:hidden">Filter:</span>
        </div>

        {/* Filter Karyawan */}
        <div className="w-full md:w-64">
          <Select
            value={filters.employee}
            onValueChange={(value) => onFilterChange("employee", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter Karyawan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Karyawan</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee._id} value={employee._id}>
                  {employee.name} ({employee.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Shift */}
        <div className="w-full md:w-48">
          <Select
            value={filters.shift}
            onValueChange={(value) => onFilterChange("shift", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter Shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Shift</SelectItem>
              {shifts.map((shift) => (
                <SelectItem key={shift._id} value={shift._id}>
                  {shift.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="w-full md:w-auto h-10 md:h-9 text-muted-foreground hover:text-destructive"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          <span>Reset Filter</span>
        </Button>
      )}
    </div>
  );
}
