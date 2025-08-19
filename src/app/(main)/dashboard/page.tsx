// src/app/(main)/dashboard/page.tsx
import { KpiSection } from '@/components/dashboard/KpiSection';
import { MainChart } from '@/components/dashboard/MainChart';
import CategoriesChart from '@/components/dashboard/CategoriesChart';
import { LowStockSection } from '@/components/dashboard/LowStockSection';
import { Footer } from '@/components/dashboard/Footer';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  // --- Fetch Data on the Server with Updated Logic ---

  // Total items now counts every single physical item in stock
  const totalItemsInStock = await prisma.stockItem.count({ where: { status: 'IN_STOCK' } });
  const totalProducts = await prisma.product.count();
  const pendingRequests = await prisma.stockRequest.count({ where: { status: 'PENDING' } });

  // New logic for finding low stock items
  // 1. Get all products and count their associated "IN_STOCK" items
  const productsWithStockCount = await prisma.product.findMany({
    include: {
      _count: {
        select: {
          stockItems: {
            where: { status: 'IN_STOCK' },
          },
        },
      },
    },
  });

  // 2. Filter these products in code to see which are below their reorder level
  const lowStockItems = productsWithStockCount
    .filter(p => p._count.stockItems <= p.reorderLevel)
    .map(p => ({
      id: p.id,
      name: p.name,
      quantity: p._count.stockItems, // Pass the count as 'quantity' to the component
      reorderLevel: p.reorderLevel,
    }));

  // New logic for fetching categories with their product stock counts
  const categoriesWithProducts = await prisma.category.findMany({
    include: {
      products: {
        include: {
          _count: {
            select: {
              stockItems: { where: { status: 'IN_STOCK' } },
            },
          },
        },
      },
    },
  });

  // --- Build chart data: category name -> total items in stock across its products ---
  const categoriesChartData = categoriesWithProducts.map(category => ({
    name: category.name,
    value: category.products.reduce((sum, product) => sum + (product._count?.stockItems ?? 0), 0),
  }));

  const kpiData = {
    totalProducts: totalProducts,
    stockOut: 1234, // Placeholder data
    pendingRequests: pendingRequests,
    newProducts: totalItemsInStock, // Placeholder: using items in stock for demo
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
        {/* Left Section: Main Chart & Low Stock */}
        <div className="lg:col-span-2 space-y-6">
          <MainChart data={mainChartData} />
          <LowStockSection lowStockItems={lowStockItems} />
        </div>
        
        {/* Right Section: Categories Chart */}
        <CategoriesChart data={categoriesChartData} />
      </div>
      
      <Footer />
    </div>
  );
}