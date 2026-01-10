// src/components/auth/AuthGuard.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";
import { createTimer } from "@/src/lib/utils/logger";
import { Loader2 } from "lucide-react";

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
  const { isAuthenticated, user, initialize } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      const timer = createTimer("AUTH_GUARD_INIT");

      // ✅ Initialize auth dari storage
      timer.lap("Initializing auth from storage");
      initialize();

      // ✅ Warm up backend parallel (non-blocking)
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

  useEffect(() => {
    // Skip jika masih initializing atau di login page
    if (isInitializing || pathname === "/login") return;

    // Redirect ke login jika tidak authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check role-based access
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
