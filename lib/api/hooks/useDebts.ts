import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import type { components } from '../schema';

type Debt = components['schemas']['Debt'];
type CreateDebtInput = components['schemas']['CreateDebtInput'];
type UpdateDebtInput = components['schemas']['UpdateDebtInput'];

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

export const useDebts = () => {
  return useQuery({
    queryKey: ['debts'],
    queryFn: async () => {
      const { data: responseBody } = await apiClient.get<Debt[] | ApiResponse<Debt[]>>('/debts');
      return extractData<Debt[]>(responseBody) || [];
    },
  });
};

export const useUpcomingDebts = (days: number = 7) => {
  return useQuery({
    queryKey: ['debts', 'upcoming', days],
    queryFn: async () => {
      const { data: responseBody } = await apiClient.get<Debt[] | ApiResponse<Debt[]>>('/debts/upcoming', {
        params: { days },
      });
      return extractData<Debt[]>(responseBody) || [];
    },
  });
};

export const useDebt = (id: string) => {
  return useQuery({
    queryKey: ['debts', id],
    queryFn: async () => {
      const { data: responseBody } = await apiClient.get<Debt | ApiResponse<Debt>>(`/debts/${id}`);
      return extractData<Debt>(responseBody);
    },
    enabled: !!id,
  });
};

export const useCreateDebt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (debt: CreateDebtInput) => {
      const { data: responseBody } = await apiClient.post<Debt | ApiResponse<Debt>>('/debts', debt);
      return extractData<Debt>(responseBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });
};

export const useUpdateDebt = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (debt: UpdateDebtInput) => {
      const { data: responseBody } = await apiClient.put<Debt | ApiResponse<Debt>>(`/debts/${id}`, debt);
      return extractData<Debt>(responseBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });
};

export const useMarkDebtPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: responseBody } = await apiClient.patch<Debt | ApiResponse<Debt>>(`/debts/${id}/pay`);
      return extractData<Debt>(responseBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });
};
