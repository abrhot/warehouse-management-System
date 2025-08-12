'use client';

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, ArrowUp, ArrowDown } from 'lucide-react';
import Papa from 'papaparse';

// --- MOCK DATA (Replace with API call) ---
const dailyTransactionsData = [
  { day: 'Mon', value: 50 }, { day: 'Tue', value: 65 }, { day: 'Wed', value: 60 },
  { day: 'Thu', value: 80 }, { day: 'Fri', value: 75 }, { day: 'Sat', value: 90 },
  { day: 'Sun', value: 85 },
];
const stockOutData = [
  { day: 'Mon', value: 80 }, { day: 'Tue', value: 90 }, { day: 'Wed', value: 110 },
  { day: 'Thu', value: 100 }, { day: 'Fri', value: 120 }, { day: 'Sat', value: 115 },
  { day: 'Sun', value: 130 },
];
const newProductsData = [
  { day: 'Mon', value: 5 }, { day: 'Tue', value: 3 }, { day: 'Wed', value: 7 },
  { day: 'Thu', value: 4 }, { day: 'Fri', value: 6 }, { day: 'Sat', value: 2 },
  { day: 'Sun', value: 8 },
];
const userActivityData = [
  { day: 'Mon', value: 25 }, { day: 'Tue', value: 30 }, { day: 'Wed', value: 28 },
  { day: 'Thu', value: 35 }, { day: 'Fri', value: 40 }, { day: 'Sat', value: 38 },
  { day: 'Sun', value: 42 },
];
const comparisonBarData = [
  { day: 'Mon', stockIn: 120, stockOut: 80 }, { day: 'Tue', stockIn: 150, stockOut: 90 },
  { day: 'Wed', stockIn: 100, stockOut: 110 }, { day: 'Thu', stockIn: 200, stockOut: 150 },
  { day: 'Fri', stockIn: 180, stockOut: 160 },
];
const recentRecordsData = [
  { id: '1', product: 'Industrial Widget', type: 'IN', quantity: 50, user: 'Admin', date: '2025-08-12' },
  { id: '2', product: 'Heavy-Duty Gear', type: 'OUT', quantity: 20, user: 'John Doe', date: '2025-08-12' },
  { id: '3', product: 'Standard Screw', type: 'IN', quantity: 2000, user: 'Admin', date: '2025-08-11' },
];

// --- MAIN COMPONENT ---
export default function ReportsPage() {
  const handleExport = () => {
    const csv = Papa.unparse(recentRecordsData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'recent_records_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold text-gray-900">Reports Dashboard</h1>
          <p className="mt-2 text-gray-600">A detailed analysis of warehouse operations.</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      {/* Main two-column layout for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: 2x2 Grid of Line Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <div className="flex items-center text-sm" style={{ color: '#1b4cff' }}>
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+15.2%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">450</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyTransactionsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <Line type="monotone" dataKey="value" stroke="#1b4cff" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Stock Out</CardTitle>
              <div className="flex items-center text-sm" style={{ color: '#ff4d4f' }}>
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+8.1%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">920</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockOutData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <Line type="monotone" dataKey="value" stroke="#ff4d4f" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Products</CardTitle>
              <div className="flex items-center text-sm" style={{ color: '#1b4cff' }}>
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+2 from last week</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">35</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={newProductsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <Line type="monotone" dataKey="value" stroke="#1b4cff" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <div className="flex items-center text-sm" style={{ color: '#1b4cff' }}>
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+5.5%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">42</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userActivityData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <Line type="monotone" dataKey="value" stroke="#1b4cff" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Main Bar Chart */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Daily Stock Comparison</CardTitle>
            <CardDescription>Stock In (Blue) vs. Stock Out (Dark)</CardDescription>
          </CardHeader>
          <CardContent className="h-[460px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonBarData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3}/>
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--background))' }} />
                <Legend />
                <Bar dataKey="stockIn" name="Stock In" fill="#1b4cff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stockOut" name="Stock Out" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Recent Records */}
      <div className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
            <CardDescription>A list of the most recent stock movements.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRecordsData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.product}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.type === 'IN' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">{record.quantity}</TableCell>
                    <TableCell>{record.user}</TableCell>
                    <TableCell>{record.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}