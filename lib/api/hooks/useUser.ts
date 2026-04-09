import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import type { components } from '../schema';
import { getAccessToken, setTokens, setUser, clearSession } from '@/lib/auth/token';

type User = components['schemas']['User'];
type LoginInput = components['schemas']['LoginInput'];
type RegisterInput = components['schemas']['RegisterInput'];
type AuthResponse = components['schemas']['AuthResponse'];
type UpdateUserInput = components['schemas']['UpdateUserInput'];

// The backend typically wraps responses in an ApiResponse object
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

/**
 * Helper to extract data from a potential ApiResponse wrapper.
 * If the response is already the data (e.g. an array), it returns it.
 */
function extractData<T>(response: any): T {
  if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
    return response.data as T;
  }
  return response as T;
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const devUser = process.env.NEXT_PUBLIC_DEV_USER;
      if (!getAccessToken() && devUser) {
        try {
          return JSON.parse(devUser) as User;
        } catch (e) {
          console.error('Failed to parse NEXT_PUBLIC_DEV_USER', e);
        }
      }
      
      const { data: responseBody } = await apiClient.get<User | ApiResponse<User>>('/user/profile');
      return extractData<User>(responseBody);
    },
    enabled: !!getAccessToken() || !!process.env.NEXT_PUBLIC_DEV_TOKEN,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data: responseBody } = await apiClient.post<AuthResponse | ApiResponse<AuthResponse>>('/auth/login', credentials);
      return extractData<AuthResponse>(responseBody);
    },
    onSuccess: (data) => {
      if (data && (data as any).token) {
        setTokens((data as any).token, '');
        if (data.user) {
          setUser(data.user as any);
        }
        queryClient.setQueryData(['profile'], data.user);
      }
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: RegisterInput) => {
      const { data: responseBody } = await apiClient.post<AuthResponse | ApiResponse<AuthResponse>>('/auth/register', userData);
      return extractData<AuthResponse>(responseBody);
    },
    onSuccess: (data) => {
      if (data && (data as any).token) {
        setTokens((data as any).token, '');
        if (data.user) {
          setUser(data.user as any);
        }
        queryClient.setQueryData(['profile'], data.user);
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return () => {
    clearSession();
    queryClient.clear();
    window.location.href = '/login';
  };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserInput) => {
      const { data: responseBody } = await apiClient.put<null | ApiResponse<null>>('/user/update', payload);
      return extractData<null>(responseBody);
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<User | undefined>(['profile'], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...variables,
        };
      });
    },
  });
};
