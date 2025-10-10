import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const createPendingCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
});

// GET - Fetch pending categories (admin only)
export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const pendingCategories = await prisma.pendingCategory.findMany({
      include: {
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
    const serializedCategories = pendingCategories.map(category => ({
      ...category,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedCategories);
  } catch (error) {
    console.error('Error fetching pending categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending categories' },
      { status: 500 }
    );
  }
}

// POST - Submit new category for approval
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPendingCategorySchema.parse(body);

    // Check if category name already exists in categories or pending categories
    const existingName = await Promise.all([
      prisma.category.findUnique({ where: { name: validatedData.name } }),
      prisma.pendingCategory.findUnique({ where: { name: validatedData.name } }),
    ]);

    if (existingName[0] || existingName[1]) {
      return NextResponse.json(
        { error: 'Category name already exists' },
        { status: 400 }
      );
    }

    const pendingCategory = await prisma.pendingCategory.create({
      data: {
        ...validatedData,
        submittedBy: userId,
      },
      include: {
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
    const serializedCategory = {
      ...pendingCategory,
      createdAt: pendingCategory.createdAt.toISOString(),
      updatedAt: pendingCategory.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedCategory, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating pending category:', error);
    return NextResponse.json(
      { error: 'Failed to create pending category' },
      { status: 500 }
    );
  }
}
