// src/app/dashboard/page.tsx

"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";

// Components
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentAttendances } from "@/components/dashboard/RecentAttendances";
import { StatsCardsGrid } from "@/components/dashboard/StatsCardsGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";

// Config & Hooks
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeloton";
import { AbsentAlert } from "@/components/dashboard/AbsenAlert";
import { useDashboard } from "@/hooks/useDashboard";
import {
  monthlyStatsCards,
  mainStatsCards,
  quickActions,
} from "@/config/dashboardConfig";

export default function DashboardPage() {
  const { stats, todaySummary, chartData, isLoading } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
        </p>
      </div>

      {/* Absent Employees Alert */}
      <AbsentAlert absentCount={todaySummary?.summary.absent ?? 0} />

      {/* Main Stats Cards */}
      <StatsCardsGrid
        cards={mainStatsCards}
        stats={stats}
        gridClassName="md:grid-cols-2 lg:grid-cols-4"
      />

      {/* Monthly Stats Cards */}
      <StatsCardsGrid
        cards={monthlyStatsCards}
        stats={stats}
        gridClassName="md:grid-cols-3"
      />

      {/* Chart and Recent Attendances */}
      <div className="grid gap-4 md:grid-cols-7">
        <AttendanceChart data={chartData} />
        <RecentAttendances attendances={todaySummary?.attendances ?? []} />
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />
    </div>
  );
}
