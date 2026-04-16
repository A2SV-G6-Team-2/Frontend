import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import type { components } from '../schema';

type WeeklyReport = components['schemas']['WeeklyReport'];

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

function extractData<T>(response: any): T {
  if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
    // For paginated responses, data has an 'items' property
    if (response.data && typeof response.data === 'object' && 'items' in response.data) {
      return response.data.items as T;
    }
    // For non-paginated responses, data is the actual response
    return response.data as T;
  }
  return response as T;
}

export const useWeeklyReport = (start: string, end: string) => {
  return useQuery({
    queryKey: ['reports', 'weekly', start, end],
    queryFn: async () => {
      const { data: responseBody } = await apiClient.get<{WeeklyReport: WeeklyReport; Insight: string} | ApiResponse<{WeeklyReport: WeeklyReport; Insight: string}>>('/reports/weekly', {
        params: { start, end },
      });
      return extractData<{WeeklyReport: WeeklyReport; Insight: string}>(responseBody);
    },
    enabled: !!start && !!end,
  });
};

export const useMonthlyReport = (month: string) => {
  return useQuery({
    queryKey: ['reports', 'monthly', month],
    queryFn: async () => {
      const { data: responseBody } = await apiClient.get<{MonthlyReport: components['schemas']['MonthlyReport']; Insight: string} | ApiResponse<{MonthlyReport: components['schemas']['MonthlyReport']; Insight: string}>>('/reports/monthly', {
        params: { month },
      });
      return extractData<{MonthlyReport: components['schemas']['MonthlyReport']; Insight: string}>(responseBody);
    },
    enabled: !!month,
  });
};
