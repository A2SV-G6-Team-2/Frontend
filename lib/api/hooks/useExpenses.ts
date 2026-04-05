import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import type { components } from '../schema';

type Expense = components['schemas']['Expense'];
type CreateExpenseRequest = components['schemas']['CreateExpenseRequest'];
type UpdateExpenseRequest = components['schemas']['UpdateExpenseRequest'];

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

export const useExpenses = (params?: { from_date?: string; to_date?: string; category_id?: string }) => {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: async () => {
      const { data: responseBody } = await apiClient.get<Expense[] | ApiResponse<Expense[]>>('/expenses', { params });
      console.log(params);
      return extractData<Expense[]>(responseBody) || [];
    },
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: async () => {
      const { data: responseBody } = await apiClient.get<Expense | ApiResponse<Expense>>(`/expenses/${id}`);
      return extractData<Expense>(responseBody);
    },
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: CreateExpenseRequest) => {
      const { data: responseBody } = await apiClient.post<Expense | ApiResponse<Expense>>('/expenses', expense);
      return extractData<Expense>(responseBody);
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
      const { data: responseBody } = await apiClient.put<Expense | ApiResponse<Expense>>(`/expenses/${id}`, expense);
      return extractData<Expense>(responseBody);
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
