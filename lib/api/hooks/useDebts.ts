import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import type { components } from '../schema';

type Debt = components['schemas']['Debt'];
type CreateDebtInput = components['schemas']['CreateDebtInput'];
type UpdateDebtInput = components['schemas']['UpdateDebtInput'];


type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
};

function debtsListFromResponse(body: ApiEnvelope<{ items: Debt[] }>): Debt[] {
  const items = body?.data?.items;
  return Array.isArray(items) ? items : [];
}

function debtFromResponse(body: ApiEnvelope<Debt>): Debt {
  return body.data;
}

export const useDebts = () => {
  return useQuery({
    queryKey: ['debts'],
    queryFn: async () => {
      const { data: body } = await apiClient.get<ApiEnvelope<{ items: Debt[] }>>('/debts');
      return debtsListFromResponse(body);
    },
  });
};

export const useUpcomingDebts = (days: number = 7) => {
  return useQuery({
    queryKey: ['debts', 'upcoming', days],
    queryFn: async () => {
      const { data: body } = await apiClient.get<ApiEnvelope<{ items: Debt[] }>>('/debts/upcoming', {
        params: { days },
      });
      return debtsListFromResponse(body);
    },
  });
};

export const useDebt = (id: string) => {
  return useQuery({
    queryKey: ['debts', id],
    queryFn: async () => {
      const { data: body } = await apiClient.get<ApiEnvelope<Debt>>(`/debts/${id}`);
      return debtFromResponse(body);
    },
    enabled: !!id,
  });
};

export const useCreateDebt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (debt: CreateDebtInput) => {
      const { data: body } = await apiClient.post<ApiEnvelope<Debt>>('/debts', debt);
      return debtFromResponse(body);
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
      const { data: body } = await apiClient.put<ApiEnvelope<Debt>>(`/debts/${id}`, debt);
      return debtFromResponse(body);
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
      const { data: body } = await apiClient.patch<ApiEnvelope<Debt>>(`/debts/${id}/pay`);
      return debtFromResponse(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });
};
