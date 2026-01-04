// components/employees/EmployeeAttendanceStats.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { attendanceStatsConfig } from "@/config/employee-detail.config";
import type { AttendanceSummary } from "@/lib/types/attendance";

interface EmployeeAttendanceStatsProps {
  summary: AttendanceSummary | undefined;
}

export function EmployeeAttendanceStats({
  summary,
}: EmployeeAttendanceStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {attendanceStatsConfig.map((stat) => (
        <Card key={stat.key}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.colorClass ?? ""}`}>
              {stat.getValue(summary)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.getDescription
                ? stat.getDescription(summary)
                : stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
