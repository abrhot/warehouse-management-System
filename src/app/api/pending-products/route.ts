import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const createPendingProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
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

// GET - Fetch pending products (admin only)
export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const pendingProducts = await prisma.pendingProduct.findMany({
      include: {
        category: true,
        supplier: true,
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Serialize the data
    const serializedProducts = pendingProducts.map(product => ({
      ...product,
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice?.toString() || null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedProducts);
  } catch (error) {
    console.error('Error fetching pending products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending products' },
      { status: 500 }
    );
  }
}

// POST - Submit new product for approval
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPendingProductSchema.parse(body);

    // Check if SKU already exists in products or pending products
    const existingSku = await Promise.all([
      prisma.product.findUnique({ where: { sku: validatedData.sku } }),
      prisma.pendingProduct.findUnique({ where: { sku: validatedData.sku } }),
    ]);

    if (existingSku[0] || existingSku[1]) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Check if supplier exists (if provided)
    if (validatedData.supplierId) {
      const supplier = await prisma.supplier.findUnique({
        where: { id: validatedData.supplierId },
      });

      if (!supplier) {
        return NextResponse.json(
          { error: 'Supplier not found' },
          { status: 400 }
        );
      }
    }

    const pendingProduct = await prisma.pendingProduct.create({
      data: {
        ...validatedData,
        submittedBy: userId,
      },
      include: {
        category: true,
        supplier: true,
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Serialize the response
    const serializedProduct = {
      ...pendingProduct,
      costPrice: pendingProduct.costPrice.toString(),
      sellingPrice: pendingProduct.sellingPrice?.toString() || null,
      createdAt: pendingProduct.createdAt.toISOString(),
      updatedAt: pendingProduct.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedProduct, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating pending product:', error);
    return NextResponse.json(
      { error: 'Failed to create pending product' },
      { status: 500 }
    );
  }
}
