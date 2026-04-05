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
    return response.data.items as T;
  }
  return response as T;
}

export const useWeeklyReport = (start: string, end: string) => {
  return useQuery({
    queryKey: ['reports', 'weekly', start, end],
    queryFn: async () => {
      const { data: responseBody } = await apiClient.get<WeeklyReport | ApiResponse<WeeklyReport>>('/reports/weekly', {
        params: { start, end },
      });
      return extractData<WeeklyReport>(responseBody);
    },
    enabled: !!start && !!end,
  });
};
