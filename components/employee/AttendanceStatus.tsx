// components/employee/AttendanceStatus.tsx

"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { attendanceAnimations, clockStatusConfig } from "@/config/employee.config";
import type { TodayAttendance } from "@/lib/types/employee-attendance";

interface AttendanceStatusProps {
  attendance: TodayAttendance | null | undefined;
}

export function AttendanceStatus({ attendance }: AttendanceStatusProps) {
  if (!attendance) {
    return null;
  }

  const clockInConfig = clockStatusConfig[attendance.clockInStatus];
  const clockOutConfig = attendance.clockOutStatus
    ? clockStatusConfig[attendance.clockOutStatus]
    : null;

  return (
    <motion.div variants={attendanceAnimations.card}>
      <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">
              Status Presensi Hari Ini
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Clock In */}
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">Masuk</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {format(new Date(attendance.clockIn), "HH:mm")}
              </p>
              <Badge className={`mt-2 ${clockInConfig.className}`}>
                {clockInConfig.label}
                {attendance.lateMinutes > 0 && ` (${attendance.lateMinutes}m)`}
              </Badge>
            </div>

            {/* Clock Out */}
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-blue-600 rotate-180" />
                </div>
                <span className="text-sm text-gray-600">Pulang</span>
              </div>
              {attendance.clockOut ? (
                <>
                  <p className="text-2xl font-bold text-gray-900">
                    {format(new Date(attendance.clockOut), "HH:mm")}
                  </p>
                  {clockOutConfig && (
                    <Badge className={`mt-2 ${clockOutConfig.className}`}>
                      {clockOutConfig.label}
                    </Badge>
                  )}
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-400">--:--</p>
                  <Badge variant="outline" className="mt-2">
                    Belum Pulang
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Work Duration */}
          {attendance.clockOut && attendance.workMinutes > 0 && (
            <div className="mt-4 bg-white/60 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Durasi Kerja:</span>
                <span className="font-semibold text-gray-900">
                  {Math.floor(attendance.workMinutes / 60)} jam{" "}
                  {attendance.workMinutes % 60} menit
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}