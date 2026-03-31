import { NextRequest, NextResponse } from 'next/server';

// Password policy (mirrors backend)
function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Password must contain at least one special character');
  return errors;
}

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
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', data: null, errors: ['name, email, and password are required'], meta: null },
        { status: 400 }
      );
    }

    // Validate password policy
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', data: null, errors: passwordErrors, meta: null },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const registered = getRegisteredUsers();
    if (registered.some((u) => u.email === email) || email === 'john@example.com') {
      return NextResponse.json(
        { success: false, message: 'Email already in use', data: null, errors: ['An account with this email already exists'], meta: null },
        { status: 409 }
      );
    }

    // "Register" the user in memory
    const newUser = {
      id: `mock-uuid-${Date.now()}`,
      name,
      email,
      password,
      budgeting_style: 'flexible',
      default_currency: 'ETB',
      created_at: new Date().toISOString(),
    };
    registered.push(newUser);

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: { id: newUser.id, name: newUser.name, email: newUser.email },
        errors: null,
        meta: null,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body', data: null, errors: ['Could not parse request'], meta: null },
      { status: 400 }
    );
  }
}

// Shared in-memory store (same as login route)
interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  budgeting_style: string;
  default_currency: string;
  created_at: string;
}

function getRegisteredUsers(): MockUser[] {
  const g = globalThis as Record<string, unknown>;
  if (!g.__mockRegisteredUsers) {
    g.__mockRegisteredUsers = [];
  }
  return g.__mockRegisteredUsers as MockUser[];
}
