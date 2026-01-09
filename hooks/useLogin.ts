// hooks/useLogin.ts

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";
import { createTimer } from "@/src/lib/utils/logger";

interface LoginFormData {
  username: string;
  password: string;
}

type LoginReason = "timeout" | "unauthorized" | null;

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  useEffect(() => {
    const timer = createTimer("LOGIN_PAGE_LOAD");
    timer.lap("Login hook initialized");

    // Warm up backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    fetch(`${apiUrl}/health`)
      .then((res) => res.json())
      .then(() => timer.lap("Backend health check OK"))
      .catch(() => timer.lap("Backend warming up..."));

    return () => {
      timer.stop("Login page unmounted");
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("[HOOK_LOG] User authenticated, redirecting...");
      const path = user.role === "admin" ? "/dashboard" : "/employee";
      router.replace(path);
    }
  }, [isAuthenticated, user, router]);

  // Ambil reason dan pastikan tipenya aman
  const rawReason = searchParams.get("reason");
  const reason: LoginReason =
    rawReason === "timeout" || rawReason === "unauthorized" ? rawReason : null;

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    if (error) setError(""); // Hapus error saat user mulai mengetik ulang
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const timer = createTimer("HOOK_LOGIN_PROCESS");

    setLoading(true);
    setError("");

    try {
      timer.lap("Starting login request via store");
      await login(formData.username, formData.password);
      // Redirect akan ditangani oleh useEffect di atas saat state store berubah

      timer.lap("Login function completed");
      timer.stop("Login Success Total");
    } catch (err) {
      timer.lap("Login failed");
      timer.stop("Login Process Terminated with Error");
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        // Prioritas 1: Jika 401, langsung berikan pesan ramah (abaikan pesan teknis backend)
        if (status === 401) {
          setError("Username atau password salah, silakan coba lagi.");
        }
        // Prioritas 2: Jika ada pesan spesifik dari backend (misal: "Akun Anda dinonaktifkan")
        else if (err.response?.data?.message) {
          setError(err.response.data.message);
        }
        // Prioritas 3: Fallback untuk error server atau koneksi
        else {
          setError(
            "Gagal terhubung ke server. Silakan cek koneksi internet Anda."
          );
        }
      } else {
        setError("Terjadi kesalahan yang tidak terduga.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    reason,
    handleInputChange,
    handleSubmit,
  };
}
