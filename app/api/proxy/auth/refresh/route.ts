import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH !== 'true') {
    return NextResponse.json(
      { success: false, message: 'Backend not available', data: null, errors: ['Backend not reachable'], meta: null },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', data: null, errors: ['refresh_token is required'], meta: null },
        { status: 400 }
      );
    }

    // Mock: accept any non-empty refresh token
    return NextResponse.json(
      {
        success: true,
        message: 'Token refreshed',
        data: {
          access_token: `mock-access-token-${Date.now()}`,
          refresh_token: `mock-refresh-token-${Date.now()}`,
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
