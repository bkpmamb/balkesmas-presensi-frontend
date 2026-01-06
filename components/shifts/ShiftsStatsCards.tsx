// components/shifts/ShiftsStatsCards.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { shiftStatsCards } from "@/config/shifts.config";
import type { Shift, PaginationInfo } from "@/lib/types/shift";

interface ShiftsStatsCardsProps {
  shifts: Shift[];
  pagination?: PaginationInfo;
}

export function ShiftsStatsCards({
  shifts,
  pagination,
}: ShiftsStatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
      {shiftStatsCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon
              className={`h-4 w-4 ${
                card.colorClass ?? "text-muted-foreground"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.colorClass ?? ""}`}>
              {card.getValue(shifts, pagination)}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.getDescription(shifts)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
