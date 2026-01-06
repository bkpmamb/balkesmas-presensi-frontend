// src/components/layout/Header.tsx

"use client";
import { useAuthStore } from "@/src/lib/store/authStore";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </Button>
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Selamat datang, {user?.name}! 👋
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input type="search" placeholder="Cari..." className="w-64 pl-10" />
        </div> */}

        {/* Notifications */}
        {/* <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </Button> */}
      </div>
    </header>
  );
}
