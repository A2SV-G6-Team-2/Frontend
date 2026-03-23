import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { components } from '../schema';

type WeeklyReport = components['schemas']['WeeklyReport'];

export const useWeeklyReport = (start: string, end: string) => {
  return useQuery({
    queryKey: ['reports', 'weekly', start, end],
    queryFn: async () => {
      const { data } = await apiClient.get<WeeklyReport>('/reports/weekly', {
        params: { start, end },
      });
      return data;
    },
    enabled: !!start && !!end,
  });
};

// Helper to get total spending from expenses for arbitrary ranges if needed
// or we can use the existing useExpenses with sum logic.
