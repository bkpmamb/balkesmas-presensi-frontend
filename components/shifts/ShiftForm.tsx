// src/components/shifts/ShiftForm.tsx

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Category, Shift } from "@/lib/types/shift";

const shiftSchema = z.object({
  name: z.string().min(3, "Nama shift minimal 3 karakter"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  startTime: z.string().min(1, "Jam mulai wajib diisi"),
  endTime: z.string().min(1, "Jam selesai wajib diisi"),
  toleranceMinutes: z.coerce.number().min(0, "Toleransi minimal 0 menit"),
});

type ShiftFormValues = z.infer<typeof shiftSchema>;

interface ShiftFormProps {
  shift?: Shift;
  categories: Category[];
  onSubmit: (data: ShiftFormValues) => Promise<void>;
  isLoading: boolean;
}

export function ShiftForm({
  shift,
  categories,
  onSubmit,
  isLoading,
}: ShiftFormProps) {
  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      name: shift?.name || "",
      category: shift?.category._id || "",
      startTime: shift?.startTime || "",
      endTime: shift?.endTime || "",
      toleranceMinutes: shift?.toleranceMinutes || 15,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Shift</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Shift Pagi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ ADD CATEGORY FIELD */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name} ({category.prefix})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Shift ini hanya untuk karyawan dengan kategori yang dipilih
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ FIXED TIME FIELDS */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jam Mulai</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jam Selesai</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="toleranceMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Toleransi Keterlambatan (menit)</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormDescription>
                Karyawan masih dianggap tepat waktu dalam toleransi ini
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {shift ? "Update" : "Tambah"} Shift
          </Button>
        </div>
      </form>
    </Form>
  );
}
