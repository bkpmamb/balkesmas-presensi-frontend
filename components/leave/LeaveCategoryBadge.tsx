// components/leave/LeaveCategoryBadge.tsx

import { Badge } from "@/components/ui/badge";

interface LeaveCategoryBadgeProps {
  category: "cuti" | "izin";
}

export function LeaveCategoryBadge({ category }: LeaveCategoryBadgeProps) {
  const config = {
    cuti: {
      label: "Cuti",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    izin: {
      label: "Izin",
      className: "bg-purple-100 text-purple-800 border-purple-200",
    },
  };

  return (
    <Badge variant="outline" className={config[category].className}>
      {config[category].label}
    </Badge>
  );
}
