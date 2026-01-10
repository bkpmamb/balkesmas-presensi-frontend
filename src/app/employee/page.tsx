// src/app/employee/page.tsx

"use client";

import { lazy, Suspense, memo, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// ✅ Import komponen ringan langsung
import { EmployeeHeader, EmployeeSkeleton } from "@/components/employee";
import { useEmployeeAttendance } from "@/hooks/useEmployeeAttendance";

// ✅ Lazy load SEMUA komponen yang tidak critical untuk first paint
const EmployeeGreeting = lazy(() =>
  import("@/components/employee/EmployeeGreeting").then((mod) => ({
    default: mod.EmployeeGreeting,
  }))
);

const ScheduleCard = lazy(() =>
  import("@/components/employee/ScheduleCard").then((mod) => ({
    default: mod.ScheduleCard,
  }))
);

const AttendanceStatus = lazy(() =>
  import("@/components/employee/AttendanceStatus").then((mod) => ({
    default: mod.AttendanceStatus,
  }))
);

const AttendanceActions = lazy(() =>
  import("@/components/employee/AttendanceActions").then((mod) => ({
    default: mod.AttendanceActions,
  }))
);

const AttendanceCamera = lazy(() =>
  import("@/components/employee/AttendanceCamera").then((mod) => ({
    default: mod.AttendanceCamera,
  }))
);

// ✅ Lazy load framer-motion (heavy library)
const MotionDiv = lazy(() =>
  import("framer-motion").then((mod) => ({
    default: mod.motion.div,
  }))
);

// ✅ Skeleton fallbacks
function GreetingSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}

function ActionsSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

function CameraLoadingFallback() {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">Memuat kamera...</p>
      </div>
    </div>
  );
}

// ✅ Memoized main content untuk prevent unnecessary re-renders
const EmployeeMainContent = memo(function EmployeeMainContent({
  profile,
  todaySchedule,
  todayAttendance,
  canClockIn,
  canClockOut,
  startAttendance,
}: {
  profile: ReturnType<typeof useEmployeeAttendance>["profile"];
  todaySchedule: ReturnType<typeof useEmployeeAttendance>["todaySchedule"];
  todayAttendance: ReturnType<typeof useEmployeeAttendance>["todayAttendance"];
  canClockIn: boolean;
  canClockOut: boolean;
  startAttendance: ReturnType<typeof useEmployeeAttendance>["startAttendance"];
}) {
  return (
    <main className="container mx-auto px-4 py-6 space-y-6 max-w-lg">
      <Suspense fallback={<GreetingSkeleton />}>
        <EmployeeGreeting name={profile?.name} />
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        <ScheduleCard schedule={todaySchedule} />
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        <AttendanceStatus attendance={todayAttendance} />
      </Suspense>

      <Suspense fallback={<ActionsSkeleton />}>
        <AttendanceActions
          canClockIn={canClockIn}
          canClockOut={canClockOut}
          hasSchedule={!!todaySchedule || !!canClockOut}
          todaySchedule={todaySchedule}
          todayAttendance={todayAttendance}
          onStartAttendance={startAttendance}
        />
      </Suspense>
    </main>
  );
});

// ✅ Animation config - defined outside component
const containerAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

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

  // ✅ Memoize camera props untuk prevent re-render
  const cameraProps = useMemo(
    () => ({
      action: currentAction,
      geolocation,
      camera,
      videoRef,
      isSubmitting,
      isReadyToSubmit,
      onCapture: capturePhoto,
      onRetake: retakePhoto,
      onSubmit: submitAttendance,
      onCancel: resetState,
      onRefreshLocation: getCurrentLocation,
    }),
    [
      currentAction,
      geolocation,
      camera,
      videoRef,
      isSubmitting,
      isReadyToSubmit,
      capturePhoto,
      retakePhoto,
      submitAttendance,
      resetState,
      getCurrentLocation,
    ]
  );

  // Loading state
  if (isLoading) {
    return <EmployeeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* ✅ Header loads immediately - critical for UX */}
      <EmployeeHeader profile={profile ?? undefined} onLogout={handleLogout} />

      {/* ✅ Lazy load framer-motion wrapper */}
      <Suspense
        fallback={
          <EmployeeMainContent
            profile={profile}
            todaySchedule={todaySchedule}
            todayAttendance={todayAttendance}
            canClockIn={canClockIn}
            canClockOut={canClockOut}
            startAttendance={startAttendance}
          />
        }
      >
        <MotionDiv
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
        >
          <EmployeeMainContent
            profile={profile}
            todaySchedule={todaySchedule}
            todayAttendance={todayAttendance}
            canClockIn={canClockIn}
            canClockOut={canClockOut}
            startAttendance={startAttendance}
          />
        </MotionDiv>
      </Suspense>

      {/* ✅ Camera modal - only loads when needed */}
      {currentAction && (
        <Suspense fallback={<CameraLoadingFallback />}>
          <AttendanceCamera {...cameraProps} />
        </Suspense>
      )}
    </div>
  );
}
