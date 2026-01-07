"use client";

import { useQuery } from "@tanstack/react-query";
import { employeeAttendanceApi } from "@/src/lib/api/employee-attendance";
import { EmployeeHeader } from "@/components/employee/EmployeeHeader";
import { EmployeeStats } from "@/components/employee/EmployeeStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  ShieldCheck,
  ArrowLeft,
  Phone,
  BadgeCheck,
  Maximize2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

// Menggunakan TodayAttendance sesuai dengan file types Anda
import type {
  WorkSchedule,
  TodayAttendance,
} from "@/lib/types/employee-attendance";
import { ReactNode } from "react";

/**
 * Komponen Lightbox untuk Foto Absen
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
      <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">
        <span className="text-[14px] text-gray-300 font-bold">--</span>
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
            <Maximize2 className="text-white w-5 h-5" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-105 p-0 overflow-hidden bg-black border-none">
        {/* DialogTitle wajib ada untuk aksesibilitas, kita sembunyikan secara visual */}
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

export default function EmployeeProfilePage() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const { data: profile } = useQuery({
    queryKey: ["employee-profile"],
    queryFn: employeeAttendanceApi.getProfile,
  });

  const { data: historyData } = useQuery({
    queryKey: ["employee-attendance-history"],
    queryFn: () => employeeAttendanceApi.getAttendanceHistory({ limit: 5 }),
  });

  const { data: schedules } = useQuery({
    queryKey: ["employee-schedules"],
    queryFn: employeeAttendanceApi.getAllSchedules,
  });

  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <EmployeeHeader profile={profile} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        <Button
          variant="ghost"
          asChild
          className="-ml-2 text-muted-foreground hover:bg-transparent"
        >
          <Link href="/employee">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Absen
          </Link>
        </Button>

        {/* SECTION 1: INFORMASI AKUN */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="border-b pb-3 text-center sm:text-left">
            <CardTitle className="text-sm font-extrabold uppercase text-gray-400 tracking-widest">
              Informasi Akun
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y text-sm">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <User className="h-4 w-4" /> ID Karyawan
              </div>
              <div className="font-bold">{profile?.employeeId}</div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <User className="h-4 w-4" /> Nama Lengkap
              </div>
              <div className="font-bold text-right">{profile?.name}</div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <BadgeCheck className="h-4 w-4" /> Kategori
              </div>
              <div className="font-bold">{profile?.category?.name}</div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4" /> Telepon
              </div>
              <div className="font-bold">{profile?.phone || "-"}</div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: STATISTIK */}
        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest ml-1">
            Statistik Performa
          </h2>
          <EmployeeStats stats={historyData?.summary} />
        </section>

        {/* SECTION 3: TABS */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-200/50 rounded-xl mb-4">
            <TabsTrigger value="schedule" className="rounded-lg font-bold">
              Jadwal
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg font-bold">
              Riwayat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-3">
            {schedules?.map((s: WorkSchedule) => (
              <Card key={s._id} className="border-none shadow-sm">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 border border-slate-200 uppercase">
                      {dayNames[s.dayOfWeek].substring(0, 3)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        {dayNames[s.dayOfWeek]}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        {s.shift?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-black text-blue-600">
                      {s.shift?.startTime} - {s.shift?.endTime}
                    </p>
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-black uppercase">
                      AKTIF
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {historyData?.data.map((item: TodayAttendance) => (
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
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-50 p-2 rounded-lg text-center min-w-13 border border-slate-100 shadow-sm">
                        <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
                          {new Date(item.date).toLocaleDateString("id-ID", {
                            month: "short",
                          })}
                        </p>
                        <p className="text-xl font-black leading-none text-slate-700">
                          {new Date(item.date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 leading-none mb-1">
                          {item.shift?.name}
                        </p>
                        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase">
                          <Clock className="w-3 h-3 mr-1" />{" "}
                          {item.workMinutes
                            ? `${Math.floor(item.workMinutes / 60)}j ${
                                item.workMinutes % 60
                              }m`
                            : "--"}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`border-none uppercase text-[10px] font-black px-2.5 py-1 ${
                        item.clockInStatus === "late"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.clockInStatus === "late"
                        ? `LATE ${item.lateMinutes}M`
                        : "ON TIME"}
                    </Badge>
                  </div>

                  {/* GRID FOTO - Clickable & Responsive */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 shadow-sm">
                        <PhotoPreview
                          src={item.photoUrl}
                          label="Foto Masuk"
                          time={new Date(item.clockIn).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                          Masuk
                        </p>
                        <p className="text-base font-mono font-black text-gray-700 leading-none">
                          {new Date(item.clockIn).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 shadow-sm">
                        <PhotoPreview
                          src={item.photoOutUrl}
                          label="Foto Pulang"
                          time={
                            item.clockOut
                              ? new Date(item.clockOut).toLocaleTimeString(
                                  "id-ID",
                                  { hour: "2-digit", minute: "2-digit" }
                                )
                              : "--"
                          }
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                          Pulang
                        </p>
                        <p className="text-base font-mono font-black text-gray-700 leading-none">
                          {item.clockOut
                            ? new Date(item.clockOut).toLocaleTimeString(
                                "id-ID",
                                { hour: "2-digit", minute: "2-digit" }
                              )
                            : "--:--"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full py-6 font-black text-xs border-2 rounded-xl"
              asChild
            >
              <Link href="/employee/history">LIHAT SEMUA RIWAYAT</Link>
            </Button>
          </TabsContent>
        </Tabs>

        {/* SECURITY */}
        <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden">
          <CardContent className="p-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-amber-400/20 p-2.5 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="font-black text-sm">Keamanan Akun</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Update password berkala
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="font-bold text-xs"
              asChild
            >
              <Link href="/employee/profile/change-password">Ganti</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "outline" | "default" | "secondary" | "destructive"; // Sesuaikan dengan kebutuhan UI Anda
}
// Helper Badge (Jika tidak ada di components/ui/badge)
const Badge = ({ children, className }: BadgeProps) => (
  <span
    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${className}`}
  >
    {children}
  </span>
);
