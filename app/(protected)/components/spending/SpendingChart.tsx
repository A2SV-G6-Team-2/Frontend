"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { SpendingDataPoint, TimeRange } from "@/types/spending";
import { cn } from "@/lib/utils";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
      <span className="font-semibold">{label}: </span>
      <span>${payload[0].value.toFixed(2)}</span>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface SpendingChartProps {
  weeklyData: SpendingDataPoint[];
  monthlyData: SpendingDataPoint[];
}

export function SpendingChart({ weeklyData, monthlyData }: SpendingChartProps) {
  const [range, setRange] = useState<TimeRange>("weekly");
  const data = range === "weekly" ? weeklyData : monthlyData;

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Spending Over Time</CardTitle>
            <CardDescription className="text-sm text-gray-400 mt-0.5">
              Monitor your daily cash flow
            </CardDescription>
          </div>
          <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1">
            {(["weekly", "monthly"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 capitalize",
                  range === r
                    ? "bg-white text-violet-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pr-4">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `$${v}`}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              domain={[0, "dataMax + 10"]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#7C3AED20", strokeWidth: 2 }} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#7C3AED"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#7C3AED", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#7C3AED", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
