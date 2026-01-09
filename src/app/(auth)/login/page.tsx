// src/app/(auth)/login/page.tsx

"use client";

import { Suspense, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  LoginBackground,
  LoginBrandSection,
  LoginCard,
} from "@/components/auth";
import { useLogin } from "@/hooks/useLogin";
import { loginAnimations } from "@/config/login.config";
import { createTimer } from "@/src/lib/utils/logger";

function LoginContent() {
  const timerRef = useRef(createTimer("LOGIN_PAGE_RENDER"));

  useEffect(() => {
    const timer = timerRef.current;
    timer.lap("LoginContent mounted");

    return () => {
      timer.stop("LoginContent unmounted");
    };
  }, []);
  const { formData, loading, error, reason, handleInputChange, handleSubmit } =
    useLogin();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <LoginBackground />

      <motion.div
        variants={loginAnimations.container}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-2 md:gap-8 lg:gap-12"
      >
        <LoginBrandSection />

        <LoginCard
          formData={formData}
          loading={loading}
          error={error}
          reason={reason}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </motion.div>
    </div>
  );
}

function LoginFallback() {
  useEffect(() => {
    console.log("[LOGIN_PAGE] Suspense fallback showing...");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  );
}

export default function LoginPage() {
  useEffect(() => {
    const timer = createTimer("LOGIN_PAGE_INIT");
    timer.stop("Suspense boundary ready");
  }, []);
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
