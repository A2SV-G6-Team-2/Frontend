"use client";

import {
  IconCash,
  IconCalendar,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StatCard } from "@/types/spending";
import { cn } from "@/lib/utils";

// ─── Icon Map ─────────────────────────────────────────────────────────────────
// Extend this map as new icon names are added to StatCard
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  IconCash,
  IconCalendar,
  IconToolsKitchen2,
};

// ─── Badge styling per status ─────────────────────────────────────────────────
const BADGE_STYLES = {
  low_spend: "bg-red-100 text-red-600 border-red-200",
  high_spend: "bg-orange-100 text-orange-600 border-orange-200",
  consistent: "bg-violet-100 text-violet-600 border-violet-200",
  on_track: "bg-green-100 text-green-600 border-green-200",
} as const;

const ICON_BG = {
  IconCash: "bg-red-100 text-red-500",
  IconCalendar: "bg-violet-100 text-violet-500",
  IconToolsKitchen2: "bg-orange-100 text-orange-500",
} as const;

interface StatCardProps {
  data: StatCard;
  /** Slot for date-picker or custom action (optional) */
  action?: React.ReactNode;
}

export function SpendingStatCard({ data, action }: StatCardProps) {
  const Icon = ICON_MAP[data.icon] ?? IconCash;
  const iconBg = ICON_BG[data.icon as keyof typeof ICON_BG] ?? "bg-gray-100 text-gray-500";
  const badgeStyle = BADGE_STYLES[data.badge.status] ?? "bg-gray-100 text-gray-600";

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5 flex flex-col gap-3">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className={cn("p-2.5 rounded-xl", iconBg)}>
            <Icon size={20} />
          </div>
          <Badge
            variant="outline"
            className={cn("text-xs font-semibold rounded-full px-3 py-1 border", badgeStyle)}
          >
            {data.badge.label}
          </Badge>
        </div>

        {/* Value block */}
        <div>
          <p className="text-sm text-gray-500 mb-0.5">{data.title}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight leading-none">
            {data.value}
          </p>
          <p className="text-xs text-gray-400 mt-1">{data.subtitle}</p>
        </div>

        {/* Optional action slot */}
        {action && <div className="mt-1">{action}</div>}
      </CardContent>
    </Card>
  );
}
