// src/app/api/dashboard/summary/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RequestStatus } from '@/generated/prisma';

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. KPI Data
    const totalRevenue = 45231; // Placeholder: Replace with actual revenue calculation
    const stockOut = await prisma.stockRequest.aggregate({
      _sum: { quantity: true },
      where: { type: 'OUT', status: 'APPROVED', updatedAt: { gte: sevenDaysAgo } },
    });
    const pendingRequests = await prisma.stockRequest.count({
      where: { status: 'PENDING' },
    });
    const newProducts = await prisma.product.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });

    // 2. Main Chart Data (Example: Daily transactions)
    // Note: Real time-series data requires a more complex DB query.
    const mainChartData = [
        { month: 'Jan', revenue: 4000 }, { month: 'Feb', revenue: 3000 }, { month: 'Mar', revenue: 5000 },
        { month: 'Apr', revenue: 4500 }, { month: 'May', revenue: 6000 }, { month: 'Jun', revenue: 5500 },
    ];

    const summaryData = {
      kpis: {
        totalRevenue: totalRevenue,
        stockOut: stockOut._sum.quantity || 0,
        pendingRequests,
        newProducts,
      },
      mainChart: mainChartData,
    };

    return NextResponse.json(summaryData);
  } catch (error) {
    console.error("Failed to fetch summary data:", error)
    return NextResponse.json({ error: 'Failed to fetch summary data' }, { status: 500 });
  }
}s