// components/dashboard/DashboardSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { skeletonConfig } from "@/config/dashboardConfig";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      {skeletonConfig.map((config, index) => (
        <div key={index} className={`grid gap-4 ${config.gridClass}`}>
          {Array.from({ length: config.count }).map((_, i) => (
            <Skeleton key={i} className={config.className} />
          ))}
        </div>
      ))}

      <Skeleton className="h-96" />
    </div>
  );
}
