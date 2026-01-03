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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Balkesmas Presensi
          </CardTitle>
          <CardDescription className="text-center">
            Admin Panel - Silakan login untuk melanjutkan
          </CardDescription>
          {typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).get("reason") ===
              "timeout" && (
              <Alert className="mb-4">
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
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Sesi Anda tidak valid. Silakan login kembali.
                </AlertDescription>
              </Alert>
            )}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
              <p className="font-semibold">Debug Info:</p>
              <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
              <p>Is Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
              <p>User: {user ? JSON.stringify(user) : "None"}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
