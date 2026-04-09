'use client';

import type { SpendingDashboardData } from '@/types/spending';
import {
  StatsRow,
  SpendingChart,
  CategoryBreakdownPanel,
  AIInsightsPanel,
} from '@/app/(protected)/components/spending';
import { Skeleton } from '@/components/ui/skeleton';

interface SpendingDashboardProps {
  data: SpendingDashboardData;
  isLoading?: boolean;
}

export function SpendingDashboard({ data, isLoading }: SpendingDashboardProps) {
  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 py-2 sm:p-6 lg:p-8">
      <div className="sm:max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Spending Trends
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Keep track of your daily cash flows and habits
          </p>
        </div>
        <StatsRow stats={data.stats} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          <SpendingChart
            weeklyData={data.weeklyData}
            monthlyData={data.monthlyData}
          />
          <CategoryBreakdownPanel categories={data.categories} />
        </div>
        <AIInsightsPanel insights={data.insights} />
      </div>
    </div>
  );
}
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    </div>
  );
}
