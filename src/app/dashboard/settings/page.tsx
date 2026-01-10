// src/app/dashboard/settings/page.tsx

"use client";

import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ✅ Components yang load segera
import {
  SettingsHeader,
  SettingsSkeleton,
  SettingsError,
} from "@/components/settings";

// ✅ Lazy load heavy components
const SystemInfo = lazy(() =>
  import("@/components/settings").then((mod) => ({
    default: mod.SystemInfo,
  }))
);
const GPSSettings = lazy(() =>
  import("@/components/settings").then((mod) => ({
    default: mod.GPSSettings,
  }))
);
const CategoryManager = lazy(() =>
  import("@/components/settings").then((mod) => ({
    default: mod.CategoryManager,
  }))
);
const SettingsGuide = lazy(() =>
  import("@/components/settings").then((mod) => ({
    default: mod.SettingsGuide,
  }))
);

import { useSettings } from "@/hooks/useSettings";

// ✅ Skeleton fallbacks
function SystemInfoSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function GPSSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );
}

function CategoryManagerSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsGuideSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-6 w-6 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const {
    settings,
    categories,
    isLoading,
    isSettingsUpdating,
    isCategoryMutating,
    handleUpdateSettings,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  } = useSettings();

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  if (!settings) {
    return <SettingsError />;
  }

  return (
    <div className="space-y-6">
      {/* ✅ Header - load segera */}
      <SettingsHeader
        title="Pengaturan"
        description="Kelola konfigurasi aplikasi presensi"
      />

      {/* ✅ Lazy: System Info */}
      <Suspense fallback={<SystemInfoSkeleton />}>
        <SystemInfo categoriesCount={categories.length} />
      </Suspense>

      {/* ✅ Lazy: GPS Settings */}
      <Suspense fallback={<GPSSettingsSkeleton />}>
        <GPSSettings
          settings={settings}
          onSubmit={handleUpdateSettings}
          isLoading={isSettingsUpdating}
        />
      </Suspense>

      {/* ✅ Lazy: Category Manager (heaviest) */}
      <Suspense fallback={<CategoryManagerSkeleton />}>
        <CategoryManager
          categories={categories}
          onCreate={handleCreateCategory}
          onUpdate={handleUpdateCategory}
          onDelete={handleDeleteCategory}
          isLoading={isCategoryMutating}
        />
      </Suspense>

      {/* ✅ Lazy: Settings Guide */}
      <Suspense fallback={<SettingsGuideSkeleton />}>
        <SettingsGuide />
      </Suspense>
    </div>
  );
}
