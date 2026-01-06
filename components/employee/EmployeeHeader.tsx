// components/employee/EmployeeHeader.tsx

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown, History } from "lucide-react";
import { attendanceAnimations } from "@/config/employee.config";
import type { EmployeeProfile } from "@/lib/types/employee-attendance";
import Link from "next/link";

interface EmployeeHeaderProps {
  profile: EmployeeProfile | undefined;
  onLogout: () => void;
}

export function EmployeeHeader({ profile, onLogout }: EmployeeHeaderProps) {
  const initials =
    profile?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "?";

  return (
    <motion.header
      variants={attendanceAnimations.item}
      className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Presensi</h1>
            <p className="text-xs text-gray-500">Sistem Kehadiran</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium">
                {profile?.name ?? "Loading..."}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{profile?.name}</span>
                <span className="text-xs font-normal text-gray-500">
                  {profile?.employeeId} • {profile?.category?.name}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <Link
                href="/employee/profile"
                className="flex items-center w-full cursor-pointer"
              >
                Profil & Statistik
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="mr-2 h-4 w-4" />
              <Link
                href="/employee/history"
                className="flex items-center w-full cursor-pointer"
              >
                Riwayat Presensi
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="mr-2 h-4 w-4" />
              <Link
                href="/employee/profile/change-password"
                className="flex items-center w-full cursor-pointer"
              >
                Ganti Password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
