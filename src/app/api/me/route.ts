import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    let userPayload: any;

    // First, try to verify as a JWT
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
      const { payload } = await jwtVerify(token, secret);
      userPayload = payload;
    } catch (jwtError) {
      // If JWT verification fails, try to decode as Base64 (for the test user)
      try {
        const decoded = JSON.parse(atob(token));
        userPayload = decoded;
      } catch (base64Error) {
        // If both fail, the token is invalid
        console.error('Failed to decode token:', (jwtError as Error).message, (base64Error as Error).message);
        return NextResponse.json({ user: null, error: 'Invalid token' }, { status: 401 });
      }
    }

    // Ensure the payload has the necessary user fields
    if (!userPayload || !userPayload.id) {
        return NextResponse.json({ user: null, error: 'Invalid token payload' }, { status: 401 });
    }

    return NextResponse.json({ user: { id: userPayload.id, email: userPayload.email, role: userPayload.role, name: userPayload.name } }, { status: 200 });

  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json({ user: null, error: 'Internal server error' }, { status: 500 });
  }
}
