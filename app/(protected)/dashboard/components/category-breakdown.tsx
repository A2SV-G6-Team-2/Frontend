"use client";

import React, { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { SpendingPeriod } from '../types';
import { categoryBreakdownData } from '../constants';

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
  const currentBreakdown = categoryBreakdownData[activePeriod];
  
  const chartData = currentBreakdown.items.map(item => ({
    ...item,
    value: (currentBreakdown.total * item.percentage) / 100
  }));

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
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="text-xl font-bold text-gray-900">${currentBreakdown.total}</span>
        </div>

        <div className="w-full h-full min-h-[350px]">
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
        </div>
      </div>
    </div>
  );
});

CategoryBreakdown.displayName = 'CategoryBreakdown';

export default CategoryBreakdown;
