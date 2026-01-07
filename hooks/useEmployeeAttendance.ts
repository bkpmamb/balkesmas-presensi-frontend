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

  // --- LOGIKA PERBAIKAN KAMERA ---

  // Fungsi untuk memasang stream ke element video secara paksa
  const attachStream = useCallback(() => {
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current
        .play()
        .catch((err) => console.error("Video play failed:", err));
    }
  }, []);

  // Efek untuk memantau kapan videoRef siap di DOM
  useEffect(() => {
    if (camera.isOpen && !camera.photo) {
      // Gunakan sedikit delay/timeout untuk memastikan elemen video sudah dirender oleh React
      const timer = setTimeout(() => {
        attachStream();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [camera.isOpen, camera.photo, attachStream]);

  const openCamera = useCallback(async () => {
    try {
      setCamera((prev) => ({ ...prev, error: null, isOpen: true }));

      // Matikan stream lama jika ada
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      attachStream();
    } catch (error) {
      console.error("Camera Error:", error);
      setCamera((prev) => ({
        ...prev,
        isOpen: false,
        error:
          "Gagal mengakses kamera. Mohon izinkan akses kamera di pengaturan browser.",
      }));
    }
  }, [attachStream]);

  // --- AKHIR LOGIKA PERBAIKAN KAMERA ---

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
    queryKey: ["today-attendance", new Date().getDate()],
    queryFn: employeeAttendanceApi.getTodayAttendance,
    staleTime: 0,
    gcTime: 0,
  });

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
            errorMessage =
              "Izin lokasi ditolak. Mohon aktifkan GPS dan izinkan akses lokasi.";
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCamera({ isOpen: false, photo: null, error: null });
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    // Gunakan resolusi video asli agar tidak stretch
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const photoData = canvas.toDataURL("image/jpeg", 0.8);
      setCamera((prev) => ({ ...prev, photo: photoData, isOpen: false }));

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, []);

  const retakePhoto = useCallback(() => {
    setCamera((prev) => ({ ...prev, photo: null }));
    openCamera();
  }, [openCamera]);

  const resetState = useCallback(() => {
    closeCamera();
    setCurrentAction(null);
    setGeolocation({
      latitude: null,
      longitude: null,
      error: null,
      loading: false,
    });
  }, [closeCamera]);

  const startAttendance = useCallback(
    (action: AttendanceAction) => {
      setCurrentAction(action);
      getCurrentLocation();
      openCamera();
    },
    [getCurrentLocation, openCamera]
  );

  const submitAttendance = useCallback(async () => {
    if (!geolocation.latitude || !geolocation.longitude || !camera.photo) {
      toast.error("Lokasi dan foto wajib diisi");
      return;
    }

    try {
      // 1. Ubah Base64 ke Blob (Mencegah pengiriman string kosong/{} )
      const response = await fetch(camera.photo);
      const blob = await response.blob();

      // 2. Bungkus ke FormData
      const formData = new FormData();
      formData.append("latitude", geolocation.latitude.toString());
      formData.append("longitude", geolocation.longitude.toString());

      // 3. Nama field HARUS "image" (harus sama dengan upload.single("image") di backend)
      formData.append("image", blob, "attendance.jpg");

      if (currentAction === "clock-in") {
        await clockInMutation.mutateAsync(formData);
      } else {
        await clockOutMutation.mutateAsync(formData);
      }
    } catch (err) {
      console.error("Submit Error:", err);
    }
  }, [
    geolocation,
    camera.photo,
    currentAction,
    clockInMutation,
    clockOutMutation,
  ]);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const isLoading = profileLoading || scheduleLoading || attendanceLoading;
  const canClockIn = todaySchedule && !todayAttendance;
  const canClockOut = todayAttendance && !todayAttendance.clockOut;
  const isSubmitting = clockInMutation.isPending || clockOutMutation.isPending;
  const isReadyToSubmit =
    geolocation.latitude !== null &&
    geolocation.longitude !== null &&
    camera.photo !== null;

  return {
    user,
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
  };
}
