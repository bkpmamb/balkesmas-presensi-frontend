// hooks/useLogin.ts

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";
import axios, { AxiosError } from "axios";

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

  // Ambil reason dan pastikan tipenya aman
  const rawReason = searchParams.get("reason");
  const reason: LoginReason =
    rawReason === "timeout" || rawReason === "unauthorized" ? rawReason : null;

  useEffect(() => {
    if (isAuthenticated && user) {
      const path = user.role === "admin" ? "/dashboard" : "/employee";
      router.replace(path);
    }
  }, [isAuthenticated, user, router]);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    if (error) setError(""); // Hapus error saat user mulai mengetik ulang
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await login(formData.username, formData.password);
      // Redirect akan ditangani oleh useEffect di atas saat state store berubah
    } catch (err) {
      // 1. Gunakan Type Guard axios.isAxiosError untuk keamanan tipe
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;

        // 2. Ambil pesan dari backend, atau gunakan fallback jika status 401
        const errorMessage =
          axiosError.response?.data?.message ||
          (axiosError.response?.status === 401
            ? "Username atau password salah, silakan coba lagi."
            : "Terjadi kesalahan pada server. Silakan hubungi admin.");

        setError(errorMessage);
      } else {
        // Jika error bukan dari Axios (misal: error runtime JS)
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
