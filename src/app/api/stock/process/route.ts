// src/app/api/stock/process/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient, RequestStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // 1. Authenticate and Authorize: MUST be an ADMIN
  if (session?.user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
  }
  const approverId = session.user.id;

  const { requestId, newStatus } = await req.json();

  if (!requestId || !newStatus || !['APPROVED', 'REJECTED'].includes(newStatus)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const request = await prisma.stockRequest.findUnique({
    where: { id: requestId },
    include: { product: true },
  });

  if (!request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }
  if (request.status !== RequestStatus.PENDING) {
    return NextResponse.json({ error: 'Request has already been processed' }, { status: 400 });
  }

  try {
    // --- Handle REJECTION ---
    if (newStatus === RequestStatus.REJECTED) {
      const updatedRequest = await prisma.stockRequest.update({
        where: { id: requestId },
        data: { status: RequestStatus.REJECTED, approvedById: approverId },
      });
      // TODO: Audit Log for Rejection
      return NextResponse.json(updatedRequest);
    }
    
    // --- Handle APPROVAL within a transaction ---
    if (newStatus === RequestStatus.APPROVED) {
      const changeAmount = request.type === 'IN' ? request.quantity : -request.quantity;

      // Check for sufficient stock before starting the transaction
      if (request.type === 'OUT' && request.product.quantity < request.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${request.product.name}. Available: ${request.product.quantity}, Requested: ${request.quantity}` },
          { status: 400 }
        );
      }

      const result = await prisma.$transaction(async (tx) => {
        // 1. Update the Product quantity
        const updatedProduct = await tx.product.update({
          where: { id: request.productId },
          data: { quantity: { increment: changeAmount } },
        });

        // 2. Update the Stock Request
        const updatedRequest = await tx.stockRequest.update({
          where: { id: requestId },
          data: { status: RequestStatus.APPROVED, approvedById: approverId },
        });

        // 3. CREATE THE IMMUTABLE LEDGER ENTRY - The most important new step!
        await tx.ledgerEntry.create({
          data: {
            stockRequestId: requestId,
            productId: request.productId,
            change: changeAmount,
            newQuantity: updatedProduct.quantity, // The quantity AFTER the transaction
          },
        });

        // 4. (Optional) Create an Audit Log
        await tx.auditLog.create({
          data: {
            action: 'STOCK_REQUEST_APPROVED',
            details: `Admin ${session.user.email} approved request ${requestId}.`,
            userId: approverId,
          }
        });

        return updatedRequest;
      });

      return NextResponse.json(result);
    }
  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Request processing failed' }, { status: 500 });
  }
}