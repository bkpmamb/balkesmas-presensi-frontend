// src/app/dashboard/settings/page.tsx

"use client";

import {
  GPSSettings,
  CategoryManager,
  SystemInfo,
  SettingsGuide,
  SettingsSkeleton,
  SettingsError,
  SettingsHeader,
} from "@/components/settings";
import { useSettings } from "@/hooks/useSettings";

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
      <SettingsHeader
        title="Pengaturan"
        description="Kelola konfigurasi aplikasi presensi"
      />

      <SystemInfo categoriesCount={categories.length} />

      <GPSSettings
        settings={settings}
        onSubmit={handleUpdateSettings}
        isLoading={isSettingsUpdating}
      />

      <CategoryManager
        categories={categories}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
        isLoading={isCategoryMutating}
      />

      <SettingsGuide />
    </div>
  );
}
