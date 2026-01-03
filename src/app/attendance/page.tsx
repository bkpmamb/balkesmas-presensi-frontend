"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";

// 1. Definisi Skema Validasi dengan Zod
const attendanceSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  image: z.any().refine((file) => file instanceof File, "Foto wajib diambil"),
});

export default function AttendancePage() {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const base64ToFile = (base64String: string, filename: string): File => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.error(err);
          toast.error("GPS tidak aktif atau izin lokasi ditolak.");
        },
        { enableHighAccuracy: true } // Meminta akurasi tinggi
      );
    }
  }, []);

  const addWatermark = useCallback(
    (base64Img: string) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new window.Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
          ctx.fillStyle = "white";
          ctx.font = "bold 20px Arial";
          ctx.fillText(
            format(new Date(), "HH:mm:ss - dd MMM yyyy"),
            20,
            canvas.height - 45
          );
          ctx.font = "16px Arial";
          ctx.fillText(
            `GPS: ${location?.lat.toFixed(6)}, ${location?.lng.toFixed(6)}`,
            20,
            canvas.height - 20
          );
          setImgSrc(canvas.toDataURL("image/jpeg", 0.8));
        }
      };
      img.src = base64Img;
    },
    [location]
  );

  const capture = useCallback(() => {
    const image = webcamRef.current?.getScreenshot();
    if (image) addWatermark(image);
  }, [webcamRef, addWatermark]);

  const handleSubmit = async (type: "clock-in" | "clock-out") => {
    if (!imgSrc || !location) {
      return toast.error("Pastikan lokasi aktif dan foto sudah diambil");
    }

    setIsSubmitting(true);
    try {
      const imageFile = base64ToFile(imgSrc, `${type}-${Date.now()}.jpg`);

      // 2. Validasi dengan Zod sebelum kirim ke API
      const validation = attendanceSchema.safeParse({
        latitude: location.lat,
        longitude: location.lng,
        image: imageFile,
      });

      if (!validation.success) {
        throw new Error(validation.error.issues[0].message);
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("latitude", location.lat.toString());
      formData.append("longitude", location.lng.toString());

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/attendance/${type}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      setImgSrc(null);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        // Menangkap pesan detail 403 dari backend (misal: "Anda berada 500m dari kantor")
        const serverMsg = error.response?.data?.message;
        toast.error(serverMsg || "Akses ditolak (403)", {
          description: "Pastikan Anda berada di radius kantor.",
          icon: <AlertCircle className="text-red-500" />,
        });
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4 space-y-4">
      <Card className="border-2 shadow-lg overflow-hidden">
        <CardHeader className="bg-primary text-white py-4">
          <CardTitle className="text-center text-lg uppercase tracking-wider">
            E-Presensi Mobile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-slate-200 relative aspect-3/4 flex items-center justify-center overflow-hidden">
          {!imgSrc ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{ facingMode: "user" }}
            />
          ) : (
            <Image
              src={imgSrc}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {!imgSrc ? (
          <Button
            size="lg"
            onClick={capture}
            className="h-16 text-xl rounded-2xl shadow-md"
          >
            <Camera className="mr-2" /> Ambil Foto
          </Button>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleSubmit("clock-in")}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 h-14 text-lg shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Absen Masuk"
                )}
              </Button>
              <Button
                onClick={() => handleSubmit("clock-out")}
                disabled={isSubmitting}
                variant="destructive"
                className="h-14 text-lg shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Absen Pulang"
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setImgSrc(null)}
              disabled={isSubmitting}
              className="border-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Foto Ulang
            </Button>
          </>
        )}
      </div>

      <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-300">
        <div className="flex items-center justify-center text-xs text-slate-500 gap-2">
          <MapPin
            size={14}
            className={location ? "text-green-500" : "text-red-500"}
          />
          {location ? (
            <span className="font-mono">
              Koordinat: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </span>
          ) : (
            <span className="animate-pulse text-red-500 font-semibold">
              Mencari Lokasi GPS...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
