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
import { getAddressFromCoords } from "@/src/lib/utils/geocoding"; // Import helper baru

// Pastikan GeolocationState di types mendukung field 'address'
interface ExtendedGeolocationState extends GeolocationState {
  address: string | null;
}

export function useEmployeeAttendance() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout, user } = useAuthStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [currentAction, setCurrentAction] = useState<AttendanceAction>(null);
  const [geolocation, setGeolocation] = useState<ExtendedGeolocationState>({
    latitude: null,
    longitude: null,
    address: null,
    error: null,
    loading: false,
  });
  const [camera, setCamera] = useState<CameraState>({
    isOpen: false,
    photo: null,
    error: null,
  });

  // --- LOGIKA KAMERA ---
  const attachStream = useCallback(() => {
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current
        .play()
        .catch((err) => console.error("Video play failed:", err));
    }
  }, []);

  useEffect(() => {
    if (camera.isOpen && !camera.photo) {
      const timer = setTimeout(() => attachStream(), 100);
      return () => clearTimeout(timer);
    }
  }, [camera.isOpen, camera.photo, attachStream]);

  const openCamera = useCallback(async () => {
    try {
      setCamera((prev) => ({ ...prev, error: null, isOpen: true }));
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
      console.log(error);
      setCamera((prev) => ({
        ...prev,
        isOpen: false,
        error: "Gagal mengakses kamera. Mohon izinkan akses kamera.",
      }));
    }
  }, [attachStream]);

  // --- FETCHING DATA ---
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["employee-profile"],
    queryFn: employeeAttendanceApi.getProfile,
  });

  const { data: todaySchedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ["today-schedule"],
    queryFn: employeeAttendanceApi.getTodaySchedule,
  });

  const ATTENDANCE_KEY = ["today-attendance"];

  const { data: todayAttendance, isLoading: attendanceLoading } = useQuery({
    // queryKey: ["today-attendance", new Date().getDate()],
    // queryKey: ["today-attendance", user?._id],
    queryKey: ATTENDANCE_KEY,
    queryFn: employeeAttendanceApi.getTodayAttendance,
    staleTime: 0,
    refetchOnMount: "always",
    gcTime: 0,
    refetchOnWindowFocus: true,
  });

  // --- MUTATIONS ---
  const clockInMutation = useMutation({
    mutationFn: employeeAttendanceApi.clockIn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEY });
      toast.success(data.message);
      resetState();
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Gagal clock in"),
  });

  const clockOutMutation = useMutation({
    mutationFn: employeeAttendanceApi.clockOut,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEY });
      toast.success(data.message);
      resetState();
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Gagal clock out"),
  });

  // --- GEOLOCATION DENGAN REVERSE GEOCODE ---
  const getCurrentLocation = useCallback(() => {
    setGeolocation((prev) => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setGeolocation((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation tidak didukung",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Dapatkan Alamat secara Async tanpa memblokir state koordinat
        getAddressFromCoords(latitude, longitude).then((addr) => {
          setGeolocation({
            latitude,
            longitude,
            address: addr,
            error: null,
            loading: false,
          });
        });
      },
      (error) => {
        console.log(error);
        setGeolocation((prev) => ({
          ...prev,
          loading: false,
          error: "Gagal mendapatkan lokasi. Pastikan GPS aktif.",
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // --- CAMERA ACTIONS ---
  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCamera({ isOpen: false, photo: null, error: null });
  }, []);

  const capturePhoto = useCallback(() => {
    // Pastikan videoRef ada dan sedang memutar stream
    if (!videoRef.current || videoRef.current.readyState < 2) {
      toast.error("Kamera belum siap, silakan tunggu sebentar.");
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement("canvas");

    // 1. Ambil resolusi asli dari stream video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      try {
        // 2. Gambar ke canvas TERLEBIH DAHULU
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 3. Konversi ke base64 (simpan ke state)
        const photoData = canvas.toDataURL("image/jpeg", 0.8);

        // 4. Update state: Set foto dan tutup jendela kamera
        setCamera((prev) => ({
          ...prev,
          photo: photoData,
          isOpen: false, // Jendela kamera di UI ditutup
        }));

        // 5. BARU matikan stream kamera (Penting: urutan ini krusial)
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      } catch (err) {
        console.error("Gagal capture gambar:", err);
        setCamera((prev) => ({
          ...prev,
          error: "Gagal memproses jepretan foto.",
        }));
      }
    }
  }, []); // Hapus closeCamera dari dependency jika itu menyebabkan re-render

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
      address: null,
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

  // --- SUBMIT DENGAN WATERMARK FRONTEND ---
  const submitAttendance = useCallback(async () => {
    if (!geolocation.latitude || !geolocation.longitude || !camera.photo) {
      toast.error("Lokasi dan foto wajib diisi");
      return;
    }

    try {
      // 1. Convert capture ke File
      const response = await fetch(camera.photo);
      const originalBlob = await response.blob();

      const originalFile = new File([originalBlob], "attendance.jpg", {
        type: "image/jpeg",
      });

      // 2. Prepare FormData (foto asli)
      const formData = new FormData();
      formData.append("latitude", geolocation.latitude.toString());
      formData.append("longitude", geolocation.longitude.toString());
      formData.append("address", geolocation.address || "");
      formData.append("image", originalFile);

      // 3. Submit
      if (currentAction === "clock-in") {
        await clockInMutation.mutateAsync(formData);
      } else {
        await clockOutMutation.mutateAsync(formData);
      }
    } catch (err) {
      // Menggunakan 'err' untuk menghilangkan warning ts(6133)
      console.error("Submit Error detail:", err);
      toast.error("Gagal memproses gambar.");
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
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const isLoading = profileLoading || scheduleLoading || attendanceLoading;
  const canClockOut = Boolean(
    todayAttendance && todayAttendance.clockOut === null
  );
  const canClockIn = !todayAttendance && !!todaySchedule;
  const isSubmitting = clockInMutation.isPending || clockOutMutation.isPending;
  const isReadyToSubmit =
    geolocation.latitude !== null && camera.photo !== null;

  console.log("DEBUG SHIFT:", {
    todayAttendance,
    canClockOut,
    todaySchedule: !!todaySchedule,
  });

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
