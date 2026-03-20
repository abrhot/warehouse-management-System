// src/app/api/stock/request/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  // Check JWT headers from middleware
  const userId = req.headers.get('x-user-id');
  const userRole = req.headers.get('x-user-role');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // First, verify the user exists in the database
    // Try by id first, then fall back to name (for legacy demo tokens)
    let user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      // Fallback: try to find by name (handles old demo tokens where id = name)
      user = await prisma.user.findFirst({ where: { name: userId } });
    }

    if (!user) {
      console.error(`User not found in database: ${userId}`);
      return NextResponse.json({ error: 'User not found. Please log out and log in again.' }, { status: 404 });
    }

    // Use the real DB user id from here on
    const realUserId = user.id;

    const body = await req.json();
    const { stockItemId, notes, reason, type } = body;
    if (!stockItemId) {
        return NextResponse.json({ error: 'Stock Item ID is required.' }, { status: 400 });
    }

    // Verify the stock item exists
    const stockItem = await prisma.stockItem.findUnique({
      where: { id: stockItemId }
    });

    if (!stockItem) {
      console.error(`Stock item not found: ${stockItemId}`);
      return NextResponse.json({ error: 'Stock item not found' }, { status: 404 });
    }
    
    const existingRequest = await prisma.stockRequest.findFirst({
      where: { 
        stockItemId: stockItemId,
        status: 'PENDING' 
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'An active request for this item already exists.' },
        { status: 409 }
      );
    }

    const [newRequest] = await prisma.$transaction([
      prisma.stockRequest.create({
        data: {
          type: type || 'OUT', // Use the type from request or default to OUT
          status: 'PENDING', 
          notes: notes || null,
          reason: reason || null,
          requester: {
            connect: { id: realUserId },
          },
          stockItem: { // Use the relation field 'stockItem'
            connect: { id: stockItemId }, // And connect it by its ID
          },
        },
      }),
      prisma.stockItem.update({
        where: { id: stockItemId },
        data: { status: 'RESERVED' },
      }),
    ]);

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error: any) {
    console.error('Error creating stock out request:', error);

    if (error.code === 'P2025' || error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Stock item not found. Please provide a valid item ID.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create stock out request due to an internal server error.' },
      { status: 500 }
    );
  }
}