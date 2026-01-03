// src/app/dashboard/employees/page.tsx

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import {
  EmployeeForm,
  EmployeeFormValues,
} from "@/components/employees/EmployeeForm";
import { DeleteEmployeeDialog } from "@/components/employees/DeleteEmployeeDialog";
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
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "@/lib/types/employee";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { employeesApi } from "@/src/lib/api/employees";
import { ApiError } from "next/dist/server/api-utils";

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [clockInStatus, setClockInStatus] = useState<string | undefined>(
    undefined
  );

  // Fetch employees
  const { data, isLoading } = useQuery({
    queryKey: ["employees", page, search, categoryFilter],
    queryFn: () =>
      employeesApi.getAll({
        page,
        limit: 10,
        search,
        category: categoryFilter,
      }),
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: employeesApi.getCategories,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateEmployeeDto) => employeesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setCreateDialogOpen(false);
      toast.success("Karyawan berhasil ditambahkan!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menambahkan karyawan");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeDto }) =>
      employeesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEditDialogOpen(false);
      setSelectedEmployee(null);
      toast.success("Karyawan berhasil diperbarui!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal memperbarui karyawan");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
      toast.success("Karyawan berhasil dihapus!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Gagal menghapus karyawan");
    },
  });

  const handleCreateSubmit = async (formData: EmployeeFormValues) => {
    await createMutation.mutateAsync(formData as CreateEmployeeDto);
  };

  const handleEditSubmit = async (formData: EmployeeFormValues) => {
    if (!selectedEmployee) return;
    await updateMutation.mutateAsync({
      id: selectedEmployee._id,
      data: formData,
    });
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    await deleteMutation.mutateAsync(selectedEmployee._id);
  };

  if (isLoading) {
    return <EmployeesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Karyawan</h1>
          <p className="text-muted-foreground">
            Kelola data karyawan dan informasi mereka
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Karyawan
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau ID karyawan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={clockInStatus}
          onValueChange={(value) =>
            setClockInStatus(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="ontime">Tepat Waktu</SelectItem>
            <SelectItem value="late">Terlambat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Total Karyawan
          </p>
          <p className="text-2xl font-bold">
            {data?.pagination.totalData || 0}
          </p>
        </div>
        {categories.map((category) => {
          const count =
            data?.data.filter((emp) => emp.category._id === category._id)
              .length || 0;
          return (
            <div key={category._id} className="rounded-lg border bg-card p-4">
              <p className="text-sm font-medium text-muted-foreground">
                {category.name}
              </p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <EmployeeTable
        employees={data?.data || []}
        onEdit={(employee) => {
          setSelectedEmployee(employee);
          setEditDialogOpen(true);
        }}
        onDelete={(employee) => {
          setSelectedEmployee(employee);
          setDeleteDialogOpen(true);
        }}
        onView={(employee) => {
          // Navigate to detail page (we'll create this later)
          window.location.href = `/employees/${employee._id}`;
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
            {[...Array(data.pagination.totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
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

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Karyawan Baru</DialogTitle>
            <DialogDescription>
              Isi form di bawah untuk menambahkan karyawan baru
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            categories={categories}
            onSubmit={handleCreateSubmit}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Karyawan</DialogTitle>
            <DialogDescription>
              Ubah informasi karyawan di bawah ini
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm
              employee={selectedEmployee}
              categories={categories}
              onSubmit={handleEditSubmit}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteEmployeeDialog
        employee={selectedEmployee}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

function EmployeesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 flex-1 max-w-sm" />
        <Skeleton className="h-10 w-50" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}
