// src/app/api/reports/stats/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalStockIn = await prisma.stockRequest.aggregate({
      where: { type: 'IN', status: 'APPROVED' },
      _sum: { quantity: true },
    });

    const totalStockOut = await prisma.stockRequest.aggregate({
      where: { type: 'OUT', status: 'APPROVED' },
      _sum: { quantity: true },
    });

    const lowStockAlerts = await prisma.product.count({
      where: {
        quantity: {
          lt: prisma.product.fields.reorderLevel, // Find products where quantity is less than reorderLevel
        },
      },
    });

    const totalProductsManaged = await prisma.product.count();

    const stats = {
      totalStockIn: totalStockIn._sum.quantity || 0,
      totalStockOut: totalStockOut._sum.quantity || 0,
      lowStockAlerts,
      totalProductsManaged,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch report stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}