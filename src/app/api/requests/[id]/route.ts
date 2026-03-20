import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Request ID is missing.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { status } = body;

    // Resolve the approver from the request headers (handles legacy demo tokens)
    const rawUserId = request.headers.get('x-user-id');
    let approverConnect: { id: string } | undefined;
    if (rawUserId) {
      let approver = await prisma.user.findUnique({ where: { id: rawUserId } });
      if (!approver) {
        approver = await prisma.user.findFirst({ where: { name: rawUserId } });
      }
      if (approver) {
        approverConnect = { id: approver.id };
      }
    }

    // 1. Validate the incoming status
    if (!status || !['PENDING', 'APPROVED', 'REJECTED', 'RESERVED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status provided.' },
        { status: 400 }
      );
    }

    // --- Transactional Logic ---
    // This ensures that updating the request and the stock item's quantity
    // either both succeed or both fail together.
    const updatedRequest = await prisma.$transaction(async (tx) => {
      // First, get the original request details
      const originalRequest = await tx.stockRequest.findUnique({
        where: { id },
        select: { status: true, type: true, stockItemId: true },
      });

      if (!originalRequest) {
        throw new Error('Request not found.');
      }
      
      // Prevent re-processing an already approved/rejected request
      if (originalRequest.status !== 'PENDING') {
          throw new Error(`Request has already been ${originalRequest.status.toLowerCase()}.`);
      }

      // 2. If the status is changing to APPROVED, update stock item status
      if (status === 'APPROVED') {
        const stockItem = await tx.stockItem.findUnique({
          where: { id: originalRequest.stockItemId! },
          select: { id: true, productId: true },
        });

        if (!stockItem) {
          throw new Error('Associated stock item not found.');
        }

        if (originalRequest.type === 'OUT') {
          // Mark item as shipped and decrement product quantity by 1
          await tx.stockItem.update({
            where: { id: stockItem.id },
            data: { status: 'SHIPPED' },
          });
          if (stockItem.productId) {
            await tx.product.update({
              where: { id: stockItem.productId },
              data: { quantity: { decrement: 1 } },
            });
          }
        } else if (originalRequest.type === 'IN') {
          // Mark item as in stock and increment product quantity by 1
          await tx.stockItem.update({
            where: { id: stockItem.id },
            data: { status: 'IN_STOCK' },
          });
          if (stockItem.productId) {
            await tx.product.update({
              where: { id: stockItem.productId },
              data: { quantity: { increment: 1 } },
            });
          }
        }
      }

      // 3. Finally, update the request's status and approver
      const finalUpdatedRequest = await tx.stockRequest.update({
        where: { id: id },
        data: {
          status: status,
          ...(approverConnect && ['APPROVED', 'REJECTED'].includes(status)
            ? { approver: { connect: approverConnect } }
            : {}),
        },
      });

      return finalUpdatedRequest;
    });

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error: any) {
    console.error('Update Request Error:', error);
    // Provide specific feedback for common errors
    if (error.message.includes('Insufficient stock')) {
        return NextResponse.json({ error: error.message }, { status: 409 }); // 409 Conflict
    }
     if (error.message.includes('Request has already been')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update the request.' },
      { status: 500 }
    );
  }
}
