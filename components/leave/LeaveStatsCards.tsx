// components/leave/LeaveStatsCards.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import type { LeaveStats } from "@/lib/types/leave";

interface LeaveStatsCardsProps {
  stats: LeaveStats | undefined;
}

export function LeaveStatsCards({ stats }: LeaveStatsCardsProps) {
  const cards = [
    {
      title: "Total Pengajuan",
      value: stats?.total || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Menunggu",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Disetujui",
      value: stats?.approved || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Ditolak",
      value: stats?.rejected || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
