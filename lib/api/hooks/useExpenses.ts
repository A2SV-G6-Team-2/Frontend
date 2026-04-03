import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import type { components } from '../schema';

type Expense = components['schemas']['Expense'];
type CreateExpenseRequest = components['schemas']['CreateExpenseRequest'];
type UpdateExpenseRequest = components['schemas']['UpdateExpenseRequest'];


type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
};

function expensesListFromResponse(body: ApiEnvelope<{ items: Expense[] }>): Expense[] {
  const items = body?.data?.items;
  return Array.isArray(items) ? items : [];
}

function expenseFromResponse(body: ApiEnvelope<Expense>): Expense {
  return body.data;
}

export const useExpenses = (params?: { from_date?: string; to_date?: string; category_id?: string }) => {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: async () => {
      const { data: body } = await apiClient.get<ApiEnvelope<{ items: Expense[] }>>('/expenses', { params });
      return expensesListFromResponse(body);
    },
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: async () => {
      const { data: body } = await apiClient.get<ApiEnvelope<Expense>>(`/expenses/${id}`);
      return expenseFromResponse(body);
    },
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: CreateExpenseRequest) => {
      const { data: body } = await apiClient.post<ApiEnvelope<Expense>>('/expenses', expense);
      return expenseFromResponse(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useUpdateExpense = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: UpdateExpenseRequest) => {
      const { data: body } = await apiClient.put<ApiEnvelope<Expense>>(`/expenses/${id}`, expense);
      return expenseFromResponse(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
