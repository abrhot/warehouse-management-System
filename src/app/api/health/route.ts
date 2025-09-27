import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();

    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@warehouse.com' }
    });

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        userCount,
        productCount,
        categoryCount,
        adminExists: !!adminUser
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      }
    });

  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      database: {
        connected: false
      }
    }, { status: 500 });
  }
}
