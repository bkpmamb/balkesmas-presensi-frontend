// src/app/employee/layout.tsx

"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { createTimer } from "@/src/lib/utils/logger";

function BackendWarmer({ children }: { children: React.ReactNode }) {
  const [isWarming, setIsWarming] = useState(true);

  useEffect(() => {
    const warmUp = async () => {
      const timer = createTimer("EMPLOYEE_LAYOUT_WARMUP");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

      try {
        await fetch(`${apiUrl}/health`);
        timer.lap("Backend warmed up");
      } catch {
        timer.lap("Backend warming up in background...");
      }

      timer.stop("Warmup complete");
      setIsWarming(false);
    };

    warmUp();
  }, []);

  if (isWarming) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Mempersiapkan aplikasi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BackendWarmer>
      <AuthGuard allowedRoles={["employee"]}>{children}</AuthGuard>
    </BackendWarmer>
  );
}
