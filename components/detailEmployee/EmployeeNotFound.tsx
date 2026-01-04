// components/employees/EmployeeNotFound.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserX, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function EmployeeNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            <UserX className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Karyawan Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            Data karyawan yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Button asChild>
            <Link href="/dashboard/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Karyawan
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
