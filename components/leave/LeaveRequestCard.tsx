// components/leave/LeaveRequestCard.tsx

"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Calendar,
  Clock,
  FileText,
  MoreVertical,
  X,
  ExternalLink,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { LeaveStatusBadge } from "./LeaveStatusBadge";
import { LeaveCategoryBadge } from "./LeaveCategoryBadge";

import type { LeaveRequest } from "@/lib/types/leave";

interface LeaveRequestCardProps {
  request: LeaveRequest;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
}

export function LeaveRequestCard({
  request,
  onCancel,
  isCancelling,
}: LeaveRequestCardProps) {
  const canCancel = request.status === "pending" && onCancel;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LeaveCategoryBadge category={request.leaveType.category} />
              <span className="font-semibold">{request.leaveType.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {request.requestNumber}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LeaveStatusBadge status={request.status} />
            {canCancel && (
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-red-600">
                        <X className="mr-2 h-4 w-4" />
                        Batalkan
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Batalkan Pengajuan?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Pengajuan {request.leaveType.name} untuk tanggal{" "}
                      {format(new Date(request.startDate), "d MMM yyyy", {
                        locale: id,
                      })}{" "}
                      akan dibatalkan. Tindakan ini tidak dapat diurungkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onCancel(request._id)}
                      disabled={isCancelling}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isCancelling ? "Membatalkan..." : "Ya, Batalkan"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Dates */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(request.startDate), "d MMM yyyy", { locale: id })}
            {request.startDate !== request.endDate && (
              <>
                {" - "}
                {format(new Date(request.endDate), "d MMM yyyy", {
                  locale: id,
                })}
              </>
            )}
          </span>
          <span className="text-muted-foreground">
            ({request.totalDays} hari)
          </span>
        </div>

        {/* Reason */}
        <div className="flex items-start gap-2 text-sm">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-muted-foreground line-clamp-2">{request.reason}</p>
        </div>

        {/* Attachment */}
        {request.attachmentUrl && (
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <a
              href={request.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Lihat Lampiran
            </a>
          </div>
        )}

        {/* Approval Info */}
        {request.status !== "pending" && request.approvedBy && (
          <div className="pt-2 border-t text-sm text-muted-foreground">
            <p>
              {request.status === "approved" ? "Disetujui" : "Ditolak"} oleh{" "}
              <span className="font-medium">{request.approvedBy.name}</span>
            </p>
            {request.approvalNote && (
              <p className="mt-1 italic">&apos;{request.approvalNote}&apos;</p>
            )}
          </div>
        )}

        {/* Submitted Time */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            Diajukan:{" "}
            {format(new Date(request.createdAt), "d MMM yyyy, HH:mm", {
              locale: id,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
