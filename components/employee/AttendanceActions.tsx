// components/employee/AttendanceActions.tsx

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, LogOut, Clock, Info, CheckCircle } from "lucide-react";
import { attendanceAnimations } from "@/config/employee.config";
import type {
  AttendanceAction,
  TodaySchedule,
  TodayAttendance,
} from "@/lib/types/employee-attendance";

interface AttendanceActionsProps {
  canClockIn: boolean;
  canClockOut: boolean;
  hasSchedule: boolean;
  todaySchedule?: TodaySchedule | null;
  todayAttendance?: TodayAttendance | null;
  onStartAttendance: (action: AttendanceAction) => void;
}

export function AttendanceActions({
  canClockIn,
  canClockOut,
  hasSchedule,
  todaySchedule,
  todayAttendance,
  onStartAttendance,
}: AttendanceActionsProps) {
  if (!hasSchedule) {
    return null;
  }

  // Format minutes to hours and minutes
  const formatMinutesUntil = (minutes: number | null | undefined): string => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} jam ${mins} menit lagi`;
    }
    return `${mins} menit lagi`;
  };

  // Determine which message to show
  const showClockInWaitMessage =
    todaySchedule &&
    !todaySchedule.canClockInNow &&
    todaySchedule.minutesUntilClockIn &&
    !todayAttendance;

  const showCompletedMessage =
    todayAttendance?.clockIn && todayAttendance?.clockOut;

  const showWaitingClockOutMessage =
    todayAttendance?.clockIn && !todayAttendance?.clockOut && !canClockOut;

  return (
    <motion.div variants={attendanceAnimations.item}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Aksi Presensi</span>
          </div>

          {/* Info: Clock In belum tersedia (belum masuk window) */}
          {showClockInWaitMessage && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Clock In belum tersedia
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Presensi dapat dilakukan mulai pukul{" "}
                    <span className="font-semibold">
                      {todaySchedule.clockInWindowStart}
                    </span>{" "}
                    ({formatMinutesUntil(todaySchedule.minutesUntilClockIn)})
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info: Menunggu waktu clock out */}
          {showWaitingClockOutMessage && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Menunggu waktu Clock Out
                  </p>
                  <p className="text-sm text-amber-600 mt-1">
                    Clock Out dapat dilakukan setelah pukul{" "}
                    <span className="font-semibold">
                      {todayAttendance?.shift?.endTime}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={canClockIn ? { scale: 1.02 } : {}}
              whileTap={canClockIn ? { scale: 0.98 } : {}}
            >
              <Button
                size="lg"
                className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canClockIn}
                onClick={() => onStartAttendance("clock-in")}
              >
                <LogIn className="h-8 w-8" />
                <span className="font-semibold">Clock In</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={canClockOut ? { scale: 1.02 } : {}}
              whileTap={canClockOut ? { scale: 0.98 } : {}}
            >
              <Button
                size="lg"
                className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-linear-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canClockOut}
                onClick={() => onStartAttendance("clock-out")}
              >
                <LogOut className="h-8 w-8" />
                <span className="font-semibold">Clock Out</span>
              </Button>
            </motion.div>
          </div>

          {/* Presensi selesai */}
          {showCompletedMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-800">
                  Anda sudah menyelesaikan presensi hari ini
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
