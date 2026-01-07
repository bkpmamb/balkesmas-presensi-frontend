// components/settings/SystemInfo.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface SystemInfoProps {
  categoriesCount: number;
}

export function SystemInfo({ categoriesCount }: SystemInfoProps) {
  const infoItems = [
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
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
          <Info className="h-5 w-5 text-blue-500" />
          <span>Informasi Sistem</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* - 1 Kolom di HP (Mobile sangat kecil)
            - 2 Kolom di Tablet kecil (sm)
            - 4 Kolom di Desktop (lg) 
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoItems.map((item) => (
            <div key={item.label} className="space-y-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {item.label}
              </p>

              {item.isMono ? (
                <div className="group relative">
                  <p className="text-xs font-mono bg-slate-50 border border-slate-200 px-2 py-1.5 rounded text-slate-600 truncate hover:whitespace-normal hover:break-all transition-all">
                    {item.value}
                  </p>
                </div>
              ) : (
                <p className="text-base md:text-lg font-semibold text-slate-900">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
