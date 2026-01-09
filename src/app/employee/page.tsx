// src/app/employee/page.tsx
"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  EmployeeHeader,
  EmployeeGreeting,
  EmployeeSkeleton,
  ScheduleCard,
  AttendanceStatus,
  AttendanceActions,
} from "@/components/employee";
import { useEmployeeAttendance } from "@/hooks/useEmployeeAttendance";
import { attendanceAnimations } from "@/config/employee.config";

const AttendanceCamera = lazy(() =>
  import("@/components/employee").then((mod) => ({
    default: mod.AttendanceCamera,
  }))
);

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

  // 3. Pastikan isLoading mencakup validasi data krusial
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
        <EmployeeHeader
          profile={profile ?? undefined}
          onLogout={handleLogout}
        />

        <main className="container mx-auto px-4 py-6 space-y-6 max-w-lg">
          <EmployeeGreeting name={profile?.name} />

          {/* Tanpa Suspense untuk komponen utama agar lebih instan */}
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

        {currentAction && (
          <Suspense
            fallback={
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center text-white">
                Loading Camera...
              </div>
            }
          >
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
          </Suspense>
        )}
      </motion.div>
    </div>
  );
}
