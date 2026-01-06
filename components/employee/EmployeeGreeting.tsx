// components/employee/EmployeeGreeting.tsx

"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { attendanceAnimations } from "@/config/employee.config";

interface EmployeeGreetingProps {
  name: string | undefined;
}

export function EmployeeGreeting({ name }: EmployeeGreetingProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <motion.div variants={attendanceAnimations.item} className="text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {getGreeting()}, {name?.split(" ")[0] ?? "User"}! 👋
      </h2>
      <p className="text-gray-500 mt-1">
        {format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
      </p>
    </motion.div>
  );
}