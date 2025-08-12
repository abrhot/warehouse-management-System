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
    const { productId, quantity, type, notes } = body;

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
        requestedBy: session.user.id,
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
    // Return the specific error message to the client
    return NextResponse.json({ error: `Failed to create stock request: ${error.message}` }, { status: 500 });
  }
}