// components/employee/EmployeeSkeleton.tsx

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function EmployeeSkeleton() {
  const [loadingMessage, setLoadingMessage] = useState("Memuat data...");

  useEffect(() => {
    const messages = [
      "Memuat data...",
      "Menghubungkan ke server...",
      "Hampir selesai...",
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingMessage(messages[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div>
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* ✅ Loading Message dengan animasi */}
        <div className="text-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-gray-600 font-medium animate-pulse">
            {loadingMessage}
          </p>
        </div>

        {/* Schedule Card Skeleton */}
        <Skeleton className="h-40 rounded-lg" />

        {/* Attendance Status Skeleton */}
        <Skeleton className="h-48 rounded-lg" />

        {/* Actions Skeleton */}
        <Skeleton className="h-32 rounded-lg" />
      </div>
    </div>
  );
}
