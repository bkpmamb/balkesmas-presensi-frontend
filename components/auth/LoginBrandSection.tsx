// components/auth/LoginBrandSection.tsx

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { loginAnimations } from "@/config/login.config";

export function LoginBrandSection() {
  return (
    <motion.div
      variants={loginAnimations.leftSection}
      className="w-full lg:w-1/2 flex flex-col items-center justify-center mb-8 lg:mb-0 lg:pr-12"
    >
      {/* Logo */}
      <motion.div
        variants={loginAnimations.logo}
        className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-72 lg:h-72 mb-6"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl" />
        <Image
          src="/images/logo-pt-artasuryaperkasa.jpeg"
          alt="PT. Arta Surya Perkasa"
          fill
          className="object-contain drop-shadow-2xl relative z-10"
        />
      </motion.div>

      {/* Company Name */}
      <motion.div
        variants={loginAnimations.formItem}
        className="text-center"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          PT. Arta Surya Perkasa
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
          Sistem Manajemen Internal
        </p>
      </motion.div>

      {/* Decorative Elements - Hidden on Mobile */}
      <motion.div
        variants={loginAnimations.formItem}
        className="hidden lg:flex items-center gap-2 mt-8"
      >
        <div className="w-12 h-1 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full" />
        <div className="w-3 h-3 bg-indigo-500 rounded-full" />
        <div className="w-12 h-1 bg-linear-to-r from-indigo-500 to-blue-500 rounded-full" />
      </motion.div>
    </motion.div>
  );
}