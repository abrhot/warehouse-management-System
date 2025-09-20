import { KpiSection } from '@/components/dashboard/KpiSection';
import { MainChart } from '@/components/dashboard/MainChart';
import CategoriesChart from '@/components/dashboard/CategoriesChart';
import { LowStockSection } from '@/components/dashboard/LowStockSection';
import { Footer } from '@/components/dashboard/Footer';
import { prisma } from '@/lib/prisma'; // Corrected: Use a named import

// Helper function to get the date from 30 days ago
const getThirtyDaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date;
};

export default async function DashboardPage() {
  try {
    // --- Optimized Data Fetching with Error Handling ---

    // 1. KPI Data
    const totalItemsInStock = await prisma.stockItem.count({ where: { status: 'IN_STOCK' } });
    const totalProducts = await prisma.product.count();
    const pendingRequests = await prisma.stockRequest.count({ where: { status: 'PENDING' } });
    
    // Suggestion: Count products with zero items in stock.
    // This counts products that have NO related stockItems with the status 'IN_STOCK'.
    const stockOutCount = await prisma.product.count({
      where: {
        stockItems: {
          none: { status: 'IN_STOCK' }
        }
      }
    });

    // Suggestion: Count products created in the last 30 days.
    // This assumes your Product model has a `createdAt` field.
    const newProductsCount = await prisma.product.count({
      where: {
        createdAt: {
          gte: getThirtyDaysAgo(),
        }
      }
    });

    const kpiData = {
      totalProducts: totalProducts,
      stockOut: stockOutCount,
      pendingRequests: pendingRequests,
      newProducts: newProductsCount,
    };

    // 2. Low Stock Items
    // Your original logic is good and often necessary when comparing a count against a per-row value (`reorderLevel`).
    // For very large product catalogs, a raw SQL query might be more performant, but this is a solid approach.
    const productsWithStockCount = await prisma.product.findMany({
      include: {
        _count: {
          select: { stockItems: { where: { status: 'IN_STOCK' } } },
        },
      },
      orderBy: { name: 'asc' } // Keep the list consistent
    });

    const lowStockItems = productsWithStockCount
      .filter(p => p._count.stockItems <= p.reorderLevel)
      .map(p => ({
        id: p.id,
        name: p.name,
        quantity: p._count.stockItems,
        reorderLevel: p.reorderLevel,
      }));

    // 3. Categories Chart Data (Optimized)
    // This new approach is more efficient. It fetches all products with their category
    // and stock count in a single, flatter query, then aggregates the data in-memory.
    const productsForCategoryChart = await prisma.product.findMany({
        select: {
            category: { select: { name: true } },
            _count: {
                select: { stockItems: { where: { status: 'IN_STOCK' } } }
            }
        }
    });
    
    const categoryTotals = productsForCategoryChart.reduce((acc, product) => {
        const categoryName = product.category?.name || 'Uncategorized';
        const stockCount = product._count.stockItems;
        acc[categoryName] = (acc[categoryName] || 0) + stockCount;
        return acc;
    }, {} as Record<string, number>);

    const categoriesChartData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
    }));


    // 4. Main Chart Data (Placeholder)
    // Fetching real data would require a model like `Order` or `Sale`.
    // Example: `const monthlyRevenue = await getMonthlyRevenue();`
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
          <div className="lg-col-span-2 space-y-6">
            <MainChart data={mainChartData} />
            <LowStockSection lowStockItems={lowStockItems} />
          </div>
          
          {/* Right Section: Categories Chart */}
          <CategoriesChart data={categoriesChartData} />
        </div>
        
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // You can return a dedicated error component here for a better user experience
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h2 className="font-bold text-lg mb-2">Error Loading Dashboard</h2>
        <p>There was a problem fetching the required data. Please try again later.</p>
      </div>
    );
  }
}

