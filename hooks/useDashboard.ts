// hooks/useDashboard.ts

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { dashboardApi } from "@/src/lib/api/dashboard";
import type { ChartData } from "@/lib/types/dashboard";

export function useDashboard() {
  // Fetch dashboard stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.getStats,
  });

  // Fetch today's summary
  const {
    data: todaySummary,
    isLoading: todayLoading,
    error: todayError,
  } = useQuery({
    queryKey: ["today-summary"],
    queryFn: dashboardApi.getTodaySummary,
  });

  // Fetch monthly stats for chart
  const { data: monthlyStats } = useQuery({
    queryKey: ["monthly-stats"],
    queryFn: () => dashboardApi.getMonthlyStats(),
  });

  // Prepare chart data
  const chartData: ChartData[] =
    monthlyStats?.dailyBreakdown.map((day) => ({
      date: format(new Date(day.date), "d MMM", { locale: id }),
      total: day.total,
      onTime: day.onTime,
      late: day.late,
    })) ?? [];

  return {
    stats,
    todaySummary,
    chartData,
    isLoading: statsLoading || todayLoading,
    error: statsError || todayError,
  };
}
