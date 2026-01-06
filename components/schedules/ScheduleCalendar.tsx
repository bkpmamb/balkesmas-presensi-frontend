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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7 lg:gap-2 xl:gap-4">
      {schedulesByDay.map((day) => (
        <Card
          key={day.value}
          className={cn(
            "flex flex-col h-full transition-all",
            day.value === 0 && "bg-red-50/50 border-red-100"
          )}
        >
          {/* Day Header - Sticky di mobile agar saat scroll jadwal panjang tetap tahu ini hari apa */}
          <div className="p-3 border-b bg-inherit rounded-t-lg sticky top-0 z-10 lg:static">
            <div className="flex justify-between items-center lg:flex-col lg:items-start">
              <h3 className="font-bold text-sm text-gray-900">{day.label}</h3>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {day.schedules.length} Jadwal
              </span>
            </div>
          </div>

          {/* Schedules List */}
          <div className="flex-1 p-3 space-y-3 lg:space-y-2">
            {day.schedules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 lg:py-10 opacity-40">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-[10px] text-muted-foreground">Kosong</p>
              </div>
            ) : (
              day.schedules.map((schedule) => (
                <div
                  key={schedule._id}
                  className={cn(
                    getShiftColor(getShiftName(schedule)),
                    "relative group border rounded-xl p-3 lg:p-2 shadow-xs transition-all hover:shadow-md"
                  )}
                >
                  {/* Employee Info */}
                  <div className="pr-6">
                    <p className="font-bold text-xs lg:text-[11px] truncate text-gray-800">
                      {getUserName(schedule)}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      #{getUserEmployeeId(schedule)}
                    </p>
                  </div>

                  {/* Shift Info */}
                  <div className="mt-2 pt-2 border-t border-black/5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded-full bg-white/50 flex items-center justify-center">
                        <Clock className="h-2.5 w-2.5" />
                      </div>
                      <span className="font-semibold text-[10px] uppercase tracking-wider">
                        {getShiftName(schedule)}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] font-medium opacity-80">
                      {schedule.shift.startTime} - {schedule.shift.endTime}
                    </p>
                  </div>

                  {/* Delete Button - Dibuat lebih besar di mobile (Touch Friendly) */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 lg:h-6 lg:w-6 lg:opacity-0 group-hover:opacity-100 transition-all rounded-full shadow-lg lg:shadow-none"
                    onClick={() => onDelete(schedule)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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
