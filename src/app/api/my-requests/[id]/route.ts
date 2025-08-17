// src/app/api/my-requests/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RequestStatus, ItemStatus } from '@/generated/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const requestId = params.id;

  try {
    const requestToDelete = await prisma.stockRequest.findUnique({
      where: { id: requestId },
    });

    // Ensure the request exists, belongs to the user, and is pending
    if (!requestToDelete || requestToDelete.requestedBy !== session.user.id) {
      return NextResponse.json({ error: 'Request not found or access denied' }, { status: 404 });
    }
    if (requestToDelete.status !== RequestStatus.PENDING) {
      return NextResponse.json({ error: 'Only pending requests can be deleted' }, { status: 400 });
    }

    // Use a transaction to delete the request and revert the stock item status
    await prisma.$transaction([
      prisma.stockItem.update({
        where: { id: requestToDelete.stockItemId },
        data: { status: ItemStatus.IN_STOCK }, // Revert status to IN_STOCK
      }),
      prisma.stockRequest.delete({
        where: { id: requestId },
      }),
    ]);

    return NextResponse.json({ message: 'Request deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete request:', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
