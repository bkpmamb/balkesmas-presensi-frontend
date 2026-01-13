// components/leave/LeaveStatusBadge.tsx

import { Badge } from "@/components/ui/badge";
import type { LeaveRequestStatus } from "@/lib/types/leave";

interface LeaveStatusBadgeProps {
  status: LeaveRequestStatus;
}

// Fixed the syntax here: Added the opening "<" after Record
const statusConfig: Record<
  LeaveRequestStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Menunggu",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  approved: {
    label: "Disetujui",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  rejected: {
    label: "Ditolak",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export function LeaveStatusBadge({ status }: LeaveStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
