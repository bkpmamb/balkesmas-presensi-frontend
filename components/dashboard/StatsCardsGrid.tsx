// components/dashboard/StatsCardsGrid.tsx

import { StatsCard } from "@/components/dashboard/StatsCard";
import type { StatCardConfig, DashboardStats } from "@/lib/types/dashboard";

interface StatsCardsGridProps {
  cards: StatCardConfig[];
  stats: DashboardStats | undefined;
  gridClassName?: string;
}

export function StatsCardsGrid({
  cards,
  stats,
  gridClassName = "grid-cols-2 lg:grid-cols-4",
}: StatsCardsGridProps) {
  return (
    <div className={`grid gap-4 ${gridClassName}`}>
      {cards.map((card) => (
        <StatsCard
          key={card.title}
          title={card.title}
          value={card.getValue(stats)}
          description={card.getDescription(stats)}
          icon={card.icon}
          className={card.className}
        />
      ))}
    </div>
  );
}
