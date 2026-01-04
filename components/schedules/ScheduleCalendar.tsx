// components/schedules/ScheduleCalendar.tsx

"use client";

import { Schedule } from "@/lib/types/schedule";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = [
  { value: 0, label: "Minggu", short: "Min" },
  { value: 1, label: "Senin", short: "Sen" },
  { value: 2, label: "Selasa", short: "Sel" },
  { value: 3, label: "Rabu", short: "Rab" },
  { value: 4, label: "Kamis", short: "Kam" },
  { value: 5, label: "Jumat", short: "Jum" },
  { value: 6, label: "Sabtu", short: "Sab" },
];

const SHIFT_COLORS: { [key: string]: string } = {
  pagi: "bg-blue-100 text-blue-800 border-blue-200",
  siang: "bg-green-100 text-green-800 border-green-200",
  malam: "bg-purple-100 text-purple-800 border-purple-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

interface ScheduleCalendarProps {
  schedules: Schedule[];
  onDelete: (schedule: Schedule) => void;
}

// Helper function to safely get user name
const getUserName = (schedule: Schedule): string => {
  return schedule.user?.name ?? "User Tidak Ditemukan";
};

// Helper function to safely get user employeeId
const getUserEmployeeId = (schedule: Schedule): string => {
  return schedule.user?.employeeId ?? "-";
};

// Helper function to safely get shift name
const getShiftName = (schedule: Schedule): string => {
  return schedule.shift?.name ?? "Shift Tidak Ditemukan";
};

// Helper function to get shift color
const getShiftColor = (shiftName: string): string => {
  const lowerName = shiftName.toLowerCase();

  if (lowerName.includes("pagi")) return SHIFT_COLORS.pagi;
  if (lowerName.includes("siang")) return SHIFT_COLORS.siang;
  if (lowerName.includes("malam")) return SHIFT_COLORS.malam;

  return SHIFT_COLORS.default;
};

export function ScheduleCalendar({
  schedules,
  onDelete,
}: ScheduleCalendarProps) {
  // Group schedules by day
  const schedulesByDay = DAYS.map((day) => ({
    ...day,
    schedules: schedules
      .filter((s) => s.dayOfWeek === day.value)
      .sort((a, b) => a.user.name.localeCompare(b.user.name)),
  }));

  return (
    <div className="grid grid-cols-7 gap-4">
      {schedulesByDay.map((day) => (
        <Card
          key={day.value}
          className={cn("p-4", day.value === 0 && "bg-red-50 border-red-200")}
        >
          {/* Day Header */}
          <div className="mb-3 pb-2 border-b">
            <h3 className="font-semibold text-sm">{day.label}</h3>
            <p className="text-xs text-muted-foreground">
              {day.schedules.length} jadwal
            </p>
          </div>

          {/* Schedules List */}
          <div className="space-y-2">
            {day.schedules.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                Belum ada jadwal
              </p>
            ) : (
              day.schedules.map((schedule) => (
                <div
                  key={schedule._id}
                  className={`${getShiftColor(
                    getShiftName(schedule)
                  )} relative group border rounded-lg p-2 space-y-1`}
                >
                  {/* Employee Info */}
                  <div className="mb-1">
                    <p className="font-medium truncate">
                      {" "}
                      {getUserName(schedule)}
                    </p>
                    <p className="text-[10px] opacity-75">
                      {getUserEmployeeId(schedule)}
                    </p>
                  </div>

                  {/* Shift Info */}
                  <div className="flex items-center space-x-1 mb-1">
                    <Clock className="h-3 w-3" />
                    <span className="font-medium">
                      {getShiftName(schedule)}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-75">
                    {schedule.shift.startTime} - {schedule.shift.endTime}
                  </p>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(schedule)}
                  >
                    <Trash2 className="h-3 w-3 text-red-100" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
