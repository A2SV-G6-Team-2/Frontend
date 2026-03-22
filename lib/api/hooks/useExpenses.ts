import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { components } from '../schema';

type Expense = components['schemas']['Expense'];
type CreateExpenseRequest = components['schemas']['CreateExpenseRequest'];
type UpdateExpenseRequest = components['schemas']['UpdateExpenseRequest'];

export const useExpenses = (params?: { from_date?: string; to_date?: string; category_id?: string }) => {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: async () => {
      const { data } = await apiClient.get<Expense[]>('/expenses', { params });
      return data;
    },
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Expense>(`/expenses/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: CreateExpenseRequest) => {
      const { data } = await apiClient.post<Expense>('/expenses', expense);
      return data;
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
      const { data } = await apiClient.put<Expense>(`/expenses/${id}`, expense);
      return data;
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
