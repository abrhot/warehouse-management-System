// src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
