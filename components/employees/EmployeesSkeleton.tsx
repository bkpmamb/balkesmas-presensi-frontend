// components/employees/EmployeesSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { skeletonConfig } from "@/config/employees.config";

export function EmployeesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 flex-1 max-w-sm" />
        <Skeleton className="h-10 w-45" />
        <Skeleton className="h-10 w-45" />
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
