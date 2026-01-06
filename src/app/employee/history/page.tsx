"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeAttendanceApi } from "@/src/lib/api/employee-attendance";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TodayAttendance } from "@/lib/types/employee-attendance";
import { EmployeeHeader } from "@/components/employee";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";

export default function AttendanceHistoryPage() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["employee-attendance-history", page],
    queryFn: () => employeeAttendanceApi.getAttendanceHistory({ page, limit }),
  });

  // Helper format waktu yang aman untuk zona waktu
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const { data: profile } = useQuery({
    queryKey: ["employee-profile"],
    queryFn: employeeAttendanceApi.getProfile,
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <EmployeeHeader profile={profile} onLogout={handleLogout} />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4 max-w-2xl">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/employee/profile">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-semibold text-lg text-slate-900">
            Riwayat Presensi
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Ringkasan Singkat */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-none shadow-sm bg-blue-600 text-white">
            <CardContent className="p-3 text-center">
              <p className="text-[10px] opacity-80 uppercase font-bold">
                Total
              </p>
              <p className="text-xl font-bold">
                {historyData?.summary.totalAttendances ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-emerald-600 text-white">
            <CardContent className="p-3 text-center">
              <p className="text-[10px] opacity-80 uppercase font-bold">
                On Time
              </p>
              <p className="text-xl font-bold">
                {historyData?.summary.totalOnTime ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-amber-600 text-white">
            <CardContent className="p-3 text-center">
              <p className="text-[10px] opacity-80 uppercase font-bold">Late</p>
              <p className="text-xl font-bold">
                {historyData?.summary.totalLate ?? 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* List Riwayat */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground animate-pulse">
              Memuat riwayat...
            </div>
          ) : historyData?.data && historyData.data.length > 0 ? (
            historyData.data.map((item: TodayAttendance) => (
              <Card
                key={item._id}
                className="border-none shadow-sm overflow-hidden bg-white"
              >
                <div
                  className={`h-1 w-full ${
                    item.clockInStatus === "late"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="bg-slate-50 p-2 rounded-lg flex flex-col items-center justify-center min-w-12.5">
                      <span className="text-[10px] uppercase text-slate-400 font-bold leading-none">
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-lg font-black text-slate-700 leading-tight">
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                        })}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">
                        {item.shift?.name}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {item.workMinutes
                          ? `${Math.floor(item.workMinutes / 60)}j ${
                              item.workMinutes % 60
                            }m`
                          : "--"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-[11px] font-black uppercase mb-1 ${
                        item.clockInStatus === "late"
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {item.clockInStatus === "late"
                        ? `LATE (${item.lateMinutes}m)`
                        : "ON TIME"}
                    </p>
                    <p className="text-sm font-mono font-bold text-slate-700 leading-none">
                      {formatTime(item.clockIn)} - {formatTime(item.clockOut)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <CalendarDays className="h-12 w-12 mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm font-medium">
                Belum ada riwayat presensi
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {historyData && historyData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!historyData.pagination.hasPrevPage}
              className="bg-white"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>

            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Hal {historyData.pagination.currentPage} /{" "}
              {historyData.pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!historyData.pagination.hasNextPage}
              className="bg-white"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Info Legend */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 mt-4">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-[11px] text-amber-800 leading-relaxed italic">
            Menampilkan maksimal 10 data per halaman. Gunakan navigasi di atas
            untuk melihat data sebelumnya.
          </p>
        </div>
      </main>
    </div>
  );
}
