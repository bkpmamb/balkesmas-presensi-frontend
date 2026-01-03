// components/settings/SettingsError.tsx

interface SettingsErrorProps {
  message?: string;
}

export function SettingsError({
  message = "Gagal memuat pengaturan",
}: SettingsErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-120">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
