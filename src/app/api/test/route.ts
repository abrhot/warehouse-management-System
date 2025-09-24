import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('=== TEST ENDPOINT CALLED ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database URL exists:', !!process.env.DATABASE_URL);
    
    // Test connection
    await prisma.$connect();
    console.log('Prisma connected successfully');
    
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    const users = await prisma.user.findMany({
      select: { 
        id: true,
        email: true, 
        name: true, 
        role: true,
        createdAt: true 
      },
      take: 10
    });
    console.log('Users found:', users);
    
    // Test table existence
    const tableCheck = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('User', 'Product', 'Category');
    `;
    
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      databaseConnected: true,
      userCount,
      users,
      tables: tableCheck,
      message: 'Database connected successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      databaseConnected: false
    }, { status: 500 });
  }
}
