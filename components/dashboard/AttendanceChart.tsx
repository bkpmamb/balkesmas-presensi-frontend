// src/components/dashboard/AttendanceChart.tsx

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface AttendanceChartProps {
  data: Array<{
    date: string;
    total: number;
    onTime: number;
    late: number;
  }>;
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Tren Kehadiran Bulanan</CardTitle>
        <CardDescription>Grafik kehadiran karyawan bulan ini</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="onTime"
              name="Tepat Waktu"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="late"
              name="Terlambat"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
