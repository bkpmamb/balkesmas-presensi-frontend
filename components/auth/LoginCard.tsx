// components/auth/LoginCard.tsx

"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginAlert } from "./LoginAlert";
import { LoginForm } from "./LoginForm";
import { loginAnimations } from "@/config/login.config";

interface LoginCardProps {
  formData: {
    username: string;
    password: string;
  };
  loading: boolean;
  error: string;
  reason: "timeout" | "unauthorized" | null;
  onInputChange: (field: "username" | "password", value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginCard({
  formData,
  loading,
  error,
  reason,
  onInputChange,
  onSubmit,
}: LoginCardProps) {
  return (
    <motion.div
      variants={loginAnimations.rightSection}
      className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0"
    >
      <motion.div variants={loginAnimations.card}>
        <Card className="w-full border-none shadow-2xl backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-2 pb-4 sm:pb-6">
            <motion.div
              variants={loginAnimations.formItem}
              className="flex justify-center mb-2"
            >
              <div className="w-12 h-1 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full" />
            </motion.div>
            <motion.div variants={loginAnimations.formItem}>
              <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800">
                Masuk ke Akun Anda
              </CardTitle>
            </motion.div>
            {/* <motion.div variants={loginAnimations.formItem}>
              <CardDescription className="text-center text-gray-500 text-sm sm:text-base">
                Silakan masukkan kredensial Anda untuk melanjutkan
              </CardDescription>
            </motion.div> */}
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <LoginAlert reason={reason} error={error} />

            <LoginForm
              formData={formData}
              loading={loading}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
            />

            <motion.div
              variants={loginAnimations.formItem}
              className="pt-4 border-t border-gray-100"
            >
              <p className="text-center text-xs sm:text-sm text-gray-500">
                Pastikan data login Anda aman dan tidak dibagikan kepada siapa
                pun
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
