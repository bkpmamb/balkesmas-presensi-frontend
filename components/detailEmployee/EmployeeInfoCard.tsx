// components/employees/EmployeeInfoCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Phone, Briefcase, Calendar, Hash, Shield } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Employee } from "@/lib/types/employee";

interface EmployeeInfoCardProps {
  employee: Employee;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export function EmployeeInfoCard({ employee }: EmployeeInfoCardProps) {
  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const infoItems = [
    {
      icon: <Hash className="h-5 w-5 text-muted-foreground" />,
      label: "ID Karyawan",
      value: employee.employeeId,
    },
    {
      icon: <User className="h-5 w-5 text-muted-foreground" />,
      label: "Username",
      value: employee.username,
    },
    {
      icon: <Briefcase className="h-5 w-5 text-muted-foreground" />,
      label: "Kategori",
      value: employee.category?.name ?? "Tanpa Kategori",
    },
    {
      icon: <Phone className="h-5 w-5 text-muted-foreground" />,
      label: "Telepon",
      value: employee.phone || "-",
    },
    {
      icon: <Shield className="h-5 w-5 text-muted-foreground" />,
      label: "Role",
      value: employee.role === "admin" ? "Administrator" : "Karyawan",
    },
    {
      icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
      label: "Bergabung",
      value: format(new Date(employee.createdAt), "dd MMMM yyyy", {
        locale: id,
      }),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Karyawan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{employee.name}</h2>
          <p className="text-muted-foreground">{employee.category?.name}</p>
        </div>

        <div className="grid gap-4">
          {infoItems.map((item) => (
            <InfoItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
