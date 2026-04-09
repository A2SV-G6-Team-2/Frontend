"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryBreakdown } from "@/types/spending";
import { cn } from "@/lib/utils";

// ─── Individual Category Row ──────────────────────────────────────────────────
function CategoryRow({ item }: { item: CategoryBreakdown }) {
  const isPositive = item.trend.direction === "up";
  const isNeutral = item.trend.direction === "neutral";

  const trendLabel =
    item.status ?? (isNeutral ? "On Track" : `${isPositive ? "+" : ""}${item.trend.value}% vs month avg`);

  const trendColor = item.status
    ? "text-gray-400"
    : isNeutral
    ? "text-gray-400"
    : isPositive
    ? "text-green-500"
    : "text-red-500";

  return (
    <div className="flex flex-col gap-1.5">
      {/* Name + amount */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm font-semibold text-gray-800">{item.name}</span>
        </div>
        <span className="text-sm font-bold text-gray-900">${item.amount.toFixed(2)}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
        />
      </div>

      {/* Sub-row: % + trend */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{item.percentage}% of budget</span>
        <span className={cn("text-xs font-medium", trendColor)}>{trendLabel}</span>
      </div>
    </div>
  );
}

// ─── Category Breakdown Panel ─────────────────────────────────────────────────
interface CategoryBreakdownProps {
  categories: CategoryBreakdown[];
}

export function CategoryBreakdownPanel({ categories }: CategoryBreakdownProps) {
  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-900">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 pt-0">
        {categories.map((cat) => (
          <CategoryRow key={cat.id} item={cat} />
        ))}
      </CardContent>
    </Card>
  );
}
