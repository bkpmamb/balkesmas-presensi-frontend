// components/attendances/AttendancesStatsCards.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { attendanceStatsCards } from "@/config/attendances.config";
import type { AttendanceSummary } from "@/lib/types/attendance";

interface AttendancesStatsCardsProps {
  summary: AttendanceSummary | undefined;
}

export function AttendancesStatsCards({ summary }: AttendancesStatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {attendanceStatsCards.map((card) => (
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
              {card.getValue(summary)}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.getDescription(summary)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
