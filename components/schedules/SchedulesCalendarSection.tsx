// components/schedules/SchedulesCalendarSection.tsx

import { ScheduleCalendar } from "@/components/schedules/ScheduleCalendar";
import type { Schedule } from "@/lib/types/schedule";

interface SchedulesCalendarSectionProps {
  schedules: Schedule[];
  onDelete: (schedule: Schedule) => void;
}

export function SchedulesCalendarSection({
  schedules,
  onDelete,
}: SchedulesCalendarSectionProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Jadwal Mingguan</h2>
        <p className="text-sm text-muted-foreground">
          {schedules.length} jadwal ditampilkan
        </p>
      </div>
      <ScheduleCalendar schedules={schedules} onDelete={onDelete} />
    </div>
  );
}
