import type {
  SpendingDashboardData,
  StatCard,
  SpendingDataPoint,
  CategoryBreakdown,
  AIInsight,
} from '@/types/spending';

export const mockStatCards: StatCard[] = [
  {
    id: 'total-spent',
    icon: 'IconCash',
    title: 'Total Spent',
    value: '$35.70',
    subtitle: 'Average Daily Spending',
    badge: { label: '-5% vs last month', status: 'low_spend' },
    trend: { value: -5, direction: 'down' },
  },
  {
    id: 'avg-per-day',
    icon: 'IconCalendar',
    title: 'Avg Per Day',
    value: '$15.20',
    subtitle: 'Based on the last 30 days',
    badge: { label: 'Consistent', status: 'consistent' },
    trend: { value: 0, direction: 'neutral' },
  },
  {
    id: 'top-category',
    icon: 'IconToolsKitchen2',
    title: 'Top Category',
    value: 'Food & Drinks',
    subtitle: '42% of total expenses',
    badge: { label: 'High Spend', status: 'high_spend' },
    trend: { value: 8, direction: 'up' },
  },
];

export const mockWeeklyData: SpendingDataPoint[] = [
  { day: 'MON', date: '2026-03-18', amount: 10 },
  { day: 'TUE', date: '2026-03-19', amount: 38.5 },
  { day: 'WED', date: '2026-03-20', amount: 22 },
  { day: 'THU', date: '2026-03-21', amount: 49 },
  { day: 'FRI', date: '2026-03-22', amount: 12 },
  { day: 'SAT', date: '2026-03-23', amount: 35 },
  { day: 'SUN', date: '2026-03-24', amount: 23 },
];

export const mockMonthlyData: SpendingDataPoint[] = [
  { day: 'W1', date: '2026-03-01', amount: 180 },
  { day: 'W2', date: '2026-03-08', amount: 240 },
  { day: 'W3', date: '2026-03-15', amount: 195 },
  { day: 'W4', date: '2026-03-22', amount: 210 },
];

export const mockCategories: CategoryBreakdown[] = [
  {
    id: 'food',
    name: 'Food & Drink',
    amount: 189,
    percentage: 42,
    color: '#F59E0B',
    trend: { value: -8, direction: 'down' },
  },
  {
    id: 'transport',
    name: 'Transport',
    amount: 95,
    percentage: 21,
    color: '#3B82F6',
    trend: { value: 3, direction: 'up' },
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    amount: 78.5,
    percentage: 17,
    color: '#EC4899',
    trend: { value: 0, direction: 'neutral' },
    status: 'On Track',
  },
  {
    id: 'supplies',
    name: 'Supplies',
    amount: 52.5,
    percentage: 12,
    color: '#10B981',
    trend: { value: -7, direction: 'down' },
  },
  {
    id: 'others',
    name: 'Others',
    amount: 35,
    percentage: 8,
    color: '#9CA3AF',
    trend: { value: 0, direction: 'neutral' },
  },
];

export const mockInsights: AIInsight[] = [
  {
    id: '1',
    icon: 'trending_up',
    text: "Food spending is 12% above last week. You've hit your daily limit for dining out three times this week. Consider meal prepping to cut costs.",
    highlight: 'Food spending is 12% above last week.',
  },
  {
    id: '2',
    icon: 'trending_down',
    text: 'Transport costs dropped 8% compared to last month — great job optimizing your commute!',
    highlight: 'Transport costs dropped 8%',
  },
  {
    id: '3',
    icon: 'check',
    text: 'Entertainment is on track. You have $21.50 left in your monthly budget.',
    highlight: 'Entertainment is on track.',
  },
];

export const mockDashboardData: SpendingDashboardData = {
  stats: mockStatCards,
  weeklyData: mockWeeklyData,
  monthlyData: mockMonthlyData,
  categories: mockCategories,
  insights: mockInsights,
};
