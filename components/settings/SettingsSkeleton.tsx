// components/settings/SettingsSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

const skeletonHeights = ["h-40", "h-96", "h-96"];

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      {skeletonHeights.map((height, index) => (
        <Skeleton key={index} className={height} />
      ))}
    </div>
  );
}
