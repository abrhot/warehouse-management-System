import { KpiSection } from '@/components/dashboard/KpiSection';
import { MainChart } from '@/components/dashboard/MainChart';
import CategoriesChart from '@/components/dashboard/CategoriesChart';
import { LowStockSection } from '@/components/dashboard/LowStockSection';
import { Footer } from '@/components/dashboard/Footer';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, AlertTriangle, Package, RefreshCw } from 'lucide-react';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// Force dynamic rendering to get fresh user data
export const dynamic = 'force-dynamic';

// Utility: get date 30 days ago
const getThirtyDaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date;
};

// Fetch all dashboard data in parallel
async function getDashboardData() {
  try {
    // Run all queries in parallel
    const [
      totalProducts,
      pendingRequests,
      stockOutCount,
      newProductsCount,
      productsWithStockCount,
      productsForCategoryChart,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.stockRequest.count({ where: { status: 'PENDING' } }),
      prisma.product.count({
        where: { stockItems: { none: { status: 'IN_STOCK' } } },
      }),
      prisma.product.count({
        where: { createdAt: { gte: getThirtyDaysAgo() } },
      }),
      prisma.product.findMany({
        include: {
          _count: { select: { stockItems: { where: { status: 'IN_STOCK' } } } },
          category: true,
        },
        orderBy: { name: 'asc' },
        take: 50, // Limit to 50 products for performance
      }),
      prisma.product.findMany({
        select: {
          category: { select: { name: true } },
          _count: { select: { stockItems: { where: { status: 'IN_STOCK' } } } },
        },
        take: 100, // Limit to 100 products for the chart
      }),
    ]);

    // Process low stock items
    const lowStockItems = productsWithStockCount
      .filter(p => p._count.stockItems <= p.reorderLevel)
      .map(p => ({
        id: p.id,
        name: p.name,
        quantity: p._count.stockItems,
        reorderLevel: p.reorderLevel,
        category: p.category?.name || 'Uncategorized',
      }))
      .slice(0, 4);

    // Process categories data
    const categoryTotals = productsForCategoryChart.reduce((acc, product) => {
      const categoryName = product.category?.name || 'Uncategorized';
      const stockCount = product._count.stockItems;
      acc[categoryName] = (acc[categoryName] || 0) + stockCount;
      return acc;
    }, {} as Record<string, number>);

    const categoriesChartData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value) // Sort by value descending
      .slice(0, 8); // Limit to top 8 categories

    // Sample data for main chart (replace with actual data if available)
    const mainChartData = [
      { month: 'Jan', revenue: 4000 },
      { month: 'Feb', revenue: 3000 },
      { month: 'Mar', revenue: 5000 },
      { month: 'Apr', revenue: 4500 },
      { month: 'May', revenue: 6000 },
      { month: 'Jun', revenue: 5500 },
      { month: 'Jul', revenue: 7000 },
    ];

    return {
      kpiData: {
        totalProducts,
        stockOut: stockOutCount,
        pendingRequests,
        newProducts: newProductsCount,
      },
      lowStockItems,
      categoriesChartData,
      mainChartData,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

// Placeholder component for recent activity items
const ActivityItem = ({ title, description, time }: { title: string; description: string; time: string }) => (
  <div className="flex items-start gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
      <Activity className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
      <time className="text-xs text-muted-foreground">{time}</time>
    </div>
  </div>
);

export default async function DashboardPage() {
  try {
    // Get user info from JWT token
    const cookieStore = cookies();
    const token = cookieStore.get('authToken')?.value;
    
    let userName = 'User';
    let userRole = 'USER';
    
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
        const { payload } = await jwtVerify(token, secret);
        userName = (payload as any).name || (payload as any).email?.split('@')[0] || 'User';
        userRole = (payload as any).role || 'USER';
      } catch (error) {
        console.error('JWT verification failed:', error);
      }
    }

    const { kpiData, lowStockItems, categoriesChartData, mainChartData } = await getDashboardData();

    // Get greeting based on time of day
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    // --- Render Dashboard ---
    return (
      <main className="p-4 sm:px-6 md:p-8 bg-gray-50 min-h-screen">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {greeting}, {userName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your warehouse today.
          </p>
        </div>

        {/* KPI Section */}
        <KpiSection data={kpiData} />

        {/* Main Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Column 1 */}
          <div className="space-y-8">
            <MainChart data={mainChartData} />
            <LowStockSection lowStockItems={lowStockItems} />
          </div>

          {/* Column 2 */}
          <div className="space-y-8">
            <CategoriesChart data={categoriesChartData} />

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ActivityItem
                  title="New Product Added"
                  description="Heavy Duty Wrench was added to inventory"
                  time="15 minutes ago"
                />
                <ActivityItem
                  title="Stock Request Approved"
                  description="Request for Safety Goggles was approved"
                  time="2 hours ago"
                />
                <ActivityItem
                  title="User Logged In"
                  description="Admin user logged in from new device"
                  time="1 day ago"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </main>
    );
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h2 className="font-bold text-lg mb-2">Error Loading Dashboard</h2>
        <p>There was a problem fetching the required data. Please try again later.</p>
      </div>
    );
  }
}
