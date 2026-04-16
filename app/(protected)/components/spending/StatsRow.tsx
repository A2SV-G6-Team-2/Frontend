"use client";

import { SpendingStatCard } from "./SpendingStatCard";
import type { StatCard } from "@/types/spending";

interface StatsRowProps {
  stats: StatCard[];
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <SpendingStatCard
          key={stat.id}
          data={stat}
        />
      ))}
    </div>
  );
}
