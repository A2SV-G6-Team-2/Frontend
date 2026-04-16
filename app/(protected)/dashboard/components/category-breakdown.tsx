"use client";

import React, { memo, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { SpendingPeriod } from '../types';
import { useExpenses } from '@/lib/api/hooks/useExpenses';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useProfile } from '@/lib/api/hooks/useUser';
import { getCategoryColor } from '@/lib/utils/colors';

interface CategoryBreakdownProps {
  activePeriod: SpendingPeriod;
  setActivePeriod: (period: SpendingPeriod) => void;
  className?: string;
}

// Custom function to draw the leader lines and text labels
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, payload, fill } = props;
  
  // Guard against missing coordinates during resize/init
  if (cx === undefined || cy === undefined) return null;

  const RADIAN = Math.PI / 180;
  const cos = Math.cos(-midAngle * RADIAN);
  const sin = Math.sin(-midAngle * RADIAN);
  
  // Calculate points for the broken line
  const startX = cx + outerRadius * cos;
  const startY = cy + outerRadius * sin;
  const midX = cx + (outerRadius + 15) * cos;
  const midY = cy + (outerRadius + 15) * sin;
  const endX = midX + (cos >= 0 ? 1 : -1) * 40;
  const endY = midY;
  
  const textAnchor = cos >= 0 ? 'start' : 'end';
  const textX = endX + (cos >= 0 ? 1 : -1) * 8;

  return (
    <g>
      {/* Connecting Line */}
      <path
        d={`M${startX},${startY} L${midX},${midY} L${endX},${endY}`}
        stroke={fill}
        strokeWidth={1}
        fill="none"
        opacity={0.6}
      />
      {/* Category Name */}
      <text 
        x={textX} 
        y={endY - 6} 
        textAnchor={textAnchor} 
        fill="#6b7280" 
        fontSize={11}
        className="select-none"
      >
        {payload.name}
      </text>
      {/* Percentage */}
      <text 
        x={textX} 
        y={endY + 10} 
        textAnchor={textAnchor} 
        fill={fill} 
        fontSize={11} 
        fontWeight={500}
        className="select-none"
      >
        {payload.percentage}%
      </text>
    </g>
  );
};

const CategoryBreakdown = memo(({ activePeriod, setActivePeriod, className = "" }: CategoryBreakdownProps) => {
  const { data: profile } = useProfile();
  const { data: categories } = useCategories();
  
  const now = new Date();
  const toLocalISO = (date: Date): string => {
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60 * 1000));
      return localDate.toISOString().split('T')[0] ?? "";
  };

  const dateRange = useMemo(() => {
      const end = toLocalISO(now);
      let start = end;

      if (activePeriod === 'Weekly') {
          const startOfWeek = new Date(now);
          const day = startOfWeek.getDay();
          const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
          startOfWeek.setDate(diff);
          start = toLocalISO(startOfWeek);
      } else if (activePeriod === 'Monthly') {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          start = toLocalISO(startOfMonth);
      }

      return { from_date: start, to_date: end };
  }, [activePeriod]);

  const { data: expenses, isLoading } = useExpenses(dateRange);

  const { chartData, totalAmount } = useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) return { chartData: [], totalAmount: 0 };

    const categoryMap = new Map<string, number>();
    let total = 0;

    expenses.forEach(exp => {
      const catId = exp.category_id || 'uncategorized';
      const amount = exp.amount || 0;
      categoryMap.set(catId, (categoryMap.get(catId) || 0) + amount);
      total += amount;
    });

    const data = Array.from(categoryMap.entries()).map(([catId, amount]) => {
      const category = Array.isArray(categories) ? categories.find(c => c.id === catId) : undefined;
      const name = category?.name || (catId === 'uncategorized' ? 'Other' : 'Unknown');
      const percentage = total > 0 ? Math.round((amount / total) * 100) : 0;
      const colorInfo = getCategoryColor(name) ?? { hex: "#3b82f6", classes: "" };
      
      return {
        name,
        value: amount,
        percentage,
        color: colorInfo.hex
      };
    }).sort((a, b) => b.value - a.value);

    return { chartData: data, totalAmount: total };
  }, [expenses, categories]);

  const formatCurrency = (val: number) => {
    const currency = profile?.default_currency || 'ETB';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className={`bg-white w-full rounded-xl shadow mt-5 p-4 flex flex-col min-h-[450px] ${className}`}>
      <div className="mb-6 flex w-full items-center flex-col gap-4 justify-center sm:justify-between sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold text-black">Category Breakdown</h2>

        {/* Segmented Control */}
        <div className="flex rounded-2xl bg-gray-100/80 p-1.5">
          {(['Daily', 'Weekly', 'Monthly'] as SpendingPeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-5 py-2 text-sm font-medium transition-all duration-200 rounded-xl focus:outline-none ${
                activePeriod === period
                  ? "bg-white text-accent shadow-sm font-semibold"
                  : "text-gray-400 hover:text-accent hover:bg-gray-200"
              } ${period === 'Daily' ? 'mr-1' : period === 'Monthly' ? 'ml-1' : ''}`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative flex-1 w-full min-h-[350px]">
        {/* Center Total Text */}
        {!isLoading && chartData.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 translate-y-[-10px]">
            <span className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}</span>
          </div>
        )}

        <div className="w-full h-full min-h-[350px]">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center text-gray-400 italic">
                Loading breakdown...
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-gray-400 italic">
                No data for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                  <PieChart>
                      <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius="35%"
                      outerRadius="65%"
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      animationDuration={500}
                      animationBegin={0}
                      >
                      {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      </Pie>
                  </PieChart>
              </ResponsiveContainer>
            )}
        </div>
      </div>
    </div>
  );
});

CategoryBreakdown.displayName = 'CategoryBreakdown';

export default CategoryBreakdown;
