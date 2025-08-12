// src/app/(main)/dashboard/page.tsx
import { KpiSection } from '@/components/dashboard/KpiSection';
import { MainChart } from '@/components/dashboard/MainChart';
import { CategoriesSidebar } from '@/components/dashboard/CategoriesSidebar';
import { LowStockSection } from '@/components/dashboard/LowStockSection';
import { Footer } from '@/components/dashboard/Footer';
import prisma from '@/lib/prisma';
import { Product, StockRequest, Category } from '@/generated/prisma';

export default async function DashboardPage() {
  // --- Fetch Data on the Server ---
  const totalProducts = await prisma.product.count();
  const pendingRequests = await prisma.stockRequest.count({ where: { status: 'PENDING' } });
  
  const lowStockItems = await prisma.product.findMany({
    where: { quantity: { lte: 10 } },
    select: { id: true, name: true, quantity: true },
  });
  
  const categoriesWithProducts = await prisma.category.findMany({
    include: {
      products: {
        select: {
          id: true,
          name: true,
          quantity: true,
          costPrice: true,
          sellingPrice: true,
        },
      },
    },
  });

  // --- Convert Decimal types to strings before passing to Client Components ---
  const convertedCategories = categoriesWithProducts.map(category => ({
    ...category,
    products: category.products.map(product => ({
      ...product,
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice?.toString() || null,
    })),
  }));

  const kpiData = {
    totalRevenue: 45231.89,
    stockOut: 1234,
    pendingRequests: pendingRequests,
    newProducts: 57,
  };

  const mainChartData = [
    { month: 'Jan', revenue: 4000 }, { month: 'Feb', revenue: 3000 }, { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 }, { month: 'May', revenue: 6000 }, { month: 'Jun', revenue: 5500 },
    { month: 'Jul', revenue: 7000 },
  ];

  return (
    <div className="p-4 md:p-6 bg-[#fafbf8] min-h-screen flex flex-col">
      {/* Top Section: Full-width KPI Cards */}
      <KpiSection data={kpiData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 mt-6">
        {/* Left Section: Main Chart */}
        <div className="lg:col-span-2 space-y-6">
          <MainChart data={mainChartData} />
          <LowStockSection lowStockItems={lowStockItems} />
        </div>
        
        {/* Right Section: Categories Sidebar */}
        <CategoriesSidebar categories={convertedCategories} />
      </div>
      
      <Footer />
    </div>
  );
}