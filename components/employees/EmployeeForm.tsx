// src/components/employees/EmployeeForm.tsx

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
import type { Category, Employee } from "@/lib/types/employee";

const employeeSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .optional()
    .or(z.literal("")),
  category: z.string().min(1, "Kategori wajib dipilih"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]*$/.test(val),
      "Nomor telepon hanya boleh berisi angka"
    ),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  categories: Category[];
  onSubmit: (data: EmployeeFormValues) => Promise<void>;
  isLoading: boolean;
}

export function EmployeeForm({
  employee,
  categories,
  onSubmit,
  isLoading,
}: EmployeeFormProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee?.name || "",
      username: employee?.username || "",
      password: "",
      category: employee?.category._id || "",
      phone: employee?.phone || "",
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
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan username" {...field} />
              </FormControl>
              <FormDescription>
                Username untuk login ke aplikasi
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password {employee && "(Kosongkan jika tidak diubah)"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={
                    employee
                      ? "Kosongkan jika tidak diubah"
                      : "Masukkan password"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                Kategori akan menentukan ID karyawan
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: 081234567890"
                  {...field}
                  type="tel"
                  inputMode="numeric"
                  onKeyDown={(e) => {
                    // Allow: backspace, delete, tab, escape, enter, arrows
                    if (
                      [
                        "Backspace",
                        "Delete",
                        "Tab",
                        "Escape",
                        "Enter",
                        "ArrowLeft",
                        "ArrowRight",
                        "ArrowUp",
                        "ArrowDown",
                      ].includes(e.key)
                    ) {
                      return;
                    }
                    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                    if (
                      (e.ctrlKey || e.metaKey) &&
                      ["a", "c", "v", "x"].includes(e.key.toLowerCase())
                    ) {
                      return;
                    }
                    // Block if not a number
                    if (!/^[0-9]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    // Remove any non-numeric characters (handles paste)
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {employee ? "Update" : "Tambah"} Karyawan
          </Button>
        </div>
      </form>
    </Form>
  );
}
