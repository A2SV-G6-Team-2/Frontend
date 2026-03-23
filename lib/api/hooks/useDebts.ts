import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { components } from '../schema';

type Debt = components['schemas']['Debt'];
type CreateDebtInput = components['schemas']['CreateDebtInput'];
type UpdateDebtInput = components['schemas']['UpdateDebtInput'];

export const useDebts = () => {
  return useQuery({
    queryKey: ['debts'],
    queryFn: async () => {
      const { data } = await apiClient.get<Debt[]>('/debts');
      return data;
    },
  });
};

export const useUpcomingDebts = (days: number = 7) => {
  return useQuery({
    queryKey: ['debts', 'upcoming', days],
    queryFn: async () => {
      const { data } = await apiClient.get<Debt[]>('/debts/upcoming', {
        params: { days },
      });
      return data;
    },
  });
};

export const useDebt = (id: string) => {
  return useQuery({
    queryKey: ['debts', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Debt>(`/debts/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateDebt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (debt: CreateDebtInput) => {
      const { data } = await apiClient.post<Debt>('/debts', debt);
      return data;
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
      const { data } = await apiClient.put<Debt>(`/debts/${id}`, debt);
      return data;
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
      const { data } = await apiClient.patch<Debt>(`/debts/${id}/pay`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });
};
