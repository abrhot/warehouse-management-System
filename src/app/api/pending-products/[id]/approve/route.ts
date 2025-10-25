import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const approveSchema = z.object({
  notes: z.string().optional(),
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
    const { notes } = approveSchema.parse(body);

    // Find the pending product
    const pendingProduct = await prisma.pendingProduct.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        supplier: true,
      },
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

    // Create the actual product and update pending status in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the actual product
      const product = await tx.product.create({
        data: {
          sku: pendingProduct.sku,
          barcode: pendingProduct.barcode,
          name: pendingProduct.name,
          location: pendingProduct.location,
          reorderLevel: pendingProduct.reorderLevel,
          weight: pendingProduct.weight,
          dimensions: pendingProduct.dimensions,
          costPrice: pendingProduct.costPrice,
          sellingPrice: pendingProduct.sellingPrice,
          quantity: pendingProduct.quantity,
          categoryId: pendingProduct.categoryId,
          supplierId: pendingProduct.supplierId,
        },
      });

      // Create stock items for the specified quantity
      const stockItems = [];
      for (let i = 0; i < pendingProduct.quantity; i++) {
        const stockItem = await tx.stockItem.create({
          data: {
            serialNumber: `${pendingProduct.sku}-${String(i + 1).padStart(4, '0')}`,
            status: 'IN_STOCK',
            location: pendingProduct.location,
            productId: product.id,
          },
        });
        stockItems.push(stockItem);
      }

      // Update pending product status
      const updatedPending = await tx.pendingProduct.update({
        where: { id: params.id },
        data: {
          status: 'APPROVED',
          reviewedBy: userId,
          notes,
        },
      });

      return { product, stockItems, updatedPending };
    });

    return NextResponse.json({
      message: 'Product approved successfully',
      productId: result.product.id,
      stockItemsCreated: result.stockItems.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error approving product:', error);
    return NextResponse.json(
      { error: 'Failed to approve product' },
      { status: 500 }
    );
  }
}
