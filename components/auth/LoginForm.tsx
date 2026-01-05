// components/auth/LoginForm.tsx

"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAnimations } from "@/config/login.config";

interface LoginFormProps {
  formData: {
    username: string;
    password: string;
  };
  loading: boolean;
  onInputChange: (field: "username" | "password", value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
  formData,
  loading,
  onInputChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <motion.div variants={loginAnimations.formItem} className="space-y-2">
        <Label htmlFor="username" className="text-gray-700 font-medium">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="Masukkan username"
          value={formData.username}
          onChange={(e) => onInputChange("username", e.target.value)}
          required
          disabled={loading}
          className="h-11 sm:h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
        />
      </motion.div>

      <motion.div variants={loginAnimations.formItem} className="space-y-2">
        <Label htmlFor="password" className="text-gray-700 font-medium">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Masukkan password"
          value={formData.password}
          onChange={(e) => onInputChange("password", e.target.value)}
          required
          disabled={loading}
          className="h-11 sm:h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
        />
      </motion.div>

      <motion.div variants={loginAnimations.formItem}>
        <Button
          type="submit"
          className="w-full h-11 sm:h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300"
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
      </motion.div>
    </form>
  );
}
