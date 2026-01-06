// src/app/employee/profile/change-password/page.tsx

"use client";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  KeyRound,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { employeeAttendanceApi } from "@/src/lib/api/employee-attendance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type {
  ApiError,
  ChangePasswordDto,
} from "@/lib/types/employee-attendance";
import { EmployeeHeader } from "@/components/employee";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";

export default function ChangePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Mutation logic
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ChangePasswordDto) =>
      employeeAttendanceApi.changePassword(data),
    onSuccess: (res) => {
      toast.success(res.message || "Password berhasil diubah");
      router.push("/employee/profile");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Gagal mengubah password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword) {
      return toast.error("Semua field wajib diisi");
    }

    if (form.newPassword.length < 6) {
      return toast.error("Password baru minimal 6 karakter");
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Konfirmasi password tidak cocok");
    }

    mutate({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });
  };

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

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <EmployeeHeader profile={profile} onLogout={handleLogout} />

      {/* Header Navigasi */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4 max-w-lg">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/employee/profile">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-semibold text-lg">Keamanan Akun</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-2">
              <ShieldCheck className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle>Ganti Password</CardTitle>
            <CardDescription>
              Pastikan password baru Anda kuat dan tidak mudah ditebak.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password Lama
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password saat ini"
                  value={form.oldPassword}
                  onChange={(e) =>
                    setForm({ ...form, oldPassword: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2 text-blue-600">
                <hr className="my-2 border-gray-100" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password Baru
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Konfirmasi Password Baru
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi password baru"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-slate-900 text-white mt-4 transition-all active:scale-95"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Simpan Password Baru"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full h-12 text-gray-500"
                asChild
                disabled={isPending}
              >
                <Link href="/employee/profile">Batal</Link>
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
          <KeyRound className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Tips Keamanan:</strong> Gunakan kombinasi huruf besar, huruf
            kecil, dan angka untuk password yang lebih aman.
          </p>
        </div>
      </main>
    </div>
  );
}
