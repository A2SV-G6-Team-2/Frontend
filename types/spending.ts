export type TrendDirection = 'up' | 'down' | 'neutral';
export type BudgetStatus =
  | 'on_track'
  | 'high_spend'
  | 'consistent'
  | 'low_spend';
export type TimeRange = 'weekly' | 'monthly';

export interface StatBadge {
  label: string;
  status: BudgetStatus;
}

export interface StatCard {
  id: string;
  icon: string;
  title: string;
  value: string;
  subtitle: string;
  badge: StatBadge;
  trend?: {
    value: number;
    direction: TrendDirection;
  };
}

export interface SpendingDataPoint {
  day: string;
  date: string;
  amount: number;
}

export interface CategoryBreakdown {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  trend: {
    value: number;
    direction: TrendDirection;
  };
  status?: string;
}

export interface AIInsight {
  id: string;
  icon: 'trending_up' | 'trending_down' | 'alert' | 'check';
  text: string;
  highlight?: string;
}

export interface SpendingDashboardData {
  stats: StatCard[];
  weeklyData: SpendingDataPoint[];
  monthlyData: SpendingDataPoint[];
  categories: CategoryBreakdown[];
  insights: AIInsight[];
}
