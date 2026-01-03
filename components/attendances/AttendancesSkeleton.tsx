// components/attendances/AttendancesSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { skeletonConfig } from "@/config/attendances.config";

export function AttendancesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: skeletonConfig.headerButtons }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: skeletonConfig.statsCount }).map((_, i) => (
          <Skeleton key={i} className={skeletonConfig.statsHeight} />
        ))}
      </div>

      <Skeleton className={skeletonConfig.tableHeight} />
    </div>
  );
}
