// src/components/attendances/ManualEntryForm.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Calendar, Clock, User, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { attendancesApi } from "@/src/lib/api/attendances";
import { ManualEntryEmployee } from "@/lib/types/attendance";

const manualEntrySchema = z
  .object({
    userId: z.string().min(1, "Karyawan wajib dipilih"),
    shiftId: z.string().min(1, "Shift wajib dipilih"),
    date: z.string().min(1, "Tanggal wajib diisi"),
    clockIn: z.string().min(1, "Jam masuk wajib diisi"),
    clockOut: z.string().optional().or(z.literal("")),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.clockOut && data.clockOut.trim() !== "" && data.clockIn) {
        return data.clockOut > data.clockIn;
      }
      return true;
    },
    {
      message: "Jam pulang harus setelah jam masuk",
      path: ["clockOut"],
    }
  );

type ManualEntryFormValues = z.infer<typeof manualEntrySchema>;

interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel?: () => void;
}

export function ManualEntryForm({
  onSubmit,
  isLoading,
  onCancel,
}: ManualEntryFormProps) {
  const [selectedData, setSelectedData] = useState<ManualEntryEmployee | null>(
    null
  );

  // Fetch available employees for manual entry
  const {
    data: availableData,
    isLoading: isLoadingAvailable,
    error: availableError,
  } = useQuery({
    queryKey: ["manual-entry-available"],
    queryFn: attendancesApi.getAvailableForManualEntry,
  });

  const form = useForm<ManualEntryFormValues>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: {
      userId: "",
      shiftId: "",
      date: new Date().toISOString().split("T")[0],
      clockIn: "",
      clockOut: "",
      notes: "",
    },
  });

  // Auto-fill form when employee selected
  const handleEmployeeChange = (employeeId: string) => {
    const selected = availableData?.employees.find(
      (e) => e.employee._id === employeeId
    );

    if (selected) {
      setSelectedData(selected);

      // Auto-fill semua form
      form.setValue("userId", selected.employee._id);
      form.setValue("shiftId", selected.shift._id);
      form.setValue(
        "date",
        availableData?.date?.split("T")[0] ||
          new Date().toISOString().split("T")[0]
      );
      form.setValue("clockIn", selected.shift.startTime);
      // Clock out kosong karena mungkin belum pulang
      form.setValue("clockOut", "");
      form.setValue(
        "notes",
        "Entry manual oleh admin - " +
          format(new Date(), "dd MMM yyyy HH:mm", { locale: id })
      );
    }
  };

  const handleFormSubmit = async (values: ManualEntryFormValues) => {
    try {
      // DEBUG: Lihat values mentah dari form
      console.log("📋 Raw form values:", values);
      console.log("📋 clockIn type:", typeof values.clockIn);
      console.log("📋 clockIn value:", `"${values.clockIn}"`);

      const formatTime = (time: string) => {
        if (!time) return "";
        console.log("⏰ formatTime input:", `"${time}"`);
        const [h, m] = time.split(":");
        console.log("⏰ split result - h:", `"${h}"`, "m:", `"${m}"`);
        const result = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
        console.log("⏰ formatTime output:", `"${result}"`);
        return result;
      };

      const payload = {
        userId: values.userId,
        shiftId: values.shiftId,
        date: values.date,
        clockIn: formatTime(values.clockIn),
        clockOut: values.clockOut?.trim() ? formatTime(values.clockOut) : "",
        notes: values.notes || `Entry manual oleh Admin`,
      };

      console.log("🚀 Payload dikirim:", payload);
      await onSubmit(payload);

      form.reset();
      setSelectedData(null);
    } catch (error) {
      console.error("❌ Form submit error:", error);
    }
  };

  // Loading state
  if (isLoadingAvailable) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  // Error state
  if (availableError) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 font-medium">Gagal memuat data</p>
        <p className="text-sm text-muted-foreground mt-1">
          {availableError instanceof Error
            ? availableError.message
            : "Terjadi kesalahan"}
        </p>
      </div>
    );
  }

  // No available employees
  if (!availableData?.employees.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="font-medium">
          Tidak ada karyawan yang perlu entry manual
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Semua karyawan dengan jadwal hari ini ({availableData?.dayName}) sudah
          melakukan presensi.
        </p>
        <div className="flex gap-4 mt-4 text-sm">
          <Badge variant="outline">
            Terjadwal: {availableData?.totalScheduled || 0}
          </Badge>
          <Badge variant="secondary">
            Sudah Absen: {availableData?.totalAttended || 0}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">
                Entry Manual untuk {availableData?.dayName},{" "}
                {format(new Date(), "dd MMMM yyyy", { locale: id })}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {availableData?.totalAvailable} dari{" "}
                {availableData?.totalScheduled} karyawan belum absen
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          {/* Employee Selection */}
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Karyawan</FormLabel>
                <Select
                  onValueChange={handleEmployeeChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih karyawan yang belum absen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableData?.employees.map((item) => (
                      <SelectItem
                        key={item.employee._id}
                        value={item.employee._id}
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium">
                              {item.employee.name}
                            </span>
                            <span className="text-muted-foreground ml-2">
                              ({item.employee.employeeId})
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              • {item.shift.name}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Selected Employee Info */}
          {selectedData && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Karyawan</p>
                    <p className="font-medium">{selectedData.employee.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedData.employee.category?.name || "Tanpa Kategori"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Shift</p>
                    <p className="font-medium">{selectedData.shift.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedData.shift.startTime} -{" "}
                      {selectedData.shift.endTime}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hidden Shift Field */}
          <FormField
            control={form.control}
            name="shiftId"
            render={({ field }) => <input type="hidden" {...field} />}
          />

          {/* Date - Read only */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal</FormLabel>
                <FormControl>
                  <Input type="date" {...field} readOnly className="bg-muted" />
                </FormControl>
                <FormDescription className="text-xs">
                  Entry manual hanya untuk hari ini
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Clock In & Clock Out */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="clockIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Jam Masuk
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clockOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Jam Pulang (Opsional)
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Kosongkan jika belum pulang
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catatan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Alasan entry manual..."
                    className="resize-none"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Batal
              </Button>
            )}
            <Button type="submit" disabled={isLoading || !selectedData}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tambah Presensi
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
