// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  location: z.string().optional(),
  reorderLevel: z.number().int().min(0).default(10),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  costPrice: z.number().positive('Cost price must be positive'),
  sellingPrice: z.number().positive().optional(),
  quantity: z.number().int().min(0).default(0),
  categoryId: z.number().int().positive('Category is required'),
  supplierId: z.number().int().positive().optional(),
});

export async function GET(req: Request) {
  try {
    const stockItems = await prisma.stockItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        product: {
          include: {
            category: true,
            supplier: true,
          },
        },
      },
    });
    return NextResponse.json(stockItems);
  } catch (error: any) {
    console.error("Failed to fetch stock items:", error);
    return NextResponse.json(
      { error: "Server failed to fetch stock items" },
      { status: 500 }
    );
  }
}

// POST - Create product directly (admin only)
export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    const userId = request.headers.get('x-user-id');
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Check if SKU already exists
    const existingSKU = await prisma.product.findUnique({
      where: { sku: validatedData.sku }
    });

    if (existingSKU) {
      return NextResponse.json({ error: 'SKU already exists' }, { status: 400 });
    }

    // Check if barcode already exists (if provided)
    if (validatedData.barcode) {
      const existingBarcode = await prisma.product.findUnique({
        where: { barcode: validatedData.barcode }
      });

      if (existingBarcode) {
        return NextResponse.json({ error: 'Barcode already exists' }, { status: 400 });
      }
    }

    // Create the product and stock items in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the product
      const product = await tx.product.create({
        data: {
          sku: validatedData.sku,
          barcode: validatedData.barcode || null,
          name: validatedData.name,
          location: validatedData.location,
          reorderLevel: validatedData.reorderLevel,
          weight: validatedData.weight,
          dimensions: validatedData.dimensions,
          costPrice: validatedData.costPrice,
          sellingPrice: validatedData.sellingPrice,
          quantity: validatedData.quantity,
          categoryId: validatedData.categoryId,
          supplierId: validatedData.supplierId,
        },
        include: {
          category: true,
          supplier: true,
        },
      });

      // Create stock items for the specified quantity
      const stockItems = [];
      for (let i = 0; i < validatedData.quantity; i++) {
        const stockItem = await tx.stockItem.create({
          data: {
            serialNumber: `${validatedData.sku}-${String(i + 1).padStart(4, '0')}`,
            status: 'IN_STOCK',
            location: validatedData.location,
            productId: product.id,
          },
        });
        stockItems.push(stockItem);
      }

      return { product, stockItems };
    });

    return NextResponse.json(result.product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
