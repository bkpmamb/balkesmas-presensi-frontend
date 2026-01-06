// hooks/useEmployeeAttendance.ts

import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/src/lib/store/authStore";
import { employeeAttendanceApi } from "@/src/lib/api/employee-attendance";
import type { ApiError } from "@/lib/types/api";
import type {
  GeolocationState,
  CameraState,
  AttendanceAction,
} from "@/lib/types/employee-attendance";

export function useEmployeeAttendance() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout, user } = useAuthStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [currentAction, setCurrentAction] = useState<AttendanceAction>(null);
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });
  const [camera, setCamera] = useState<CameraState>({
    isOpen: false,
    photo: null,
    error: null,
  });

  // Fetch profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["employee-profile"],
    queryFn: employeeAttendanceApi.getProfile,
  });

  // Fetch today's schedule
  const { data: todaySchedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ["today-schedule"],
    queryFn: employeeAttendanceApi.getTodaySchedule,
  });

  // Fetch today's attendance
  const { data: todayAttendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ["today-attendance", new Date().getDate()], // Berubah setiap hari
    queryFn: employeeAttendanceApi.getTodayAttendance,
    staleTime: 0,
    gcTime: 0, // Hapus cache segera
  });

  // Clock in mutation
  const clockInMutation = useMutation({
    mutationFn: employeeAttendanceApi.clockIn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["today-attendance"] });
      toast.success(data.message);
      resetState();
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal melakukan clock in");
    },
  });

  // Clock out mutation
  const clockOutMutation = useMutation({
    mutationFn: employeeAttendanceApi.clockOut,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["today-attendance"] });
      toast.success(data.message);
      resetState();
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal melakukan clock out");
    },
  });

  // Get current location
  const getCurrentLocation = useCallback(() => {
    setGeolocation((prev) => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setGeolocation((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation tidak didukung di browser Anda",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = "Gagal mendapatkan lokasi";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Izin lokasi ditolak. Mohon aktifkan izin lokasi.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informasi lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            errorMessage = "Permintaan lokasi timeout.";
            break;
        }
        setGeolocation((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Open camera
  const openCamera = useCallback(async () => {
    try {
      setCamera((prev) => ({ ...prev, error: null }));
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCamera((prev) => ({ ...prev, isOpen: true }));
    } catch (error) {
      console.log(error);
      setCamera((prev) => ({
        ...prev,
        error: "Gagal mengakses kamera. Mohon izinkan akses kamera.",
      }));
    }
  }, []);

  // Close camera
  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCamera({ isOpen: false, photo: null, error: null });
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const photoData = canvas.toDataURL("image/jpeg", 0.8);
      setCamera((prev) => ({ ...prev, photo: photoData }));

      // Stop camera after capture
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCamera((prev) => ({ ...prev, isOpen: false }));
    }
  }, []);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCamera((prev) => ({ ...prev, photo: null }));
    openCamera();
  }, [openCamera]);

  // Reset state
  const resetState = useCallback(() => {
    closeCamera();
    setCurrentAction(null);
    setGeolocation({
      latitude: null,
      longitude: null,
      error: null,
      loading: false,
    });
    setCamera({ isOpen: false, photo: null, error: null });
  }, [closeCamera]);

  // Start attendance process
  const startAttendance = useCallback(
    (action: AttendanceAction) => {
      setCurrentAction(action);
      getCurrentLocation();
      openCamera();
    },
    [getCurrentLocation, openCamera]
  );

  // Submit attendance
  const submitAttendance = useCallback(async () => {
    if (!geolocation.latitude || !geolocation.longitude || !camera.photo) {
      toast.error("Lokasi dan foto wajib diisi");
      return;
    }

    // Convert base64 to blob
    const response = await fetch(camera.photo);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("latitude", geolocation.latitude.toString());
    formData.append("longitude", geolocation.longitude.toString());
    formData.append("photo", blob, "attendance.jpg");

    if (currentAction === "clock-in") {
      await clockInMutation.mutateAsync(formData);
    } else if (currentAction === "clock-out") {
      await clockOutMutation.mutateAsync(formData);
    }
  }, [
    geolocation,
    camera.photo,
    currentAction,
    clockInMutation,
    clockOutMutation,
  ]);

  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Computed values
  const isLoading = profileLoading || scheduleLoading || attendanceLoading;
  console.log("--- DEBUG FRONTEND ---");
  console.log("Today Schedule:", todaySchedule);
  console.log("Today Attendance:", todayAttendance);
  console.log("Logic canClockIn:", !!todaySchedule && !todayAttendance);
  console.log("----------------------");
  const canClockIn = todaySchedule && !todayAttendance;
  const canClockOut = todayAttendance && !todayAttendance.clockOut;
  const isSubmitting = clockInMutation.isPending || clockOutMutation.isPending;
  const isReadyToSubmit =
    geolocation.latitude !== null &&
    geolocation.longitude !== null &&
    camera.photo !== null;

  return {
    // Data
    user,
    profile,
    todaySchedule,
    todayAttendance,

    // State
    currentAction,
    geolocation,
    camera,
    videoRef,

    // Loading
    isLoading,
    isSubmitting,

    // Computed
    canClockIn,
    canClockOut,
    isReadyToSubmit,

    // Actions
    startAttendance,
    submitAttendance,
    capturePhoto,
    retakePhoto,
    resetState,
    getCurrentLocation,
    handleLogout,
  };
}
