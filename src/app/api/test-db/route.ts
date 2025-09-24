import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    
    // Test specific user
    const testUser = await prisma.user.findUnique({
      where: { email: 'ad@warhouse.com' },
      select: { id: true, email: true, name: true, role: true }
    });
    
    return NextResponse.json({
      success: true,
      userCount,
      testUser,
      message: 'Database connection successful'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Database connection failed'
    }, { status: 500 });
  }
}
