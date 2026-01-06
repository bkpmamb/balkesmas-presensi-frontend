// components/schedules/SchedulesCalendarSection.tsx

import { ScheduleCalendar } from "@/components/schedules/ScheduleCalendar";
import type { Schedule } from "@/lib/types/schedule";
import { Info } from "lucide-react";

interface SchedulesCalendarSectionProps {
  schedules: Schedule[];
  onDelete: (schedule: Schedule) => void;
}

export function SchedulesCalendarSection({
  schedules,
  onDelete,
}: SchedulesCalendarSectionProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Header Section - Responsive Padding & Layout */}
      <div className="p-4 border-b md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900 md:text-xl">
            Jadwal Mingguan
          </h2>
          <p className="text-sm text-muted-foreground">
            {schedules.length} jadwal ditemukan untuk periode ini
          </p>
        </div>

        {/* Info Helper untuk Mobile */}
        <div className="flex items-center gap-2 text-[10px] md:text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit lg:hidden">
          <Info className="h-3 w-3" />
          <span>Geser horizontal untuk melihat hari</span>
        </div>
      </div>

      {/* Calendar Wrapper - Solusi Utama Responsivitas */}
      <div className="relative">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-200">
          {/* Menerapkan min-width pada kalender agar di HP tidak 'mencekik' kolom. 
            800px adalah angka aman agar 7 hari tetap proporsional.
          */}
          <div className="min-w-200 lg:min-w-full p-4 md:p-6">
            <ScheduleCalendar schedules={schedules} onDelete={onDelete} />
          </div>
        </div>

        {/* Gradient Shadow (Optional) - Memberi petunjuk visual bahwa konten bisa di-scroll */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white/50 to-transparent pointer-events-none lg:hidden" />
      </div>
    </div>
  );
}
