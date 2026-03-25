"use client";

import {
  IconTrendingUp,
  IconTrendingDown,
  IconAlertCircle,
  IconCircleCheck,
  IconBulb,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AIInsight } from "@/types/spending";
import { cn } from "@/lib/utils";

// ─── Icon map ─────────────────────────────────────────────────────────────────
const INSIGHT_ICONS = {
  trending_up: IconTrendingUp,
  trending_down: IconTrendingDown,
  alert: IconAlertCircle,
  check: IconCircleCheck,
} as const;

// ─── Single Insight Row ───────────────────────────────────────────────────────
function InsightRow({ insight }: { insight: AIInsight }) {
  const Icon = INSIGHT_ICONS[insight.icon];
  const iconColor =
    insight.icon === "trending_up"
      ? "text-orange-300"
      : insight.icon === "trending_down"
      ? "text-green-300"
      : insight.icon === "check"
      ? "text-green-300"
      : "text-yellow-300";

  return (
    <div className="flex gap-3 items-start">
      <div className="mt-0.5 flex-shrink-0">
        <Icon size={18} className={iconColor} />
      </div>
      <p className="text-sm text-white/80 leading-relaxed">
        {insight.highlight ? (
          <>
            <span className="font-semibold text-white">{insight.highlight} </span>
            {insight.text.replace(insight.highlight, "").trim()}
          </>
        ) : (
          insight.text
        )}
      </p>
    </div>
  );
}

// ─── AI Insights Panel ────────────────────────────────────────────────────────
interface AIInsightsPanelProps {
  insights: AIInsight[];
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="bg-white/20 rounded-xl p-2">
            <IconBulb size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">AI Insights</span>
        </div>

        {/* Insight rows */}
        <div className="flex flex-col gap-4">
          {insights.map((insight) => (
            <InsightRow key={insight.id} insight={insight} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
