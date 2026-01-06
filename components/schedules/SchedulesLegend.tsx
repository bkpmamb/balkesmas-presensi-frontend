// components/schedules/SchedulesLegend.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { legendItems } from "@/config/schedules.config";

export function SchedulesLegend() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Keterangan Warna Shift
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {legendItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center space-x-2.5 min-w-fit transition-all hover:opacity-80"
            >
              <div
                className={`w-4 h-4 rounded-sm ${item.color} border ${item.borderColor} shadow-xs`}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
