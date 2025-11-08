import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Count stock requests
    const [
      totalStockIn,
      totalStockOut,
      totalProductsManaged,
      lowStockProducts
    ] = await Promise.all([
      prisma.stockRequest.count({
        where: { type: 'IN', status: 'APPROVED' },
      }),
      prisma.stockRequest.count({
        where: { type: 'OUT', status: 'APPROVED' },
      }),
      prisma.product.count(),
      // Find products where quantity is below reorder level
      prisma.product.findMany({
        where: {
          quantity: {
            lt: prisma.product.fields.reorderLevel
          }
        }
      })
    ]);

    const stats = {
      totalStockIn,
      totalStockOut,
      lowStockAlerts: lowStockProducts.length,
      totalProductsManaged,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch report stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}