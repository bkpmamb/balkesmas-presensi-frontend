// hooks/useDashboard.ts

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { dashboardApi } from "@/src/lib/api/dashboard";
import type { ChartData } from "@/lib/types/dashboard";
import { createTimer } from "@/src/lib/utils/logger";
import { useEffect } from "react";

export function useDashboard() {
  useEffect(() => {
    const timer = createTimer("DASHBOARD_LOAD");
    timer.lap("Hook initialized");

    return () => {
      timer.stop("Dashboard hook unmounted");
    };
  }, []);

  // Fetch dashboard stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const timer = createTimer("FETCH_DASHBOARD_STATS");
      try {
        const result = await dashboardApi.getStats();
        timer.stop("Stats fetched successfully");
        return result;
      } catch (error) {
        timer.stop("Stats fetch failed");
        throw error;
      }
    },
  });

  // Fetch today's summary
  const {
    data: todaySummary,
    isLoading: todayLoading,
    error: todayError,
  } = useQuery({
    queryKey: ["today-summary"],
    queryFn: async () => {
      const timer = createTimer("FETCH_TODAY_SUMMARY");
      try {
        const result = await dashboardApi.getTodaySummary();
        timer.stop("Today summary fetched successfully");
        return result;
      } catch (error) {
        timer.stop("Today summary fetch failed");
        throw error;
      }
    },
  });

  // Fetch monthly stats for chart
  const { data: monthlyStats } = useQuery({
    queryKey: ["monthly-stats"],
    queryFn: () => dashboardApi.getMonthlyStats(),
  });

  useEffect(() => {
    if (!statsLoading && !todayLoading && stats && todaySummary) {
      console.log("[DASHBOARD_LOAD] ✅ All dashboard data loaded");
    }
  }, [statsLoading, todayLoading, stats, todaySummary]);

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
