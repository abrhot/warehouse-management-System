// src/components/categories/CategoriesProductAnalytics.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CategoryWithProducts } from '@/app/(main)/categories/page';
import { PieChart as PieChartIcon, BarChart2 } from 'lucide-react';

interface CategoriesProductAnalyticsProps {
  categories: CategoryWithProducts[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF1906', '#8884d8'];

export function CategoriesProductAnalytics({ categories }: CategoriesProductAnalyticsProps) {
  const pieChartData = categories.map(cat => ({
    name: cat.name,
    value: cat.products.length,
  }));

  const totalProducts = categories.reduce((sum, cat) => sum + cat.products.length, 0);

  // Mock data for stock trends, replace with real data
  const stockTrendsData = [
    { name: 'Jan', 'Stock In': 400, 'Stock Out': 240 },
    { name: 'Feb', 'Stock In': 300, 'Stock Out': 139 },
    { name: 'Mar', 'Stock In': 200, 'Stock Out': 980 },
    { name: 'Apr', 'Stock In': 278, 'Stock Out': 390 },
    { name: 'May', 'Stock In': 189, 'Stock Out': 480 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {/* Products by Category Chart */}
      <Card className="p-4 border border-gray-200 shadow-sm">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <PieChartIcon className="h-5 w-5 text-gray-500" />
            Products by Category
          </CardTitle>
          <CardDescription className="text-gray-500">Total Products: {totalProducts}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Stock Trends Chart */}
      <Card className="p-4 border border-gray-200 shadow-sm">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <BarChart2 className="h-5 w-5 text-gray-500" />
            Monthly Stock Trends
          </CardTitle>
          <CardDescription className="text-gray-500">A look at monthly stock in and out trends.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Stock In" fill="#8884d8" />
              <Bar dataKey="Stock Out" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}