"use client";

import { SpendingStatCard } from "./SpendingStatCard";
import type { StatCard } from "@/types/spending";
import { Button } from "@/components/ui/button";
import { IconCalendar } from "@tabler/icons-react";

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
          // Slot in a "Select Dates" button only for the avg-per-day card
          action={
            stat.id === "avg-per-day" ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs gap-1.5 text-gray-500 border-gray-200"
              >
                <IconCalendar size={13} />
                Select Dates
              </Button>
            ) : undefined
          }
        />
      ))}
    </div>
  );
}
