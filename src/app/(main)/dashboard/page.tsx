// src/app/(main)/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertsCard } from '@/components/dashboard/alerts-card';
import { StockOverview } from '@/components/dashboard/StockOverview';
import { Footer } from '@/components/dashboard/Footer';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Package, Warehouse, History } from 'lucide-react';
import prisma from '@/lib/prisma';
import { Product, StockRequest, AuditLog } from '@/generated/prisma';

export default async function DashboardPage() {
  // --- Fetch All Data on the Server ---
  const products: Product[] = await prisma.product.findMany({
    include: { category: true, stockRequests: true },
  });

  const pendingRequests: StockRequest[] = await prisma.stockRequest.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });

  const lowStockItems = products.filter(p => p.quantity <= p.reorderLevel);

  // You would fetch data for charts and other stats here
  // Mock data for trends, replace with real data from your DB
  const mainChartData = [
    { month: 'Jan', revenue: 4000 }, { month: 'Feb', revenue: 3000 }, { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 }, { month: 'May', revenue: 6000 }, { month: 'Jun', revenue: 5500 },
    { month: 'Jul', revenue: 7000 },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#fafbf8]">
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Products" value={products.length.toString()} percentage="+10%" trend="up" Icon={Package} />
        <KpiCard title="Pending Requests" value={pendingRequests.length.toString()} percentage="+180.1%" trend="up" Icon={History} />
        <KpiCard title="Low Stock Items" value={lowStockItems.length.toString()} percentage="-5.0%" trend="down" Icon={Warehouse} />
        {/* Placeholder KPI, fetch real data */}
        <KpiCard title="Stock Out Today" value="12" percentage="+5%" trend="up" Icon={History} />
      </div>

      {/* Main Chart Card (minimized) */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle>Stock Trends</CardTitle></CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="80%" height="100%" className="mx-auto">
            <AreaChart data={mainChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#98FB98" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#98FB98" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#98FB98" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* New Information Section: Alerts & Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AlertsCard lowStock={lowStockItems} pendingRequests={pendingRequests} />
        <StockOverview products={products} />
        {/* Placeholder for optional Warehouse Map */}
        <Card className="lg:col-span-1 shadow-sm bg-[#edf3e8]">
          <CardHeader><CardTitle>Warehouse Map</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-[#6f9550]">This section is optional and can be used for a visual representation of your warehouse layout.</p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Reusable KPI Card (Client Component)
// We'll move this to a separate file for better organization.
// src/components/dashboard/KpiCard.tsx
// 'use client';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// const KpiCard = ({ title, value, percentage, trend, Icon, color }: any) => { /* ... */ };
// export { KpiCard };