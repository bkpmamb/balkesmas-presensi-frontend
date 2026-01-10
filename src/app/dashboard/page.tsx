// src/app/dashboard/page.tsx

"use client";

import { lazy, Suspense } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// ✅ Components yang load segera (above the fold)
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeloton";
import { AbsentAlert } from "@/components/dashboard/AbsenAlert";
import { StatsCardsGrid } from "@/components/dashboard/StatsCardsGrid";

// ✅ Lazy load heavy components
const AttendanceChart = lazy(() =>
  import("@/components/dashboard/AttendanceChart").then((mod) => ({
    default: mod.AttendanceChart,
  }))
);
const RecentAttendances = lazy(() =>
  import("@/components/dashboard/RecentAttendances").then((mod) => ({
    default: mod.RecentAttendances,
  }))
);
const QuickActions = lazy(() =>
  import("@/components/dashboard/QuickActions").then((mod) => ({
    default: mod.QuickActions,
  }))
);

// Config & Hooks
import { useDashboard } from "@/hooks/useDashboard";
import {
  monthlyStatsCards,
  mainStatsCards,
  quickActions,
} from "@/config/dashboardConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ✅ Skeleton fallbacks untuk lazy components
function ChartSkeleton() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-75 w-full" />
      </CardContent>
    </Card>
  );
}

function RecentAttendancesSkeleton() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function QuickActionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { stats, todaySummary, chartData, isLoading } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* ✅ Page Title - loads immediately */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
        </p>
      </div>

      {/* ✅ Alert - loads immediately */}
      <AbsentAlert absentCount={todaySummary?.summary.absent ?? 0} />

      {/* ✅ Stats Cards - loads immediately (important metrics) */}
      <StatsCardsGrid
        cards={mainStatsCards}
        stats={stats}
        gridClassName="grid-cols-2 lg:grid-cols-4"
      />

      <StatsCardsGrid
        cards={monthlyStatsCards}
        stats={stats}
        gridClassName="grid-cols-2 md:grid-cols-3"
      />

      {/* ✅ Lazy loaded: Chart and Recent Attendances */}
      <div className="grid gap-4 md:grid-cols-7">
        <Suspense fallback={<ChartSkeleton />}>
          <AttendanceChart data={chartData} />
        </Suspense>

        <Suspense fallback={<RecentAttendancesSkeleton />}>
          <RecentAttendances attendances={todaySummary?.attendances ?? []} />
        </Suspense>
      </div>

      {/* ✅ Lazy loaded: Quick Actions */}
      <Suspense fallback={<QuickActionsSkeleton />}>
        <QuickActions actions={quickActions} />
      </Suspense>
    </div>
  );
}
