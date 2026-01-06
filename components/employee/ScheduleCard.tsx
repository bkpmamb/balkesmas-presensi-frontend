// components/employee/ScheduleCard.tsx

"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, AlertCircle } from "lucide-react";
import { attendanceAnimations, DAY_NAMES } from "@/config/employee.config";
import type { TodaySchedule } from "@/lib/types/employee-attendance";

interface ScheduleCardProps {
  schedule: TodaySchedule | null | undefined;
}

export function ScheduleCard({ schedule }: ScheduleCardProps) {
  const today = new Date().getDay();

  if (!schedule) {
    return (
      <motion.div variants={attendanceAnimations.card}>
        <Card className="bg-linear-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-700">Tidak Ada Jadwal</h3>
            <p className="text-sm text-gray-500 mt-1">
              Anda tidak memiliki jadwal shift hari ini ({DAY_NAMES[today]})
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={attendanceAnimations.card}>
      <Card className="bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">
                Jadwal Hari Ini
              </span>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              {DAY_NAMES[today]}
            </Badge>
          </div>

          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-semibold text-lg text-gray-900">
              {schedule.shift.name}
            </h4>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {schedule.shift.startTime} - {schedule.shift.endTime}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                Toleransi {schedule.shift.toleranceMinutes} menit
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
