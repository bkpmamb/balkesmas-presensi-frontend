//src/lib/validations/employee.ts

import * as z from "zod";

export const employeeSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(5, "Password minimal 5 karakter"),
  employeeId: z.string().min(2, "ID Karyawan wajib diisi"),
  category: z.string().min(2, "Kategori wajib dipilih"),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
