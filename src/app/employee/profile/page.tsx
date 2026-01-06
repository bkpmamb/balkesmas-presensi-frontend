"use client";

import { useQuery } from "@tanstack/react-query";
import { employeeAttendanceApi } from "@/src/lib/api/employee-attendance";
import { EmployeeHeader } from "@/components/employee/EmployeeHeader";
import { EmployeeStats } from "@/components/employee/EmployeeStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ShieldCheck, ArrowLeft, Phone, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";
import type {
  TodayAttendance,
  WorkSchedule,
} from "@/lib/types/employee-attendance";

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
        <Button variant="ghost" asChild className="-ml-2 text-muted-foreground">
          <Link href="/employee">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Absen
          </Link>
        </Button>

        {/* SECTION 1: INFORMASI AKUN (Persis Dashboard Admin) */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b pb-3">
            <CardTitle className="text-sm font-bold uppercase text-gray-500 tracking-wider">
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

        {/* SECTION 2: STATISTIK (Persis Dashboard Admin) */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
            Statistik Performa
          </h2>
          <EmployeeStats stats={historyData?.summary} />
        </section>

        {/* SECTION 3: TABS JADWAL & RIWAYAT */}
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-200/50 rounded-xl mb-4">
            <TabsTrigger value="schedule" className="rounded-lg">
              Jadwal Kerja
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg">
              Riwayat Terakhir
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-3">
            {schedules?.map((s: WorkSchedule) => (
              <Card key={s._id} className="border-none shadow-sm">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                      {dayNames[s.dayOfWeek].substring(0, 3)}
                    </div>
                    <div>
                      <p className="font-bold">{dayNames[s.dayOfWeek]}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.shift?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-blue-600">
                      {s.shift?.startTime} - {s.shift?.endTime}
                    </p>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                      AKTIF
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* --- TAB RIWAYAT (HISTORY) --- */}
          <TabsContent value="history" className="space-y-3">
            {historyData?.data.map((item: TodayAttendance) => (
              <Card
                key={item._id}
                className="border-none shadow-sm overflow-hidden"
              >
                <div
                  className={`h-1 w-full ${
                    item.clockInStatus === "late"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold">
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                    <p className="text-[10px] uppercase text-muted-foreground">
                      {item.shift?.name}
                    </p>
                  </div>

                  {/* DISINI PERBAIKANNYA */}
                  <div className="text-right">
                    <p
                      className={`text-xs font-bold ${
                        item.clockInStatus === "late"
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {item.clockInStatus === "late"
                        ? `Terlambat ${item.lateMinutes}m`
                        : "Tepat Waktu"}
                    </p>
                    <p className="text-xs font-mono font-medium">
                      {/* Menggunakan toLocaleTimeString agar UTC otomatis menjadi WIB */}
                      {new Date(item.clockIn).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                      {" - "}
                      {item.clockOut
                        ? new Date(item.clockOut).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                        : "--:--"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full text-xs font-bold"
              asChild
            >
              <Link href="/employee/history">LIHAT SEMUA RIWAYAT</Link>
            </Button>
          </TabsContent>
        </Tabs>

        {/* SECTION 4: SECURITY */}
        <Card className="border-none shadow-sm bg-slate-900 text-white">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <div>
                <p className="font-bold text-sm">Keamanan Akun</p>
                {/* <p className="text-[10px] text-slate-400">
                  Terakhir ganti password: 2 bulan lalu
                </p> */}
              </div>
            </div>
            <Button size="sm" variant="secondary" className="text-xs" asChild>
              <Link href="/employee/profile/change-password">
                Ganti Password
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
