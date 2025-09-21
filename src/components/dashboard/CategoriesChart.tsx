'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';

export interface CategoryChartDatum {
  name: string;
  value: number;
}

// Blue/white palette with red accents
const COLORS = [
  '#1b4cff', '#5b7cfa', '#9db2ff', '#d5defb', '#0b2e9c', '#7aa2ff', '#bcd0ff', '#e8eeff',
  '#e74c3c', // red accent
  '#ffd3d0', // light red accent
];

export function CategoriesChart({ data }: { data: CategoryChartDatum[] }) {
  // FIX: Add state to ensure the chart only renders on the client-side.
  // This prevents SSR-related measurement errors from ResponsiveContainer.
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hasData = Array.isArray(data) && data.length > 0 && data.some(d => d.value > 0);

  return (
    <Card className="lg:col-span-1 shadow-sm">
      <CardHeader>
        <CardTitle>Inventory by Category</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        {hasData ? (
          // Only render the chart if we are on the client
          isClient ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label stroke="#ffffff" strokeWidth={2}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            // You can show a loading skeleton here if you prefer
            <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
              Loading chart...
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
            No category data to display
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CategoriesChart;

