import { NextResponse } from 'next/server';
import { PrismaClient, StockType } from '@/generated/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantity, type, notes, reason } = body;

    // Validate StockType safely
    if (!StockType || !Object.values(StockType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid stock request type.' },
        { status: 400 }
      );
    }

    // Read the auth token cookie
    const cookieStore = await cookies();
    const authToken = cookieStore.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify and decode JWT token
    let userId: string;
    try {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET!);
      // `decoded` is typically an object with id, role, etc.
      if (typeof decoded === 'object' && 'id' in decoded) {
        userId = (decoded as any).id;
      } else {
        throw new Error('Invalid token payload');
      }
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Create stock request with the authenticated userId
    const newRequest = await prisma.stockRequest.create({
      data: {
        productId,
        quantity,
        type,
        notes: notes || null,
        reason: reason || null,
        requestedBy: userId,
      },
    });

    return NextResponse.json(newRequest);
  } catch (error) {
    console.error('Error creating stock request:', error);
    return NextResponse.json(
      { error: 'Failed to create stock request.' },
      { status: 500 }
    );
  }
}
