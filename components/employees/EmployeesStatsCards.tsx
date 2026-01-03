// components/employees/EmployeesStatsCards.tsx

import type { EmployeeStatCard } from "@/lib/types/employee";

interface EmployeesStatsCardsProps {
  stats: EmployeeStatCard[];
}

export function EmployeesStatsCards({ stats }: EmployeesStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.id} className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">
            {stat.title}
          </p>
          <p className="text-2xl font-bold">{stat.count}</p>
        </div>
      ))}
    </div>
  );
}
