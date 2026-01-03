import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(5, "Password minimal 5 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;