// components/auth/LoginAlert.tsx

"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { alertMessages } from "@/config/login.config";
import { loginAnimations } from "@/config/login.config";

interface LoginAlertProps {
  reason: "timeout" | "unauthorized" | null;
  error: string;
}

export function LoginAlert({ reason, error }: LoginAlertProps) {
  const alertConfig = reason ? alertMessages[reason] : null;

  return (
    <>
      {/* Session Alert */}
      {alertConfig && (
        <motion.div variants={loginAnimations.formItem}>
          <Alert className={alertConfig.className}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{alertConfig.message}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Error Alert */}
      {error && (
        <motion.div
          variants={loginAnimations.formItem}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </>
  );
}
