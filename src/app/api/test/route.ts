import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: { email: true, name: true },
      take: 5
    });
    
    return NextResponse.json({
      success: true,
      userCount,
      users,
      message: 'Database connected successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
