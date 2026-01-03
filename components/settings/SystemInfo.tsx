// components/settings/SystemInfo.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info } from "lucide-react";
import type { SystemInfoItem } from "@/lib/types/settings";

interface SystemInfoProps {
  categoriesCount: number;
}

export function SystemInfo({ categoriesCount }: SystemInfoProps) {
  const infoItems: SystemInfoItem[] = [
    {
      label: "Nama Aplikasi",
      value: process.env.NEXT_PUBLIC_APP_NAME || "Balkesmas Presensi",
    },
    {
      label: "Versi",
      value: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    },
    {
      label: "Total Kategori",
      value: categoriesCount,
    },
    {
      label: "Backend API",
      value: process.env.NEXT_PUBLIC_API_URL || "-",
      isMono: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>Informasi Sistem</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {infoItems.map((item) => (
            <div key={item.label}>
              <p className="text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
              {item.isMono ? (
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded truncate">
                  {item.value}
                </p>
              ) : (
                <p className="text-lg font-semibold">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}