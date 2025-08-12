// src/components/dashboard/StockTrendsChart.tsx
'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Replace with real data from your DB
const mainChartData = [
    { month: 'Jan', revenue: 4000 }, { month: 'Feb', revenue: 3000 }, { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 }, { month: 'May', revenue: 6000 }, { month: 'Jun', revenue: 5500 },
    { month: 'Jul', revenue: 7000 },
];

export function StockTrendsChart() {
  return (
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
  );
}