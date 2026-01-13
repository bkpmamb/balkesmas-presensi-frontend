// src/components/layout/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  ClipboardList,
  Settings,
  LogOut,
  CalendarDays,
  // X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/lib/store/authStore";
import Image from "next/image";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Karyawan",
    href: "/dashboard/employees",
    icon: Users,
  },
  {
    name: "Shift",
    href: "/dashboard/shifts",
    icon: Clock,
  },
  {
    name: "Jadwal",
    href: "/dashboard/schedules",
    icon: Calendar,
  },
  {
    name: "Presensi",
    href: "/dashboard/attendances",
    icon: ClipboardList,
  },
  {
    name: "Cuti & Izin",
    href: "/dashboard/leave",
    icon: CalendarDays,
  },
  {
    name: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-full flex-col bg-linear-to-b from-gray-900 to-gray-950 text-white">
      {/* Logo Section with Image */}
      <div className="flex h-20 items-center justify-between border-b border-gray-800 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="/images/logo-pt-artasuryaperkasa.jpeg"
              alt="PT. Arta Surya Perkasa"
              fill
              className="rounded-md object-cover"
              sizes="40px"
            />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              Aplikasi Presensi
            </h1>
            <p className="text-xs text-gray-400">PT. Arta Surya Perkasa</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {/* <div className="border-b border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600">
            <span className="text-sm font-medium">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div> */}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          // const isActive = pathname.startsWith(item.href);
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-linear-to-r from-blue-600/20 to-indigo-600/20 text-white border-l-4 border-blue-500"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white hover:translate-x-1"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  isActive
                    ? "text-blue-400"
                    : "text-gray-400 group-hover:text-blue-400"
                )}
              />
              <span
                className={cn("transition-all", isActive && "font-semibold")}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-800 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-linear-to-r hover:from-red-500/10 hover:to-red-600/10 hover:text-white hover:border-l-4 hover:border-red-500 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
