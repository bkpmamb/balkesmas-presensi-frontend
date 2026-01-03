// src/app/employee/layout.tsx

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allowedRoles={["employee"]}>{children}</AuthGuard>;
}
