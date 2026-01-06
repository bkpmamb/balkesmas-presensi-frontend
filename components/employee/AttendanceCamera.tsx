// components/employee/AttendanceCamera.tsx

"use client";

import { RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  X,
  Check,
  RefreshCw,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import type {
  GeolocationState,
  CameraState,
  AttendanceAction,
} from "@/lib/types/employee-attendance";

interface AttendanceCameraProps {
  action: AttendanceAction;
  geolocation: GeolocationState;
  camera: CameraState;
  videoRef: RefObject<HTMLVideoElement | null>;
  isSubmitting: boolean;
  isReadyToSubmit: boolean;
  onCapture: () => void;
  onRetake: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  onRefreshLocation: () => void;
}

export function AttendanceCamera({
  action,
  geolocation,
  camera,
  videoRef,
  isSubmitting,
  isReadyToSubmit,
  onCapture,
  onRetake,
  onSubmit,
  onCancel,
  onRefreshLocation,
}: AttendanceCameraProps) {
  if (!action) return null;

  const actionLabel = action === "clock-in" ? "Clock In" : "Clock Out";
  const actionColor = action === "clock-in" ? "green" : "blue";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{actionLabel}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Location Status */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Lokasi</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRefreshLocation}
                    disabled={geolocation.loading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        geolocation.loading ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </div>
                {geolocation.error ? (
                  <div className="flex items-center space-x-2 mt-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{geolocation.error}</span>
                  </div>
                ) : geolocation.latitude && geolocation.longitude ? (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ Lokasi berhasil didapatkan
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    Mendapatkan lokasi...
                  </p>
                )}
              </div>

              {/* Camera / Photo Preview */}
              <div className="relative aspect-4/3 bg-black rounded-lg overflow-hidden">
                {camera.isOpen && !camera.photo && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover bg-black"
                    style={{ minHeight: "100%" }}
                  />
                )}
                {camera.photo && (
                  <Image
                    src={camera.photo}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                )}
                {camera.error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center p-4">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                      <p className="text-sm text-red-600">{camera.error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Actions */}
              {camera.isOpen && !camera.photo && (
                <Button className="w-full" size="lg" onClick={onCapture}>
                  <Camera className="mr-2 h-5 w-5" />
                  Ambil Foto
                </Button>
              )}

              {camera.photo && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={onRetake}
                    disabled={isSubmitting}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Ulangi
                  </Button>
                  <Button
                    onClick={onSubmit}
                    disabled={!isReadyToSubmit || isSubmitting}
                    className={`bg-${actionColor}-600 hover:bg-${actionColor}-700`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? "Memproses..." : "Konfirmasi"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
