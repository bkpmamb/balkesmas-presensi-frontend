// src/app/employee/page.tsx

"use client";

import { useAuthStore } from "@/src/lib/store/authStore";

export default function EmployeeDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Selamat datang, {user?.name}! 👋
        </h1>
        <div className="bg-white rounded-lg border p-6">
          <p className="text-muted-foreground">
            Employee dashboard sedang dalam pengembangan.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Fitur yang akan tersedia:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Clock In/Out</li>
            <li>Attendance History</li>
            <li>Monthly Summary</li>
            <li>Profile Settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
