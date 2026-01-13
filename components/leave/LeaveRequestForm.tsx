// components/leave/LeaveRequestForm.tsx

"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, differenceInDays } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Upload, X, FileText, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LeaveCategoryBadge } from "./LeaveCategoryBadge";

import type { LeaveType, CreateLeaveRequestDto } from "@/lib/types/leave";

const formSchema = z.object({
  leaveTypeId: z.string().min(1, "Pilih jenis cuti/izin"),
  startDate: z.date({ error: "Pilih tanggal mulai" }),
  endDate: z.date({ error: "Pilih tanggal selesai" }),
  reason: z.string().min(10, "Alasan minimal 10 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

interface LeaveRequestFormProps {
  leaveTypes: LeaveType[];
  onSubmit: (dto: CreateLeaveRequestDto, attachment?: File) => Promise<void>;
  isSubmitting: boolean;
}

export function LeaveRequestForm({
  leaveTypes,
  onSubmit,
  isSubmitting,
}: LeaveRequestFormProps) {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaveTypeId: "",
      reason: "",
    },
  });

  const watchStartDate = useWatch({
    control: form.control,
    name: "startDate",
  });

  const watchEndDate = useWatch({
    control: form.control,
    name: "endDate",
  });

  // Calculate total days
  const totalDays =
    watchStartDate && watchEndDate
      ? differenceInDays(watchEndDate, watchStartDate) + 1
      : 0;

  // Handle leave type change
  const handleLeaveTypeChange = (typeId: string) => {
    const type = leaveTypes.find((t) => t._id === typeId);
    setSelectedType(type || null);
    form.setValue("leaveTypeId", typeId);

    // Reset attachment if not required
    if (type && !type.requiresAttachment) {
      setAttachment(null);
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        form.setError("root", { message: "Ukuran file maksimal 5MB" });
        return;
      }
      setAttachment(file);
    }
  };

  // Handle form submit
  const handleSubmit = async (values: FormValues) => {
    // Validate attachment if required
    if (selectedType?.requiresAttachment && !attachment) {
      form.setError("root", {
        message: `${selectedType.name} memerlukan lampiran`,
      });
      return;
    }

    const dto: CreateLeaveRequestDto = {
      leaveTypeId: values.leaveTypeId,
      startDate: format(values.startDate, "yyyy-MM-dd"),
      endDate: format(values.endDate, "yyyy-MM-dd"),
      reason: values.reason,
    };

    await onSubmit(dto, attachment || undefined);
  };

  // Min date = today + minDaysInAdvance
  const minDate = selectedType
    ? addDays(new Date(), selectedType.minDaysInAdvance)
    : new Date();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Leave Type Selection */}
        <FormField
          control={form.control}
          name="leaveTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Cuti/Izin</FormLabel>
              <Select
                onValueChange={handleLeaveTypeChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis cuti/izin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type._id} value={type._id}>
                      <div className="flex items-center gap-2">
                        <LeaveCategoryBadge category={type.category} />
                        <span>{type.name}</span>
                        {type.requiresAttachment && (
                          <span className="text-xs text-muted-foreground">
                            (Perlu lampiran)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Leave Type Info */}
        {selectedType && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium">{selectedType.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedType.description}
              </p>
              <div className="flex gap-4 mt-2 text-sm">
                <span>
                  Minimal pengajuan:{" "}
                  <strong>
                    {selectedType.minDaysInAdvance === 0
                      ? "Hari ini"
                      : `${selectedType.minDaysInAdvance} hari sebelumnya`}
                  </strong>
                </span>
                <span>
                  Status gaji:{" "}
                  <strong>
                    {selectedType.isPaid ? "Digaji" : "Tidak digaji"}
                  </strong>
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Mulai</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: id })
                        ) : (
                          <span className="text-muted-foreground">
                            Pilih tanggal
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < minDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Selesai</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: id })
                        ) : (
                          <span className="text-muted-foreground">
                            Pilih tanggal
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < (watchStartDate || minDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Total Days Info */}
        {totalDays > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-3">
              <p className="text-sm text-blue-800">
                Total: <strong>{totalDays} hari</strong>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Reason */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alasan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan alasan pengajuan cuti/izin..."
                  className="min-h-25"
                  {...field}
                />
              </FormControl>
              <FormDescription>Minimal 10 karakter</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Attachment */}
        {selectedType?.requiresAttachment && (
          <div className="space-y-2">
            <FormLabel>
              Lampiran <span className="text-red-500">*</span>
            </FormLabel>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="attachment"
              />
              <label htmlFor="attachment">
                <Button type="button" variant="outline" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {attachment ? "Ganti File" : "Upload File"}
                  </span>
                </Button>
              </label>
              {attachment && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  <span className="truncate max-w-50">{attachment.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setAttachment(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Format: JPG, PNG, PDF. Maksimal 5MB.
            </p>
          </div>
        )}

        {/* Error Message */}
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
        </Button>
      </form>
    </Form>
  );
}
