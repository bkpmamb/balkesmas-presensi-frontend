// components/settings/GPSSettings.tsx

"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import type { Settings } from "@/lib/types/settings";

const gpsSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  maxDistance: z.coerce.number().min(1),
});

type GPSFormValues = z.infer<typeof gpsSchema>;

interface GPSSettingsProps {
  settings: Settings;
  onSubmit: (data: GPSFormValues) => Promise<void>;
  isLoading: boolean;
}

export function GPSSettings({
  settings,
  onSubmit,
  isLoading,
}: GPSSettingsProps) {
  const [gettingLocation, setGettingLocation] = useState(false);

  const form = useForm({
    resolver: zodResolver(gpsSchema),
    defaultValues: {
      latitude: settings.targetLatitude,
      longitude: settings.targetLongitude,
      maxDistance: settings.radiusMeters,
    },
  });

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung browser Anda");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("latitude", position.coords.latitude);
        form.setValue("longitude", position.coords.longitude);
        setGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin diberikan."
        );
        setGettingLocation(false);
      }
    );
  };

  const latitude = useWatch({ control: form.control, name: "latitude" }) as
    | number
    | null;
  const longitude = useWatch({ control: form.control, name: "longitude" }) as
    | number
    | null;
  const maxDistance = useWatch({
    control: form.control,
    name: "maxDistance",
  }) as number | null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Lokasi GPS Kantor</span>
        </CardTitle>
        <CardDescription>
          Atur koordinat lokasi kantor dan radius maksimal untuk presensi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="-6.9175"
                        value={String(field.value ?? "")}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="107.6191"
                        value={String(field.value ?? "")}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Radius Maksimal (meter)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="100"
                      value={String(field.value ?? "")}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormDescription>
                    Jarak maksimal dari kantor untuk bisa melakukan presensi
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="mr-2 h-4 w-4" />
                )}
                Gunakan Lokasi Saat Ini
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Pengaturan
              </Button>
            </div>
          </form>
        </Form>

        {/* Map Preview */}
        <div className="mt-4 border rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
          ></iframe>
        </div>

        {/* Location Info */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">
            📍 Lokasi Saat Ini:
          </p>
          <p className="text-sm text-blue-700">
            Lat: {latitude} | Long: {longitude}
          </p>
          <p className="text-sm text-blue-700">Radius: {maxDistance} meter</p>
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline mt-2 inline-block"
          >
            Buka di Google Maps →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
