// src/app/employee/page.tsx

"use client";

import { motion } from "framer-motion";
import {
  EmployeeHeader,
  EmployeeGreeting,
  ScheduleCard,
  AttendanceStatus,
  AttendanceActions,
  AttendanceCamera,
  EmployeeSkeleton,
} from "@/components/employee";
import { useEmployeeAttendance } from "@/hooks/useEmployeeAttendance";
import { attendanceAnimations } from "@/config/employee.config";

export default function EmployeePage() {
  const {
    profile,
    todaySchedule,
    todayAttendance,
    currentAction,
    geolocation,
    camera,
    videoRef,
    isLoading,
    isSubmitting,
    canClockIn,
    canClockOut,
    isReadyToSubmit,
    startAttendance,
    submitAttendance,
    capturePhoto,
    retakePhoto,
    resetState,
    getCurrentLocation,
    handleLogout,
  } = useEmployeeAttendance();

  if (isLoading) {
    return <EmployeeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <motion.div
        variants={attendanceAnimations.container}
        initial="hidden"
        animate="visible"
        key="employee-page"
      >
        <EmployeeHeader profile={profile} onLogout={handleLogout} />

        <main className="container mx-auto px-4 py-6 space-y-6 max-w-lg">
          <EmployeeGreeting name={profile?.name} />

          <ScheduleCard schedule={todaySchedule} />

          <AttendanceStatus attendance={todayAttendance} />

          <AttendanceActions
            canClockIn={canClockIn}
            canClockOut={canClockOut}
            hasSchedule={!!todaySchedule || !!canClockOut}
            todaySchedule={todaySchedule}
            todayAttendance={todayAttendance}
            onStartAttendance={startAttendance}
          />
        </main>

        <AttendanceCamera
          action={currentAction}
          geolocation={geolocation}
          camera={camera}
          videoRef={videoRef}
          isSubmitting={isSubmitting}
          isReadyToSubmit={isReadyToSubmit}
          onCapture={capturePhoto}
          onRetake={retakePhoto}
          onSubmit={submitAttendance}
          onCancel={resetState}
          onRefreshLocation={getCurrentLocation}
        />
      </motion.div>
    </div>
  );
}
