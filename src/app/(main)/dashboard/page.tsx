// src/app/(main)/dashboard/page.tsx

import { KpiSection } from '@/components/dashboard/KpiSection';
import { MainChart } from '@/components/dashboard/MainChart';
import CategoriesChart from '@/components/dashboard/CategoriesChart';
import { LowStockSection } from '@/components/dashboard/LowStockSection';
import { Footer } from '@/components/dashboard/Footer';
import { prisma } from '@/lib/prisma';

const getThirtyDaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date;
};

export default async function DashboardPage() {
  try {
    // --- Data Fetching Logic (Unchanged) ---
    const totalItemsInStock = await prisma.stockItem.count({ where: { status: 'IN_STOCK' } });
    const totalProducts = await prisma.product.count();
    const pendingRequests = await prisma.stockRequest.count({ where: { status: 'PENDING' } });
    const stockOutCount = await prisma.product.count({
      where: { stockItems: { none: { status: 'IN_STOCK' } } }
    });
    const newProductsCount = await prisma.product.count({
      where: { createdAt: { gte: getThirtyDaysAgo() } }
    });

    const kpiData = {
      totalProducts,
      stockOut: stockOutCount,
      pendingRequests,
      newProducts: newProductsCount,
    };

    const productsWithStockCount = await prisma.product.findMany({
      include: {
        _count: { select: { stockItems: { where: { status: 'IN_STOCK' } } } },
      },
      orderBy: { name: 'asc' }
    });

    const lowStockItems = productsWithStockCount
      .filter(p => p._count.stockItems <= p.reorderLevel)
      .map(p => ({
        id: p.id,
        name: p.name,
        quantity: p._count.stockItems,
        reorderLevel: p.reorderLevel,
      }));

    const productsForCategoryChart = await prisma.product.findMany({
      select: {
        category: { select: { name: true } },
        _count: { select: { stockItems: { where: { status: 'IN_STOCK' } } } }
      }
    });
    
    const categoryTotals = productsForCategoryChart.reduce((acc, product) => {
      const categoryName = product.category?.name || 'Uncategorized';
      const stockCount = product._count.stockItems;
      acc[categoryName] = (acc[categoryName] || 0) + stockCount;
      return acc;
    }, {} as Record<string, number>);

    const categoriesChartData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
    
    const mainChartData = [
      { month: 'Jan', revenue: 4000 }, { month: 'Feb', revenue: 3000 }, { month: 'Mar', revenue: 5000 },
      { month: 'Apr', revenue: 4500 }, { month: 'May', revenue: 6000 }, { month: 'Jun', revenue: 5500 },
      { month: 'Jul', revenue: 7000 },
    ];

    // --- NEW & IMPROVED UI LAYOUT ---
    return (
      <main className="p-4 sm:px-6 sm:py-0 md:p-6 bg-gray-50 min-h-screen">
        {/* Top Section: KPI Cards */}
        <KpiSection data={kpiData} />
        
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Section: Main Chart */}
          <div className="lg:col-span-2">
            <MainChart data={mainChartData} />
          </div>
          
          {/* Right Section: Categories Chart */}
          <div className="lg:col-span-1">
            <CategoriesChart data={categoriesChartData} />
          </div>
        </div>

        {/* Bottom Section: Full-width Low Stock Alerts */}
        <div className="mt-6">
          <LowStockSection lowStockItems={lowStockItems} />
        </div>
        
        <Footer />
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h2 className="font-bold text-lg mb-2">Error Loading Dashboard</h2>
        <p>There was a problem fetching the required data. Please try again later.</p>
      </div>
    );
  }
}