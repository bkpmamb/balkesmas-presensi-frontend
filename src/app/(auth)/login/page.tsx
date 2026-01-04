// src/app/(auth)/login/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/src/lib/store/authStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ApiError } from "@/lib/types/api";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    console.log("🔐 Auth State Changed:", { isAuthenticated, user });

    if (isAuthenticated && user) {
      console.log("✅ User authenticated:", user);
      console.log("👤 User role:", user.role);

      if (user.role === "admin") {
        console.log("→ Redirecting admin to /dashboard");
        router.push("/dashboard");
      } else {
        console.log("→ Redirecting employee to /employee");
        router.push("/employee");
      }
    } else if (isAuthenticated && !user) {
      console.error("⚠️ Authenticated but no user data!");
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.username, formData.password);

      // ✅ Get updated user from store
      const currentUser = useAuthStore.getState().user;

      // ✅ Redirect based on role
      if (currentUser?.role === "admin") {
        router.push("/");
      } else if (currentUser?.role === "employee") {
        router.push("/employee");
      }
    } catch (error) {
      const apiError = error as ApiError; // ✅ Type assertion
      console.error("❌ Login error:", apiError);
      setError(
        apiError.message || "Login gagal. Periksa username dan password Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
      {/* Left side - Brand/Image Section */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center justify-center mb-8 md:mb-0 md:pr-8">
        <div className="w-64 h-64 md:w-80 md:h-80 relative mb-6">
          <Image
            src="/images/logo-pt-artasuryaperkasa.jpeg"
            alt="PT. Arta Surya Perkasa"
            fill
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            PT. Arta Surya Perkasa
          </h1>
          <p className="text-gray-600 text-lg">Sistem Manajemen Internal</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 max-w-md">
        <Card className="w-full border-none shadow-2xl">
          <CardHeader className="space-y-2 pb-6">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-1 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Masuk ke Akun Anda
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Silakan masukkan kredensial Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Session timeout/unauthorized alerts */}
            {typeof window !== "undefined" &&
              new URLSearchParams(window.location.search).get("reason") ===
                "timeout" && (
                <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Sesi Anda telah berakhir karena tidak aktif. Silakan login
                    kembali.
                  </AlertDescription>
                </Alert>
              )}
            {typeof window !== "undefined" &&
              new URLSearchParams(window.location.search).get("reason") ===
                "unauthorized" && (
                <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Sesi Anda tidak valid. Silakan login kembali.
                  </AlertDescription>
                </Alert>
              )}

            {/* Error alert */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  disabled={loading}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={loading}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500">
                Pastikan data login Anda aman dan tidak dibagikan kepada siapa
                pun
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
