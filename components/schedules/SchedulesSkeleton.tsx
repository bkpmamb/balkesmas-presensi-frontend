// components/schedules/SchedulesSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { skeletonConfig } from "@/config/schedules.config";

export function SchedulesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: skeletonConfig.statsCount }).map((_, i) => (
          <Skeleton key={i} className={skeletonConfig.statsHeight} />
        ))}
      </div>

      <Skeleton className={skeletonConfig.calendarHeight} />
    </div>
  );
}
