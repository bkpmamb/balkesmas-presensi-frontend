// components/dashboard/AbsentAlert.tsx

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface AbsentAlertProps {
  absentCount: number;
}

export function AbsentAlert({ absentCount }: AbsentAlertProps) {
  if (absentCount <= 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Perhatian!</AlertTitle>
      <AlertDescription>
        Ada {absentCount} karyawan yang belum hadir hari ini.{" "}
        <Link href="/dashboard/attendances" className="underline font-medium">
          Lihat detail
        </Link>
      </AlertDescription>
    </Alert>
  );
}
