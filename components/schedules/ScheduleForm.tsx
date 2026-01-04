// src/components/schedules/ScheduleForm.tsx

"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import type { Employee } from "@/lib/types/employee";
import type { Shift } from "@/lib/types/shift";

const DAYS = [
  { value: 0, label: "Minggu" },
  { value: 1, label: "Senin" },
  { value: 2, label: "Selasa" },
  { value: 3, label: "Rabu" },
  { value: 4, label: "Kamis" },
  { value: 5, label: "Jumat" },
  { value: 6, label: "Sabtu" },
];

interface ScheduleFormProps {
  employees: Employee[];
  shifts: Shift[];
  onSubmit: (data: {
    userId: string;
    shiftId: string;
    days: number[];
  }) => Promise<void>;
  isLoading: boolean;
}

export function ScheduleForm({
  employees,
  shifts,
  onSubmit,
  isLoading,
}: ScheduleFormProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("none");
  const [selectedShift, setSelectedShift] = useState("none");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  // Get selected employee's category
  const selectedEmployeeData = useMemo(() => {
    return employees.find((emp) => emp._id === selectedEmployee);
  }, [employees, selectedEmployee]);

  // Filter shifts based on selected employee's category
  const filteredShifts = useMemo(() => {
    if (!selectedEmployeeData?.category) {
      return shifts; // Return all if no employee selected
    }

    const employeeCategoryId =
      typeof selectedEmployeeData.category === "string"
        ? selectedEmployeeData.category
        : selectedEmployeeData.category._id;

    return shifts.filter((shift) => {
      const shiftCategoryId =
        typeof shift.category === "string"
          ? shift.category
          : shift.category?._id;

      return shiftCategoryId === employeeCategoryId;
    });
  }, [shifts, selectedEmployeeData]);

  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSelectAllDays = () => {
    if (selectedDays.length === 7) {
      setSelectedDays([]);
    } else {
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    }
  };

  const handleSelectWeekdays = () => {
    setSelectedDays([1, 2, 3, 4, 5]); // Monday to Friday
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedEmployee ||
      selectedEmployee === "none" ||
      !selectedShift ||
      selectedShift === "none" ||
      selectedDays.length === 0
    ) {
      alert("Pilih karyawan, shift, dan minimal 1 hari");
      return;
    }

    await onSubmit({
      userId: selectedEmployee,
      shiftId: selectedShift,
      days: selectedDays,
    });

    // Reset form
    setSelectedEmployee("none");
    setSelectedShift("none");
    setSelectedDays([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Employee Selection */}
      <div className="space-y-2">
        <Label>Karyawan</Label>
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih karyawan" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee._id} value={employee._id}>
                {employee.name} ({employee.employeeId})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Shift Selection - Filtered by category */}
      <div className="space-y-2">
        <Label>
          Shift
          {selectedEmployeeData?.category && (
            <span className="text-muted-foreground font-normal ml-2">
              (
              {typeof selectedEmployeeData.category === "string"
                ? selectedEmployeeData.category
                : selectedEmployeeData.category.name}
              )
            </span>
          )}
        </Label>
        <Select
          value={selectedShift}
          onValueChange={setSelectedShift}
          disabled={!selectedEmployee || selectedEmployee === "none"}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                !selectedEmployee || selectedEmployee === "none"
                  ? "Pilih karyawan terlebih dahulu"
                  : "Pilih shift"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" disabled>
              Pilih shift
            </SelectItem>
            {filteredShifts.length === 0 ? (
              <SelectItem value="no-shifts" disabled>
                Tidak ada shift untuk kategori ini
              </SelectItem>
            ) : (
              filteredShifts.map((shift) => (
                <SelectItem key={shift._id} value={shift._id}>
                  {shift.name} ({shift.startTime} - {shift.endTime})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {selectedEmployee &&
          selectedEmployee !== "none" &&
          filteredShifts.length === 0 && (
            <p className="text-xs text-orange-600">
              Belum ada shift yang tersedia untuk kategori{" "}
              {typeof selectedEmployeeData?.category === "string"
                ? selectedEmployeeData.category
                : selectedEmployeeData?.category?.name}
              . Silakan tambahkan shift terlebih dahulu.
            </p>
          )}
      </div>

      {/* Days Selection */}
      <div className="space-y-2">
        <Label>Hari</Label>
        <div className="flex items-center space-x-2 mb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAllDays}
          >
            {selectedDays.length === 7 ? "Batalkan Semua" : "Pilih Semua"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectWeekdays}
          >
            Senin - Jumat
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DAYS.map((day) => (
            <div key={day.value} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day.value}`}
                checked={selectedDays.includes(day.value)}
                onCheckedChange={() => handleDayToggle(day.value)}
              />
              <Label
                htmlFor={`day-${day.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {day.label}
              </Label>
            </div>
          ))}
        </div>
        {selectedDays.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {selectedDays.length} hari dipilih
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Tambah Jadwal
      </Button>
    </form>
  );
}
