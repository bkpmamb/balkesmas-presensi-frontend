// hooks/useLogin.ts

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";
import type { ApiError } from "@/lib/types/api";

interface LoginFormData {
  username: string;
  password: string;
}

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

  // Get reason from URL params
  const reason = searchParams.get("reason") as
    | "timeout"
    | "unauthorized"
    | null;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/employee");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.username, formData.password);

      const currentUser = useAuthStore.getState().user;

      if (currentUser?.role === "admin") {
        router.push("/dashboard");
      } else if (currentUser?.role === "employee") {
        router.push("/employee");
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.message || "Login gagal. Periksa username dan password Anda."
      );
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
