import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const rejectSchema = z.object({
  notes: z.string().min(1, 'Rejection reason is required'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role');
    const userId = request.headers.get('x-user-id');
    
    if (userRole !== 'ADMIN' || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { notes } = rejectSchema.parse(body);

    // Find the pending product
    const pendingProduct = await prisma.pendingProduct.findUnique({
      where: { id: params.id },
    });

    if (!pendingProduct) {
      return NextResponse.json(
        { error: 'Pending product not found' },
        { status: 404 }
      );
    }

    if (pendingProduct.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Product has already been reviewed' },
        { status: 400 }
      );
    }

    // Update pending product status
    await prisma.pendingProduct.update({
      where: { id: params.id },
      data: {
        status: 'REJECTED',
        reviewedBy: userId,
        notes,
      },
    });

    return NextResponse.json({
      message: 'Product rejected successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error rejecting product:', error);
    return NextResponse.json(
      { error: 'Failed to reject product' },
      { status: 500 }
    );
  }
}
