// src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all categories with product counts
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST a new category
export async function POST(req: Request) {
    // Check JWT headers from middleware
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');
    
    if (!userId || userRole !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    try {
        const { name, description } = await req.json();
        if (!name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        const newCategory = await prisma.category.create({
            data: {
                name,
                description,
            },
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error('Failed to create category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
