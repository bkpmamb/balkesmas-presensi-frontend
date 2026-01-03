// src/app/dashboard/attendances/page.tsx

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendancesApi } from "@/src/lib/api/attendances";
import { employeesApi } from "@/src/lib/api/employees";
import { AttendanceTable } from "@/components/attendances/AttendanceTable";
import { ManualEntryForm } from "@/components/attendances/ManualEntryForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Search,
  Download,
  FileText,
  Filter,
  Calendar,
  Users,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  Attendance,
  ManualEntryDto,
  ManualEntryFormValues,
  Shift,
} from "@/lib/types/attendance";
import type { ApiError } from "@/lib/types/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";

export default function AttendancesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clockInStatus, setClockInStatus] = useState<string | undefined>(
    undefined
  );
  const [manualEntryDialogOpen, setManualEntryDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);
  const [exporting, setExporting] = useState(false);

  // Fetch attendances
  const { data, isLoading } = useQuery({
    queryKey: ["attendances", page, search, startDate, endDate, clockInStatus],
    queryFn: () =>
      attendancesApi.getAll({
        page,
        limit: 10,
        search,
        startDate,
        endDate,
        clockInStatus,
      }),
  });

  // Fetch employees for manual entry
  const { data: employeesData } = useQuery({
    queryKey: ["employees-all"],
    queryFn: () => employeesApi.getAll({ limit: 100 }),
  });

  // Fetch shifts for manual entry
  const { data: shifts = [] } = useQuery({
    queryKey: ["shifts"],
    queryFn: async () => {
      const { data } = await import("@/src/lib/api/client").then((m) =>
        m.default.get<{ success: boolean; data: Shift[] }>("/admin/shifts")
      );
      return data.data;
    },
  });

  // Create manual entry mutation
  const createManualEntryMutation = useMutation({
    mutationFn: (entry: ManualEntryDto) =>
      attendancesApi.createManualEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      setManualEntryDialogOpen(false);
      toast.success("Presensi manual berhasil ditambahkan!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menambahkan presensi manual");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => attendancesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      setDeleteDialogOpen(false);
      setSelectedAttendance(null);
      toast.success("Presensi berhasil dihapus!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menghapus presensi");
    },
  });

  const handleManualEntrySubmit = async (formData: ManualEntryFormValues) => {
    // Combine date and time
    const clockInDateTime = `${formData.date}T${formData.clockIn}:00.000Z`;
    const clockOutDateTime = formData.clockOut
      ? `${formData.date}T${formData.clockOut}:00.000Z`
      : undefined;

    const entry: ManualEntryDto = {
      userId: formData.userId,
      shiftId: formData.shiftId,
      date: formData.date,
      clockIn: clockInDateTime,
      clockOut: clockOutDateTime,
      notes: formData.notes,
    };

    await createManualEntryMutation.mutateAsync(entry);
  };

  const handleDelete = async () => {
    if (!selectedAttendance) return;
    await deleteMutation.mutateAsync(selectedAttendance._id);
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const blob = await attendancesApi.exportExcel({
        startDate,
        endDate,
        clockInStatus,
      });

      // Download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan_Presensi_${format(new Date(), "yyyyMMdd")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("File Excel berhasil diunduh!");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Gagal export ke Excel");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const blob = await attendancesApi.exportPDF({
        startDate,
        endDate,
        clockInStatus,
      });

      // Download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan_Presensi_${format(new Date(), "yyyyMMdd")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("File PDF berhasil diunduh!");
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Gagal export ke PDF");
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) {
    return <AttendancesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Presensi</h1>
          <p className="text-muted-foreground">Kelola data presensi karyawan</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={exporting}
          >
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={() => setManualEntryDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Entry Manual
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Presensi
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.summary.totalAttendances || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.pagination.totalData || 0} records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tepat Waktu</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data?.summary.totalOnTime || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.summary.totalAttendances
                ? Math.round(
                    (data.summary.totalOnTime / data.summary.totalAttendances) *
                      100
                  )
                : 0}
              % dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {data?.summary.totalLate || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.summary.totalAttendances
                ? Math.round(
                    (data.summary.totalLate / data.summary.totalAttendances) *
                      100
                  )
                : 0}
              % dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Belum Clock Out
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data?.summary.totalNotClockedOut || 0}
            </div>
            <p className="text-xs text-muted-foreground">Masih dalam shift</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama karyawan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-37.5"
            placeholder="Dari tanggal"
          />
          <span className="text-sm text-muted-foreground">s/d</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-37.5"
            placeholder="Sampai tanggal"
          />
        </div>

        <Select
          value={clockInStatus}
          onValueChange={(value) =>
            setClockInStatus(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-45">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="ontime">Tepat Waktu</SelectItem>
            <SelectItem value="late">Terlambat</SelectItem>
          </SelectContent>
        </Select>

        {(search || startDate || endDate || clockInStatus) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setStartDate("");
              setEndDate("");
              setClockInStatus("");
            }}
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Table */}
      <AttendanceTable
        attendances={data?.data || []}
        onView={(attendance) => {
          setSelectedAttendance(attendance);
          setViewDialogOpen(true);
        }}
        onDelete={(attendance) => {
          setSelectedAttendance(attendance);
          setDeleteDialogOpen(true);
        }}
      />

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                className={
                  !data.pagination.hasPrevPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {[...Array(Math.min(data.pagination.totalPages, 5))].map((_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setPage(pageNumber)}
                    isActive={page === pageNumber}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage(Math.min(data.pagination.totalPages, page + 1))
                }
                className={
                  !data.pagination.hasNextPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Manual Entry Dialog */}
      <Dialog
        open={manualEntryDialogOpen}
        onOpenChange={setManualEntryDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Presensi Manual</DialogTitle>
            <DialogDescription>
              Isi form di bawah untuk menambahkan presensi manual
            </DialogDescription>
          </DialogHeader>
          <ManualEntryForm
            employees={employeesData?.data || []}
            shifts={shifts}
            onSubmit={handleManualEntrySubmit}
            isLoading={createManualEntryMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* View Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Presensi</DialogTitle>
          </DialogHeader>
          {selectedAttendance && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Karyawan
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedAttendance.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAttendance.user.employeeId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Shift
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedAttendance.shift.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAttendance.shift.startTime} -{" "}
                    {selectedAttendance.shift.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tanggal
                  </p>
                  <p className="text-lg font-semibold">
                    {format(new Date(selectedAttendance.date), "dd MMMM yyyy", {
                      locale: id,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status Masuk
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedAttendance.clockInStatus === "ontime"
                      ? "Tepat Waktu"
                      : `Terlambat ${selectedAttendance.lateMinutes} menit`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Clock In
                  </p>
                  <p className="text-lg font-semibold">
                    {format(new Date(selectedAttendance.clockIn), "HH:mm:ss")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Clock Out
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedAttendance.clockOut
                      ? format(
                          new Date(selectedAttendance.clockOut),
                          "HH:mm:ss"
                        )
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Durasi Kerja
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedAttendance.workMinutes > 0
                      ? `${Math.floor(selectedAttendance.workMinutes / 60)}j ${
                          selectedAttendance.workMinutes % 60
                        }m`
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Entry Manual
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedAttendance.isManualEntry ? "Ya" : "Tidak"}
                  </p>
                </div>
              </div>

              {selectedAttendance.manualEntryNote && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Catatan Manual Entry
                  </p>
                  <p className="text-sm bg-gray-50 p-3 rounded">
                    {selectedAttendance.manualEntryNote}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Foto Clock In
                  </p>
                  <Image
                    src={selectedAttendance.photoUrl}
                    alt="Clock In"
                    className="rounded-lg border w-full object-cover"
                  />
                </div>
                {selectedAttendance.photoOutUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Foto Clock Out
                    </p>
                    <Image
                      src={selectedAttendance.photoOutUrl}
                      alt="Clock Out"
                      className="rounded-lg border w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Presensi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus presensi{" "}
              {selectedAttendance?.user.name} pada tanggal{" "}
              {selectedAttendance &&
                format(new Date(selectedAttendance.date), "dd MMM yyyy", {
                  locale: id,
                })}
              ? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AttendancesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}
