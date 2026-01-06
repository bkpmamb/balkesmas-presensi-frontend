// components/employee/AttendanceActions.tsx

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, LogOut, Clock } from "lucide-react";
import { attendanceAnimations } from "@/config/employee.config";
import type { AttendanceAction } from "@/lib/types/employee-attendance";

interface AttendanceActionsProps {
  canClockIn: boolean;
  canClockOut: boolean;
  hasSchedule: boolean;
  onStartAttendance: (action: AttendanceAction) => void;
}

export function AttendanceActions({
  canClockIn,
  canClockOut,
  hasSchedule,
  onStartAttendance,
}: AttendanceActionsProps) {
  if (!hasSchedule) {
    return null;
  }

  return (
    <motion.div variants={attendanceAnimations.item}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Aksi Presensi</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={canClockIn ? { scale: 1.02 } : {}}
              whileTap={canClockIn ? { scale: 0.98 } : {}}
            >
              <Button
                size="lg"
                className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
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
                className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-linear-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
                disabled={!canClockOut}
                onClick={() => onStartAttendance("clock-out")}
              >
                <LogOut className="h-8 w-8" />
                <span className="font-semibold">Clock Out</span>
              </Button>
            </motion.div>
          </div>

          {!canClockIn && !canClockOut && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Anda sudah menyelesaikan presensi hari ini
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}