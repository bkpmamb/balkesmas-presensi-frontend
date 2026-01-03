// src/app/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth from localStorage
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === "admin") {
        router.push("/dashboard");
      } else if (user.role === "employee") {
        router.push("/employee");
      }
    } else {
      // Not authenticated, redirect to login
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  // Show loading while checking auth
  return (
    <div className="flex h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}