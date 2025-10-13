import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const stockItemCount = await prisma.stockItem.count();
    const requestCount = await prisma.stockRequest.count();

    // Get database URL info (without exposing the full URL)
    const dbUrl = process.env.DATABASE_URL;
    const isNeon = dbUrl?.includes('neon.tech') || dbUrl?.includes('neon.db');
    const dbType = dbUrl?.split('://')[0] || 'unknown';

    return NextResponse.json({
      success: true,
      database: {
        type: dbType,
        isNeon: isNeon,
        connected: true
      },
      counts: {
        users: userCount,
        categories: categoryCount,
        products: productCount,
        stockItems: stockItemCount,
        requests: requestCount
      },
      environment: process.env.NODE_ENV || 'unknown'
    });

  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      database: {
        connected: false
      }
    }, { status: 500 });
  }
}
