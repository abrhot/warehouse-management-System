// src/app/api/stock/request/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Now session.user.id is a string, which matches the new schema
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  try {
    const body = await req.json();
    const { productId, quantity, type, notes, reason } = body;

    if (!productId || !quantity || !type) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const stockRequest = await prisma.stockRequest.create({
      data: {
        productId: productId,
        quantity: Number(quantity),
        type: type,
        status: 'PENDING',
        notes: notes,
        reason: reason,
        requestedById: session.user.id, // Correctly links to the user's string ID
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'STOCK_REQUEST_CREATED',
        details: `User ${session.user.email} created a ${type} request for ${quantity} of product ID ${productId}.`,
        userId: parseInt(session.user.id as string), // Use a function to convert the user ID from string to int
      }
    });

    return NextResponse.json(stockRequest, { status: 201 });

  } catch (error: any) {
    console.error("Error creating stock request:", error);
    return NextResponse.json({ error: 'Failed to create stock request' }, { status: 500 });
  }
}