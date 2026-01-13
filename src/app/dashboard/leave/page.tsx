// src/app/dashboard/leave/page.tsx

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { LeaveStatusBadge } from "@/components/leave/LeaveStatusBadge";
import { LeaveCategoryBadge } from "@/components/leave/LeaveCategoryBadge";
import { LeaveStatsCards } from "@/components/leave/LeaveStatsCards";
import { SimplePagination } from "@/components/ui/simple-pagination";

import { useLeaveManagement } from "@/hooks/useLeaveManagement";
import type { LeaveRequest, LeaveRequestStatus } from "@/lib/types/leave";

export default function AdminLeavePage() {
  const {
    leaveRequests,
    leaveStats,
    leaveTypes,
    pagination,
    isLoadingRequests,
    page,
    setPage,
    filters,
    setFilters,
    approveRequest,
    rejectRequest,
    isApproving,
    isRejecting,
  } = useLeaveManagement();

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "view" | null
  >(null);
  const [actionNote, setActionNote] = useState("");

  // Handle approve
  const handleApprove = async () => {
    if (!selectedRequest) return;
    await approveRequest({ id: selectedRequest._id, note: actionNote });
    closeDialog();
  };

  // Handle reject
  const handleReject = async () => {
    if (!selectedRequest || !actionNote.trim()) return;
    await rejectRequest({ id: selectedRequest._id, note: actionNote });
    closeDialog();
  };

  // Close dialog
  const closeDialog = () => {
    setSelectedRequest(null);
    setActionType(null);
    setActionNote("");
  };

  // Open action dialog
  const openAction = (
    request: LeaveRequest,
    type: "approve" | "reject" | "view"
  ) => {
    setSelectedRequest(request);
    setActionType(type);
    setActionNote("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Pengajuan Cuti & Izin
        </h1>
        <p className="text-muted-foreground">
          Kelola pengajuan cuti dan izin karyawan
        </p>
      </div>

      {/* Stats */}
      <LeaveStatsCards stats={leaveStats} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value as LeaveRequestStatus,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.leaveType || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  leaveType: value === "all" ? undefined : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                {leaveTypes.map((type) => (
                  <SelectItem key={type._id} value={type._id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Dari tanggal"
              value={filters.startDate || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />

            <Input
              type="date"
              placeholder="Sampai tanggal"
              value={filters.endDate || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoadingRequests ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Tidak ada pengajuan ditemukan
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Karyawan</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Diajukan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.user.employeeId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <LeaveCategoryBadge
                          category={request.leaveType.category}
                        />
                        <span className="text-sm">
                          {request.leaveType.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(request.startDate), "d MMM", {
                          locale: id,
                        })}
                        {request.startDate !== request.endDate && (
                          <>
                            {" - "}
                            {format(new Date(request.endDate), "d MMM", {
                              locale: id,
                            })}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{request.totalDays} hari</TableCell>
                    <TableCell>
                      <LeaveStatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(request.createdAt), "d MMM yyyy", {
                        locale: id,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openAction(request, "view")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => openAction(request, "approve")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => openAction(request, "reject")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <SimplePagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Action Dialog */}
      <Dialog
        open={!!selectedRequest && !!actionType}
        onOpenChange={closeDialog}
      >
        <DialogContent className="max-w-lg">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {actionType === "view" && "Detail Pengajuan"}
                  {actionType === "approve" && "Setujui Pengajuan"}
                  {actionType === "reject" && "Tolak Pengajuan"}
                </DialogTitle>
                <DialogDescription>
                  {selectedRequest.requestNumber}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Request Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Karyawan</p>
                    <p className="font-medium">{selectedRequest.user.name}</p>
                    <p className="text-muted-foreground">
                      {selectedRequest.user.employeeId}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Jenis</p>
                    <div className="flex items-center gap-2">
                      <LeaveCategoryBadge
                        category={selectedRequest.leaveType.category}
                      />
                      <span className="font-medium">
                        {selectedRequest.leaveType.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tanggal</p>
                    <p className="font-medium">
                      {format(
                        new Date(selectedRequest.startDate),
                        "d MMMM yyyy",
                        {
                          locale: id,
                        }
                      )}
                      {selectedRequest.startDate !==
                        selectedRequest.endDate && (
                        <>
                          {" - "}
                          {format(
                            new Date(selectedRequest.endDate),
                            "d MMMM yyyy",
                            {
                              locale: id,
                            }
                          )}
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Durasi</p>
                    <p className="font-medium">
                      {selectedRequest.totalDays} hari
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Alasan</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {selectedRequest.reason}
                  </p>
                </div>

                {/* Attachment */}
                {selectedRequest.attachmentUrl && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Lampiran
                    </p>
                    <a
                      href={selectedRequest.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Lihat Lampiran
                    </a>
                  </div>
                )}

                {/* Action Note */}
                {(actionType === "approve" || actionType === "reject") && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Catatan{" "}
                      {actionType === "reject" && (
                        <span className="text-red-500">*</span>
                      )}
                    </p>
                    <Textarea
                      placeholder={
                        actionType === "approve"
                          ? "Catatan (opsional)..."
                          : "Alasan penolakan (wajib)..."
                      }
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  {actionType === "view" ? "Tutup" : "Batal"}
                </Button>
                {actionType === "approve" && (
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isApproving ? "Menyetujui..." : "Setujui"}
                  </Button>
                )}
                {actionType === "reject" && (
                  <Button
                    onClick={handleReject}
                    disabled={isRejecting || !actionNote.trim()}
                    variant="destructive"
                  >
                    {isRejecting ? "Menolak..." : "Tolak"}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
