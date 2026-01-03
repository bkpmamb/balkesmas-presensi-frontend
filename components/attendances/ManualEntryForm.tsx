// src/components/attendances/ManualEntryForm.tsx

"use client";

import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Employee } from "@/lib/types/employee";
import type { Shift } from "@/lib/types/attendance";

const manualEntrySchema = z.object({
  userId: z.string().min(1, "Karyawan wajib dipilih"),
  shiftId: z.string().min(1, "Shift wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  clockIn: z.string().min(1, "Jam masuk wajib diisi"),
  clockOut: z.string().optional(),
  notes: z.string().optional(),
});

type ManualEntryFormValues = z.infer<typeof manualEntrySchema>;

interface ManualEntryFormProps {
  employees: Employee[];
  shifts: Shift[];
  onSubmit: (data: ManualEntryFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ManualEntryForm({
  employees,
  shifts,
  onSubmit,
  isLoading,
}: ManualEntryFormProps) {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Karyawan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih karyawan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.name} ({employee.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shiftId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih shift" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift._id} value={shift._id}>
                      {shift.name} ({shift.startTime} - {shift.endTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clockIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jam Masuk</FormLabel>
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
                <FormLabel>Jam Pulang (Opsional)</FormLabel>
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

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alasan entry manual..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tambah Presensi Manual
          </Button>
        </div>
      </form>
    </Form>
  );
}