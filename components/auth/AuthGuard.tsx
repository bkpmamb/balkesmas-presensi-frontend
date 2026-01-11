// src/components/auth/AuthGuard.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";
import { createTimer } from "@/src/lib/utils/logger";
import { Loader2 } from "lucide-react";

import { employeeAttendanceApi } from "@/src/lib/api/employee-attendance";
import { dashboardApi } from "@/src/lib/api/dashboard";
import { useQueryClient } from "@tanstack/react-query";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "employee")[];
}

export function AuthGuard({
  children,
  allowedRoles = ["admin", "employee"],
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, initialize } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      const timer = createTimer("AUTH_GUARD_INIT");

      timer.lap("Initializing auth from storage");
      initialize();

      // Warm up backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      try {
        timer.lap("Warming up backend");
        await fetch(`${apiUrl}/health`);
        timer.lap("Backend ready");
      } catch {
        timer.lap("Backend warming up in background...");
      }

      timer.stop("Auth guard init complete");
      setIsInitializing(false);
    };

    init();
  }, [initialize]);

  // ✅ Prefetch data berdasarkan role setelah authenticated
  useEffect(() => {
    if (!isAuthenticated || !user || isInitializing) return;

    const prefetchData = async () => {
      try {
        if (user.role === "employee") {
          // Prefetch employee init data
          queryClient.prefetchQuery({
            queryKey: ["employee-init"],
            queryFn: employeeAttendanceApi.getInit,
            staleTime: 30000,
          });
        } else if (user.role === "admin") {
          // Prefetch dashboard data
          queryClient.prefetchQuery({
            queryKey: ["dashboard-stats"],
            queryFn: dashboardApi.getStats,
            staleTime: 30000,
          });
          queryClient.prefetchQuery({
            queryKey: ["today-summary"],
            queryFn: dashboardApi.getTodaySummary,
            staleTime: 30000,
          });
        }
      } catch (error) {
        // Silently fail - prefetch is optional optimization
        console.warn("Prefetch failed:", error);
      }
    };

    prefetchData();
  }, [isAuthenticated, user, isInitializing, queryClient]);

  useEffect(() => {
    if (isInitializing || pathname === "/login") return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/employee");
      }
    }
  }, [isAuthenticated, user, allowedRoles, router, pathname, isInitializing]);

  // ✅ Loading state saat initializing
  if (isInitializing) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 text-sm">Mempersiapkan aplikasi...</p>
      </div>
    );
  }

  // Loading saat belum authenticated (redirect in progress)
  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
}
