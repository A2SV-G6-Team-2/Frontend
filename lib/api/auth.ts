import axios from 'axios';

// Use direct proxy path for auth calls (no interceptors needed for public routes)
const authClient = axios.create({
  baseURL: '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Types ──

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[] | null;
  meta: unknown;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  budgeting_style: string;
  default_currency: string;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

// ── API calls ──

export async function loginUser(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await authClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
  return response.data;
}

export async function registerUser(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
  const response = await authClient.post<ApiResponse<RegisterResponse>>('/auth/register', data);
  return response.data;
}

export async function refreshSession(refreshToken: string): Promise<ApiResponse<RefreshResponse>> {
  const response = await authClient.post<ApiResponse<RefreshResponse>>('/auth/refresh', {
    refresh_token: refreshToken,
  });
  return response.data;
}

export async function logoutUser(refreshToken: string): Promise<ApiResponse<null>> {
  const response = await authClient.post<ApiResponse<null>>('/auth/logout', {
    refresh_token: refreshToken,
  });
  return response.data;
}
