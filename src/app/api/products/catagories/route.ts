// src/app/api/products/categories/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categoryCounts = await prisma.product.groupBy({
      by: ['categoryId'],
      _count: {
        id: true,
      },
    });

    // Get the category names
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryCounts.map((c) => c.categoryId),
        },
      },
    });

    const result = categoryCounts.map((item) => {
      const category = categories.find((c) => c.id === item.categoryId);
      return {
        name: category?.name || 'Unknown',
        count: item._count.id,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch category data:", error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}