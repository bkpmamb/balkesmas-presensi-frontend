// src/components/shifts/ScheduleManager.tsx

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Shift } from "@/lib/types/shift";
import type { ApiError } from "@/lib/types/api";
import { shiftsApi } from "@/src/lib/api/shifts";
import { employeesApi } from "@/src/lib/api/employees";

interface ScheduleManagerProps {
  shift: Shift;
}

const DAYS = [
  { value: 0, label: "Minggu" },
  { value: 1, label: "Senin" },
  { value: 2, label: "Selasa" },
  { value: 3, label: "Rabu" },
  { value: 4, label: "Kamis" },
  { value: 5, label: "Jumat" },
  { value: 6, label: "Sabtu" },
];

export function ScheduleManager({ shift }: ScheduleManagerProps) {
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // Fetch schedules for this shift
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ["schedules", shift._id],
    queryFn: () => shiftsApi.getSchedulesByShift(shift._id),
  });

  // Fetch employees
  const { data: employeesData } = useQuery({
    queryKey: ["employees-all"],
    queryFn: () => employeesApi.getAll({ limit: 100 }),
  });

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: () =>
      shiftsApi.createSchedule({
        userId: selectedEmployee,
        shiftId: shift._id,
        dayOfWeek: selectedDay,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", shift._id] });
      setSelectedEmployee("");
      toast.success("Jadwal berhasil ditambahkan!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menambahkan jadwal");
    },
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: (id: string) => shiftsApi.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", shift._id] });
      toast.success("Jadwal berhasil dihapus!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menghapus jadwal");
    },
  });

  const handleAddSchedule = () => {
    if (!selectedEmployee) {
      toast.error("Pilih karyawan terlebih dahulu");
      return;
    }
    createScheduleMutation.mutate();
  };

  // Group schedules by day
  const schedulesByDay = DAYS.map((day) => ({
    ...day,
    schedules: schedules.filter((s) => s.dayOfWeek === day.value),
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Schedule Form */}
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Karyawan</label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih karyawan" />
            </SelectTrigger>
            <SelectContent>
              {employeesData?.data.map((employee) => (
                <SelectItem key={employee._id} value={employee._id}>
                  {employee.name} ({employee.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-37.5">
          <label className="text-sm font-medium mb-2 block">Hari</label>
          <Select
            value={selectedDay.toString()}
            onValueChange={(v) => setSelectedDay(Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((day) => (
                <SelectItem key={day.value} value={day.value.toString()}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAddSchedule}
          disabled={createScheduleMutation.isPending}
        >
          {createScheduleMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Tambah
        </Button>
      </div>

      {/* Schedules by Day */}
      <div className="space-y-4">
        {schedulesByDay.map((day) => (
          <div key={day.value} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{day.label}</h3>
              <Badge variant="secondary">{day.schedules.length} karyawan</Badge>
            </div>
            {day.schedules.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada karyawan dijadwalkan
              </p>
            ) : (
              <div className="space-y-2">
                {day.schedules.map((schedule) => (
                  <div
                    key={schedule._id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {schedule.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {schedule.user.employeeId}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteScheduleMutation.mutate(schedule._id)}
                      disabled={deleteScheduleMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}