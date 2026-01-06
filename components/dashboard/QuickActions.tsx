// components/dashboard/QuickActions.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { QuickAction } from "@/lib/types/dashboard";

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Aksi Cepat</h3>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {actions.map((action) => (
          <Button
            key={`${action.href}-${action.label}`}
            asChild
            variant="outline"
            className="h-20"
          >
            <Link href={action.href}>
              <div className="text-center">
                <action.icon className="mx-auto mb-2 h-6 w-6" />
                <span className="text-sm">{action.label}</span>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
