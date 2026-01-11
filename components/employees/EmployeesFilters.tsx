// components/employees/EmployeesFilters.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { statusOptions } from "@/config/employees.config";
import type { EmployeeFilters, Category } from "@/lib/types/employee";

interface EmployeesFiltersProps {
  filters: EmployeeFilters;
  categories: Category[];
  hasActiveFilters: boolean;
  onFilterChange: <K extends keyof EmployeeFilters>(
    key: K,
    value: EmployeeFilters[K]
  ) => void;
  onReset: () => void;
}

export function EmployeesFilters({
  filters,
  categories,
  hasActiveFilters,
  onFilterChange,
  onReset,
}: EmployeesFiltersProps) {
  return (
    <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3">
      {/* Search Input - Mengambil ruang penuh di mobile, max-w-sm di desktop */}
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama karyawan..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Wrapper untuk Selects agar rapi saat mobile (berjejer 2 kolom atau tumpuk) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:flex md:flex-row md:gap-0 md:space-x-2 flex-1">
        <Select
          value={filters.category || "all"}
          onValueChange={(value) =>
            onFilterChange("category", value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? "all"}
          onValueChange={(value) =>
            onFilterChange("status", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-full md:w-44">
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
      </div>

      {/* Reset Button - Full width di mobile agar mudah ditekan */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onReset}
          className="w-full md:w-auto text-muted-foreground hover:text-destructive"
        >
          Reset Filter
        </Button>
      )}
    </div>
  );
}
