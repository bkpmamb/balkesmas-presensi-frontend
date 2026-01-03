// components/schedules/SchedulesLegend.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { legendItems } from "@/config/schedules.config";

export function SchedulesLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Keterangan Warna Shift</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded ${item.color} border ${item.borderColor}`}
              />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
