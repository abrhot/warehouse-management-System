// src/app/api/stock/request/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  try {
    const body = await req.json();
    // We ONLY accept productId. No more creating products on the fly.
    const { productId, quantity, type, notes, reason } = body;

    if (!productId || !quantity || !type) {
      return NextResponse.json({ error: 'Missing required fields: productId, quantity, and type are required.' }, { status: 400 });
    }

    // Create the request with the real user ID
    const stockRequest = await prisma.stockRequest.create({
      data: {
        productId: productId,
        quantity: Number(quantity),
        type: type, // Assumes type is 'IN' or 'OUT'
        status: 'PENDING',
        notes: notes,
        reason: reason,
        requestedById: session.user.id, // Correctly links to the user
      },
    });

    // TODO: Create an audit log entry for the request creation
    await prisma.auditLog.create({
      data: {
        action: 'STOCK_REQUEST_CREATED',
        details: `User ${session.user.email} created a ${type} request for ${quantity} of product ID ${productId}.`,
        userId: session.user.id,
      }
    });

    return NextResponse.json(stockRequest, { status: 201 });

  } catch (error: any) {
    console.error("Error creating stock request:", error);
    return NextResponse.json({ error: 'Failed to create stock request' }, { status: 500 });
  }
}