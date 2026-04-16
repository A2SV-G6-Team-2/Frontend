'use client';

import { useMemo } from 'react';
import { SpendingDashboard } from '@/app/(protected)/components/spending/SpendingDashboard';
import { useExpenses } from '@/lib/api/hooks/useExpenses';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useProfile } from '@/lib/api/hooks/useUser';
import { useWeeklyReport, useMonthlyReport } from '@/lib/api/hooks/useReports';
import type { SpendingDashboardData } from '@/types/spending';
import { getCategoryColor } from '@/lib/utils/colors';

function toLocalISODate(d: Date) {
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().split('T')[0] ?? '';
}

export default function SpendingPage() {
  const { data: profile } = useProfile();
  const currency = profile?.default_currency ?? 'ETB';

  // Calculate date ranges
  const dateRanges = useMemo(() => {
    const now = new Date();

    // Current week
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Last 30 days for expenses
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      week: {
        start: toLocalISODate(startOfWeek),
        end: toLocalISODate(endOfWeek),
      },
      thirtyDays: {
        from_date: toLocalISODate(thirtyDaysAgo),
        to_date: toLocalISODate(now),
      },
      month: {
        start: toLocalISODate(startOfMonth),
        end: toLocalISODate(endOfMonth),
        param: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      },
    };
  }, []);

  // Fetch data
  const { data: categories } = useCategories();
  const { data: weeklyReport, isLoading: loadingWeekly } = useWeeklyReport(dateRanges.week.start, dateRanges.week.end);
  const { data: monthlyReport, isLoading: loadingMonthly } = useMonthlyReport(dateRanges.month.param);
  const { data: expenses, isLoading: loadingExpenses } = useExpenses(dateRanges.thirtyDays);

  // Transform data into dashboard format
  const dashboardData: SpendingDashboardData | undefined = useMemo(() => {
    if (!expenses || !categories || !weeklyReport) return undefined;

    const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
    const categoryColors = new Map(categories.map(cat => [cat.name, getCategoryColor(cat.name)]));

    // Calculate stats
    const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const avgPerDay = totalSpent / 30; // Last 30 days

    // Find top category
    const categoryTotals = new Map<string, number>();
    expenses.forEach(exp => {
      const catId = exp.category_id || 'uncategorized';
      const catName = categoryMap.get(catId) || 'Uncategorized';
      categoryTotals.set(catName, (categoryTotals.get(catName) || 0) + (exp.amount || 0));
    });

    const topCategory = Array.from(categoryTotals.entries())
      .sort(([,a], [,b]) => b - a)[0];

    // Calculate daily spending for the current week
    const weekStart = new Date(dateRanges.week.start);
    const weekEnd = new Date(dateRanges.week.end);
    const dailyTotals = new Map<string, number>();
    
    expenses.forEach(exp => {
      const expDate = new Date(exp.expense_date || exp.created_at || '');
      if (expDate >= weekStart && expDate <= weekEnd) {
        const dayKey = expDate.toISOString().split('T')[0] ?? '';
        dailyTotals.set(dayKey, (dailyTotals.get(dayKey) || 0) + (exp.amount || 0));
      }
    });

    const weeklyData = Array.from(dailyTotals.entries()).map(([date, amount]) => ({
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      date,
      amount,
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Calculate weekly spending for the last 4 weeks
    const monthlyData: { day: string; date: string; amount: number }[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7) - 6);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      let weekTotal = 0;
      expenses.forEach(exp => {
        const expDate = new Date(exp.expense_date || exp.created_at || '');
        if (expDate >= weekStart && expDate <= weekEnd) {
          weekTotal += exp.amount || 0;
        }
      });
      
      monthlyData.push({
        day: `W${4 - i}`,
        date: weekStart.toISOString().split('T')[0] ?? '',
        amount: weekTotal,
      });
    }

    // Category breakdown
    const reportCategories = weeklyReport.WeeklyReport?.category_breakdown?.map(cat => {
      const total = cat.total || 0;
      const totalExpense = weeklyReport.WeeklyReport?.total_expense || 1;
      const percentage = Math.round((total / totalExpense) * 100);
      const colorInfo = categoryColors.get(cat.category_name || '') || { hex: '#9CA3AF', classes: '' };

      return {
        id: cat.category_name || 'unknown',
        name: cat.category_name || 'Unknown',
        amount: total,
        percentage,
        color: colorInfo.hex,
        trend: { value: 0, direction: 'neutral' as const }, // Simplified
      };
    }) || [];

    const fallbackCategories = Array.from(categoryTotals.entries())
      .map(([name, amount]) => {
        const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
        const colorInfo = categoryColors.get(name) || { hex: '#9CA3AF', classes: '' };
        return {
          id: name,
          name,
          amount,
          percentage,
          color: colorInfo.hex,
          trend: { value: 0, direction: 'neutral' as const },
        };
      })
      .sort((a, b) => b.amount - a.amount);

    const categoriesData = reportCategories.length > 0 ? reportCategories : fallbackCategories;

    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);

    return {
      stats: [
        {
          id: 'total-spent',
          icon: 'IconCash',
          title: 'Total Spent',
          value: formatCurrency(totalSpent),
          subtitle: 'Last 30 days',
          badge: { label: 'Current period', status: 'consistent' },
          trend: { value: 0, direction: 'neutral' },
        },
        {
          id: 'avg-per-day',
          icon: 'IconCalendar',
          title: 'Avg Per Day',
          value: formatCurrency(avgPerDay),
          subtitle: 'Based on last 30 days',
          badge: { label: 'Consistent', status: 'consistent' },
          trend: { value: 0, direction: 'neutral' },
        },
        {
          id: 'top-category',
          icon: 'IconToolsKitchen2',
          title: 'Top Category',
          value: topCategory ? topCategory[0] : 'None',
          subtitle: topCategory ? `${Math.round((topCategory[1] / totalSpent) * 100)}% of total` : 'No expenses',
          badge: { label: 'High Spend', status: 'high_spend' },
          trend: { value: 0, direction: 'up' },
        },
      ],
      weeklyData,
      monthlyData,
      categories: categoriesData,
    };
  }, [expenses, categories, weeklyReport, dateRanges, currency]);

  const isLoading = loadingExpenses || loadingWeekly || loadingMonthly;

  // Provide fallback data when API data is not available
  const fallbackData: SpendingDashboardData = {
    stats: [
      {
        id: 'total-spent',
        icon: 'IconCash',
        title: 'Total Spent',
        value: '$0.00',
        subtitle: 'No data available',
        badge: { label: 'No data', status: 'consistent' },
        trend: { value: 0, direction: 'neutral' },
      },
      {
        id: 'avg-per-day',
        icon: 'IconCalendar',
        title: 'Avg Per Day',
        value: '$0.00',
        subtitle: 'No data available',
        badge: { label: 'No data', status: 'consistent' },
        trend: { value: 0, direction: 'neutral' },
      },
      {
        id: 'top-category',
        icon: 'IconToolsKitchen2',
        title: 'Top Category',
        value: 'None',
        subtitle: 'No expenses recorded',
        badge: { label: 'No data', status: 'consistent' },
        trend: { value: 0, direction: 'neutral' },
      },
    ],
    weeklyData: [],
    monthlyData: [],
    categories: [],
  };

  return <SpendingDashboard data={dashboardData || fallbackData} isLoading={isLoading} />;
}
