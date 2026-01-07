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
  Maximize2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TodayAttendance } from "@/lib/types/employee-attendance";
import { EmployeeHeader } from "@/components/employee";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

/**
 * Komponen Lightbox untuk Foto
 */
const PhotoPreview = ({
  src,
  label,
  time,
}: {
  src?: string;
  label: string;
  time?: string;
}) => {
  if (!src)
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg border border-dashed border-gray-200">
        <span className="text-[10px] font-bold text-gray-300">--</span>
      </div>
    );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group relative cursor-zoom-in w-full h-full overflow-hidden rounded-lg shadow-inner">
          <Image
            src={src}
            alt={label}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="text-white w-4 h-4" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-105 p-0 overflow-hidden bg-black border-none">
        <VisuallyHidden.Root>
          <DialogTitle>{label}</DialogTitle>
        </VisuallyHidden.Root>
        <div className="relative w-full h-[70vh] sm:h-[80vh]">
          <Image
            src={src}
            alt={label}
            fill
            className="object-contain"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/90 via-black/40 to-transparent text-white">
            <p className="text-base font-bold">{label}</p>
            <p className="text-sm opacity-80">{time}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function AttendanceHistoryPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["employee-attendance-history", page],
    queryFn: () => employeeAttendanceApi.getAttendanceHistory({ page, limit }),
  });

  const { data: profile } = useQuery({
    queryKey: ["employee-profile"],
    queryFn: employeeAttendanceApi.getProfile,
  });

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <EmployeeHeader profile={profile} onLogout={handleLogout} />

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
          {[
            {
              label: "Total",
              val: historyData?.summary.totalAttendances,
              bg: "bg-blue-600",
            },
            {
              label: "On Time",
              val: historyData?.summary.totalOnTime,
              bg: "bg-emerald-600",
            },
            {
              label: "Late",
              val: historyData?.summary.totalLate,
              bg: "bg-amber-600",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className={`border-none shadow-sm ${stat.bg} text-white`}
            >
              <CardContent className="p-3 text-center">
                <p className="text-[10px] opacity-80 uppercase font-bold">
                  {stat.label}
                </p>
                <p className="text-xl font-bold">{stat.val ?? 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* List Riwayat */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground animate-pulse font-medium">
              Memuat riwayat...
            </div>
          ) : historyData?.data && historyData.data.length > 0 ? (
            historyData.data.map((item: TodayAttendance) => (
              <Card
                key={item._id}
                className="border-none shadow-md overflow-hidden bg-white"
              >
                <div
                  className={`h-1.5 w-full ${
                    item.clockInStatus === "late"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                <CardContent className="p-4 sm:p-5">
                  {/* Bagian Atas: Tanggal & Status */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 items-center">
                      <div className="bg-slate-50 p-2 rounded-lg flex flex-col items-center justify-center min-w-13 border border-slate-100 shadow-sm">
                        <span className="text-[9px] uppercase text-slate-400 font-black leading-none mb-1">
                          {new Date(item.date).toLocaleDateString("id-ID", {
                            month: "short",
                          })}
                        </span>
                        <span className="text-xl font-black text-slate-700 leading-none">
                          {new Date(item.date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                          })}
                        </span>
                      </div>
                      <div>
                        <p className="font-black text-slate-800 leading-none mb-1">
                          {item.shift?.name}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                          <Clock className="h-3 w-3" />
                          {item.workMinutes
                            ? `${Math.floor(item.workMinutes / 60)}j ${
                                item.workMinutes % 60
                              }m`
                            : "--"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-tighter ${
                        item.clockInStatus === "late"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.clockInStatus === "late"
                        ? `LATE ${item.lateMinutes}m`
                        : "ON TIME"}
                    </div>
                  </div>

                  {/* GRID FOTO & JAM - Super Responsive */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                    {/* Box Masuk */}
                    <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                      <div className="relative w-14 h-14 shrink-0 shadow-sm">
                        <PhotoPreview
                          src={item.photoUrl}
                          label="Foto Masuk"
                          time={formatTime(item.clockIn)}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                          Masuk
                        </p>
                        <p className="text-sm font-mono font-black text-gray-700 leading-none">
                          {formatTime(item.clockIn)}
                        </p>
                      </div>
                    </div>

                    {/* Box Pulang */}
                    <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                      <div className="relative w-14 h-14 shrink-0 shadow-sm">
                        <PhotoPreview
                          src={item.photoOutUrl}
                          label="Foto Pulang"
                          time={
                            item.clockOut
                              ? formatTime(item.clockOut)
                              : undefined
                          }
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                          Pulang
                        </p>
                        <p className="text-sm font-mono font-black text-gray-700 leading-none">
                          {item.clockOut ? formatTime(item.clockOut) : "--:--"}
                        </p>
                      </div>
                    </div>
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

        {/* Pagination & Legend Tetap Sama */}
        {historyData && historyData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo(0, 0);
              }}
              disabled={!historyData.pagination.hasPrevPage}
              className="bg-white font-bold"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <span className="text-xs font-bold text-slate-500 uppercase">
              Hal {historyData.pagination.currentPage} /{" "}
              {historyData.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo(0, 0);
              }}
              disabled={!historyData.pagination.hasNextPage}
              className="bg-white font-bold"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
