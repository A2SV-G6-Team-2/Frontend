import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import type { components } from '../schema';

type Category = components['schemas']['Category'];
type CreateCategoryRequest = components['schemas']['CreateCategoryRequest'];
type UpdateCategoryRequest = components['schemas']['UpdateCategoryRequest'];

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

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data: responseBody } = await apiClient.get<Category[] | ApiResponse<Category[]>>('/categories');
      return extractData<Category[]>(responseBody) || [];
    },
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      const { data: responseBody } = await apiClient.get<Category | ApiResponse<Category>>(`/categories/${id}`);
      return extractData<Category>(responseBody);
    },
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: CreateCategoryRequest) => {
      const { data: responseBody } = await apiClient.post<Category | ApiResponse<Category>>('/categories', category);
      return extractData<Category>(responseBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: UpdateCategoryRequest) => {
      const { data: responseBody } = await apiClient.put<Category | ApiResponse<Category>>(`/categories/${id}`, category);
      return extractData<Category>(responseBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
