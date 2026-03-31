import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const MOCK_USERS = [
  {
    id: 'mock-uuid-001',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Secure123!',
    budgeting_style: 'flexible',
    default_currency: 'ETB',
    created_at: '2026-01-01T00:00:00Z',
  },
];

export async function POST(request: NextRequest) {
  // Only mock when bypass is enabled
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH !== 'true') {
    return NextResponse.json(
      { success: false, message: 'Backend not available', data: null, errors: ['Backend not reachable'], meta: null },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', data: null, errors: ['email and password are required'], meta: null },
        { status: 400 }
      );
    }

    // Check registered users from the mock "DB" stored in a global
    const allUsers = [...MOCK_USERS, ...getRegisteredUsers()];
    const user = allUsers.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials', data: null, errors: ['Invalid email or password'], meta: null },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          access_token: `mock-access-token-${Date.now()}`,
          refresh_token: `mock-refresh-token-${Date.now()}`,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            budgeting_style: user.budgeting_style,
            default_currency: user.default_currency,
            created_at: user.created_at,
          },
        },
        errors: null,
        meta: null,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body', data: null, errors: ['Could not parse request'], meta: null },
      { status: 400 }
    );
  }
}

// Simple in-memory store for users registered during this server session
function getRegisteredUsers(): typeof MOCK_USERS {
  return (globalThis as Record<string, unknown>).__mockRegisteredUsers as typeof MOCK_USERS ?? [];
}
