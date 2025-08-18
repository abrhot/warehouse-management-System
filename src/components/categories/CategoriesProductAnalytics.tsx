// src/components/reports/CategoriesProductAnalytics.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { CategoryWithProducts } from '@/app/(main)/categories/page';
import { PieChart as PieChartIcon, BarChart2, TrendingUp } from 'lucide-react';
import React from 'react';

interface CategoriesProductAnalyticsProps {
  categories: CategoryWithProducts[];
}

const COLORS = ['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#0ea5e9'];

// Mock data for stock trends, replace with real data
const stockTrendsData = [
  { name: 'Jan', 'Stock In': 400, 'Stock Out': 240 },
  { name: 'Feb', 'Stock In': 300, 'Stock Out': 139 },
  { name: 'Mar', 'Stock In': 200, 'Stock Out': 980 },
  { name: 'Apr', 'Stock In': 278, 'Stock Out': 390 },
  { name: 'May', 'Stock In': 189, 'Stock Out': 480 },
];

const requestsTrendsData = [
    { name: 'Jan', Requests: 120 },
    { name: 'Feb', Requests: 180 },
    { name: 'Mar', Requests: 90 },
    { name: 'Apr', Requests: 210 },
    { name: 'May', Requests: 160 },
];

export function CategoriesProductAnalytics({ categories }: CategoriesProductAnalyticsProps) {
  const pieChartData = categories.map(cat => ({
    name: cat.name,
    value: cat.products.length,
  }));

  const totalProducts = categories.reduce((sum, cat) => sum + cat.products.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Products by Category Chart (Top Left) */}
      <Card className="p-4 border border-gray-200 shadow-sm bg-white">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <PieChartIcon className="h-5 w-5 text-blue-600" />
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
                outerRadius={90}
                fill="#3b82f6"
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
      
      {/* Requests Trend Chart (Middle) */}
      <Card className="p-4 border border-gray-200 shadow-sm bg-white">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Requests Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={requestsTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="Requests" stroke="#2563eb" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stock In/Out Bar Chart (Top Right) */}
      <Card className="p-4 border border-gray-200 shadow-sm bg-white">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <BarChart2 className="h-5 w-5 text-blue-600" />
            Monthly Stock Trends
          </CardTitle>
          <CardDescription className="text-gray-500">A look at monthly stock in and out trends.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Stock In" fill="#3b82f6" />
              <Bar dataKey="Stock Out" fill="#93c5fd" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}