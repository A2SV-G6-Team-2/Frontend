import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { components } from '../schema';
import Cookies from 'js-cookie';

type User = components['schemas']['User'];
type LoginInput = components['schemas']['LoginInput'];
type RegisterInput = components['schemas']['RegisterInput'];
type AuthResponse = components['schemas']['AuthResponse'];

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      // If we have a dev user and no token cookie, return the dev user
      const devUser = process.env.NEXT_PUBLIC_DEV_USER;
      if (!Cookies.get('token') && devUser) {
        try {
          return JSON.parse(devUser) as User;
        } catch (e) {
          console.error('Failed to parse NEXT_PUBLIC_DEV_USER', e);
        }
      }
      
      const { data } = await apiClient.get<User>('/user/profile');
      return data;
    },
    enabled: !!Cookies.get('token') || !!process.env.NEXT_PUBLIC_DEV_TOKEN,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      Cookies.set('token', data.token, { expires: 7 }); // expires in 7 days
      queryClient.setQueryData(['profile'], data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: RegisterInput) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
      return data;
    },
    onSuccess: (data) => {
      Cookies.set('token', data.token, { expires: 7 });
      queryClient.setQueryData(['profile'], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return () => {
    Cookies.remove('token');
    queryClient.clear();
    window.location.href = '/login';
  };
};
