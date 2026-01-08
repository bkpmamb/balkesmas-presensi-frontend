// components/employee/AttendanceCamera.tsx

"use client";

import { RefObject, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera as CameraIcon,
  X,
  RefreshCw,
  MapPin,
  Loader2,
  AlertCircle,
  Send,
  User,
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
  // ✅ ALL HOOKS MUST BE AT THE TOP - before any conditions
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceDetectionReady, setFaceDetectionReady] = useState(false);
  const [faceDetectionLoading, setFaceDetectionLoading] = useState(true);

  // Face detection using MediaPipe
  useEffect(() => {
    // Skip if no action, camera not open, or photo already taken
    if (!action || !camera.isOpen || camera.photo) {
      setFaceDetected(false);
      setFaceDetectionReady(false);
      setFaceDetectionLoading(true);
      return;
    }

    if (!videoRef.current) return;

    let faceDetection:
      | import("@mediapipe/face_detection").FaceDetection
      | null = null;
    let animationFrameId: number | null = null;
    let isRunning = true;

    const initFaceDetection = async () => {
      try {
        // Dynamic import MediaPipe
        const { FaceDetection } = await import("@mediapipe/face_detection");

        if (!isRunning) return;

        faceDetection = new FaceDetection({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });

        faceDetection.setOptions({
          model: "short", // 'short' is faster, 'full' is more accurate
          minDetectionConfidence: 0.5,
        });

        faceDetection.onResults((results) => {
          if (!isRunning) return;
          const detected = results.detections && results.detections.length > 0;
          setFaceDetected(detected);
          setFaceDetectionReady(true);
          setFaceDetectionLoading(false);
        });

        // Detection loop
        const detectFace = async () => {
          if (!isRunning || !faceDetection || !videoRef.current) return;

          if (videoRef.current.readyState >= 2) {
            try {
              await faceDetection.send({ image: videoRef.current });
            } catch (error) {
              console.error("Face detection error:", error);
            }
          }

          if (isRunning) {
            animationFrameId = requestAnimationFrame(detectFace);
          }
        };

        // Wait for video to be ready
        const video = videoRef.current;
        if (video) {
          const handleVideoReady = () => {
            if (isRunning) {
              detectFace();
            }
          };

          if (video.readyState >= 2) {
            handleVideoReady();
          } else {
            video.addEventListener("loadeddata", handleVideoReady, {
              once: true,
            });
          }
        }
      } catch (error) {
        console.error("Failed to initialize face detection:", error);
        setFaceDetectionLoading(false);
        setFaceDetectionReady(true);
        // If face detection fails, allow capture anyway
        setFaceDetected(true);
      }
    };

    initFaceDetection();

    // Cleanup
    return () => {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (faceDetection) {
        faceDetection.close();
      }
      setFaceDetected(false);
      setFaceDetectionReady(false);
      setFaceDetectionLoading(true);
    };
  }, [action, camera.isOpen, camera.photo, videoRef]);

  // ✅ EARLY RETURN AFTER ALL HOOKS
  if (!action) return null;

  const actionLabel = action === "clock-in" ? "Clock In" : "Clock Out";
  const canCapture = faceDetectionReady && faceDetected;

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
                  <div className="flex items-center space-x-2 mt-1">
                    <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                    <p className="text-sm text-gray-500">
                      Mendapatkan lokasi...
                    </p>
                  </div>
                )}
              </div>

              {/* Face Detection Status */}
              {camera.isOpen && !camera.photo && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Deteksi Wajah</span>
                  </div>

                  {faceDetectionLoading ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                      <p className="text-sm text-gray-500">
                        Memuat sistem deteksi wajah...
                      </p>
                    </div>
                  ) : faceDetected ? (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Wajah terdeteksi
                    </p>
                  ) : (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠ Arahkan wajah Anda ke kamera
                    </p>
                  )}
                </div>
              )}

              {/* Camera / Photo Preview */}
              <div className="relative aspect-4/3 bg-black rounded-lg overflow-hidden">
                {camera.isOpen && !camera.photo && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Face Detection Overlay */}
                    {faceDetectionReady && !faceDetected && (
                      <div className="absolute inset-0 border-4 border-orange-500 rounded-lg pointer-events-none">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Wajah tidak terdeteksi
                        </div>
                      </div>
                    )}

                    {faceDetectionReady && faceDetected && (
                      <div className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Wajah terdeteksi ✓
                        </div>
                      </div>
                    )}

                    {faceDetectionLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="text-center text-white">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                          <p className="text-sm">Memuat deteksi wajah...</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {camera.photo && (
                  <Image
                    src={camera.photo}
                    alt="Preview"
                    fill
                    priority
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
                <Button
                  className="w-full"
                  size="lg"
                  onClick={onCapture}
                  disabled={!canCapture}
                >
                  <CameraIcon className="mr-2 h-5 w-5" />
                  {canCapture ? "Ambil Foto" : "Arahkan Wajah ke Kamera"}
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
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Kirim Absen
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Submitting Overlay */}
              {isSubmitting && camera.photo && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-3" />
                  <p className="text-sm font-semibold text-gray-700">
                    Menempelkan Watermark...
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Mohon tunggu sebentar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
