// src/components/auth/AuthGuard.tsx

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "employee")[];
}

export function AuthGuard({ children, allowedRoles = ["admin", "employee"] }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth from localStorage
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/login") return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check role-based access
    if (user && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      if (user.role === "admin") {
        router.push("/");
      } else {
        router.push("/employee");
      }
    }
  }, [isAuthenticated, user, allowedRoles, router, pathname]);

  // Show loading while checking auth
  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
}