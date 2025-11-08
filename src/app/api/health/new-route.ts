import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const status: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    node: process.version,
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
  };

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    status.database = 'connected';
    
    // Get some basic stats
    try {
      const [users, products, requests] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.stockRequest.count(),
      ]);
      
      status.stats = { users, products, requests };
    } catch (statsError: any) {
      status.statsError = statsError.message;
    }
  } catch (dbError: any) {
    status.database = 'error';
    status.error = dbError.message;
  }

  return NextResponse.json(status);
}
