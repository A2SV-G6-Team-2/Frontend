import Cookies from 'js-cookie';

// Cookie keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  budgeting_style: string;
  default_currency: string;
  created_at: string;
}

// ── Access Token ──

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  // Secure cookie: expires in 10 hours (matches backend TTL)
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 10 / 24, // 10 hours in days
    sameSite: 'lax',
  });
}

export function removeAccessToken(): void {
  Cookies.remove(ACCESS_TOKEN_KEY);
}

// ── Refresh Token ──

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  // Expires in 7 days (matches backend TTL)
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    expires: 7,
    sameSite: 'lax',
  });
}

export function removeRefreshToken(): void {
  Cookies.remove(REFRESH_TOKEN_KEY);
}

// ── User Data ──

export function getUser(): User | null {
  const raw = Cookies.get(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  Cookies.set(USER_KEY, JSON.stringify(user), {
    expires: 7,
    sameSite: 'lax',
  });
}

export function removeUser(): void {
  Cookies.remove(USER_KEY);
}

// ── Convenience helpers ──

export function setTokens(accessToken: string, refreshToken: string): void {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
}

export function clearSession(): void {
  removeAccessToken();
  removeRefreshToken();
  removeUser();
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
