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
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 flex-1">
        <Filter className="h-4 w-4 text-muted-foreground" />

        <Select
          value={filters.employee}
          onValueChange={(value) => onFilterChange("employee", value)}
        >
          <SelectTrigger className="w-62.5">
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

        <Select
          value={filters.shift}
          onValueChange={(value) => onFilterChange("shift", value)}
        >
          <SelectTrigger className="w-50">
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

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
