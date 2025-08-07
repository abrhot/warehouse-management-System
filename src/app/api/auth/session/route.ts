import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const cookieStore = cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const decodedToken: any = jwt.verify(authToken, process.env.JWT_SECRET!);
    const user = {
      id: decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: null, error: 'Invalid token' }, { status: 401 });
  }
}