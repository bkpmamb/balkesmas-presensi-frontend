// components/settings/SettingsHeader.tsx

interface SettingsHeaderProps {
  title: string;
  description: string;
}

export function SettingsHeader({ title, description }: SettingsHeaderProps) {
  return (
    <div className="space-y-1 mb-6">
      {/* text-2xl di mobile (agar tidak memenuhi layar)
          md:text-3xl di layar medium/desktop
      */}
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
        {title}
      </h1>

      {/* text-sm di mobile agar lebih ringkas
          md:text-base di desktop
      */}
      <p className="text-sm text-muted-foreground md:text-base max-w-2xl">
        {description}
      </p>
    </div>
  );
}
