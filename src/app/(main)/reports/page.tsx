'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, ArrowUp, ArrowDown } from 'lucide-react';
import Papa from 'papaparse';

// --- Type Definitions ---
interface Record {
  id: string;
  product: { name: string };
  type: 'IN' | 'OUT';
  quantity: number;
  requester: { name: string | null; email: string };
  updatedAt: string; // Using updatedAt for history
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// --- MOCK DATA ---
const sampleRecordsData = [
  { id: 'sample-1', product: { name: 'Sample: Industrial Widget' }, type: 'IN', quantity: 50, requester: { name: 'Admin', email:'' }, updatedAt: new Date().toISOString(), status: 'APPROVED' },
  { id: 'sample-2', product: { name: 'Sample: Heavy-Duty Gear' }, type: 'OUT', quantity: 20, requester: { name: 'John Doe', email:'' }, updatedAt: new Date().toISOString(), status: 'REJECTED' },
  { id: 'sample-3', product: { name: 'Sample: Standard Screw' }, type: 'IN', quantity: 2000, requester: { name: 'Admin', email:'' }, updatedAt: new Date().toISOString(), status: 'APPROVED' },
];
const dailyTransactionsData = [ { day: 'Mon', value: 50 }, { day: 'Tue', value: 65 }, { day: 'Wed', value: 60 }, { day: 'Thu', value: 80 }, { day: 'Fri', value: 75 }, { day: 'Sat', value: 90 }, { day: 'Sun', value: 85 }, ];
const stockOutData = [ { day: 'Mon', value: 80 }, { day: 'Tue', value: 90 }, { day: 'Wed', value: 110 }, { day: 'Thu', value: 100 }, { day: 'Fri', value: 120 }, { day: 'Sat', value: 115 }, { day: 'Sun', value: 130 }, ];
const newProductsData = [ { day: 'Mon', value: 5 }, { day: 'Tue', value: 3 }, { day: 'Wed', value: 7 }, { day: 'Thu', value: 4 }, { day: 'Fri', value: 6 }, { day: 'Sat', value: 2 }, { day: 'Sun', value: 8 }, ];
const userActivityData = [ { day: 'Mon', value: 25 }, { day: 'Tue', value: 30 }, { day: 'Wed', value: 28 }, { day: 'Thu', value: 35 }, { day: 'Fri', value: 40 }, { day: 'Sat', value: 38 }, { day: 'Sun', value: 42 }, ];
const comparisonBarData = [ { day: 'Mon', stockIn: 120, stockOut: 80 }, { day: 'Tue', stockIn: 150, stockOut: 90 }, { day: 'Wed', stockIn: 100, stockOut: 110 }, { day: 'Thu', stockIn: 200, stockOut: 150 }, { day: 'Fri', stockIn: 180, stockOut: 160 }, ];


// --- MAIN COMPONENT ---
export default function ReportsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        // UPDATED: Fetching from your history endpoint
        const res = await fetch('/api/reports/history');
        if (res.ok) {
          const data = await res.json();
          // If database history is empty, show sample data. Otherwise, show real data.
          if (data.length === 0) {
            setRecords(sampleRecordsData);
          } else {
            setRecords(data);
          }
        } else {
          setRecords(sampleRecordsData);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
        setRecords(sampleRecordsData); // Show sample data on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleExport = () => {
    const csv = Papa.unparse(records.map(r => ({
      product: r.product.name,
      type: r.type,
      status: r.status,
      quantity: r.quantity,
      user: r.requester.name || 'N/A',
      date_processed: new Date(r.updatedAt).toLocaleDateString(),
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'history_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <div className="flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle><div className="flex items-center text-xs font-semibold" style={{ color: '#1b4cff' }}><ArrowUp className="h-4 w-4" /><span>+15.2%</span></div></div>
              <div className="text-2xl font-bold font-heading mt-1">450</div>
            </CardHeader>
            <CardContent className="p-0 h-10"><ResponsiveContainer width="100%" height="100%"><LineChart data={dailyTransactionsData}><Line type="monotone" dataKey="value" stroke="#1b4cff" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <div className="flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium text-muted-foreground">Stock Out</CardTitle><div className="flex items-center text-xs font-semibold" style={{ color: '#ff4d4f' }}><ArrowUp className="h-4 w-4" /><span>+8.1%</span></div></div>
              <div className="text-2xl font-bold font-heading mt-1">920</div>
            </CardHeader>
            <CardContent className="p-0 h-10"><ResponsiveContainer width="100%" height="100%"><LineChart data={stockOutData}><Line type="monotone" dataKey="value" stroke="#ff4d4f" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <div className="flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium text-muted-foreground">New Products</CardTitle><div className="flex items-center text-xs font-semibold text-muted-foreground"><ArrowDown className="h-4 w-4" /><span>-5.0%</span></div></div>
              <div className="text-2xl font-bold font-heading mt-1">35</div>
            </CardHeader>
            <CardContent className="p-0 h-10"><ResponsiveContainer width="100%" height="100%"><LineChart data={newProductsData}><Line type="monotone" dataKey="value" stroke="#1b4cff" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="p-3">
              <div className="flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle><div className="flex items-center text-xs font-semibold" style={{ color: '#1b4cff' }}><ArrowUp className="h-4 w-4" /><span>+5.5%</span></div></div>
              <div className="text-2xl font-bold font-heading mt-1">42</div>
            </CardHeader>
            <CardContent className="p-0 h-10"><ResponsiveContainer width="100%" height="100%"><LineChart data={userActivityData}><Line type="monotone" dataKey="value" stroke="#1b4cff" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></CardContent>
          </Card>
        </div>
        <Card className="h-full shadow-sm">
          <CardHeader><CardTitle>Daily Stock Comparison</CardTitle><CardDescription>Stock In (Blue) vs. Stock Out (Light Dark)</CardDescription></CardHeader>
          <CardContent className="h-[85%] pt-4">
            <ResponsiveContainer width="100%" height="100%"><BarChart data={comparisonBarData}><CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3}/><XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} /><YAxis fontSize={12} tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: 'hsl(var(--background))' }} /><Legend /><Bar dataKey="stockIn" name="Stock In" fill="#1b4cff" radius={[4, 4, 0, 0]} /><Bar dataKey="stockOut" name="Stock Out" fill="#94a3b8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="pt-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div >
              <CardTitle>Request History</CardTitle>
              <CardDescription>A list of all processed stock requests.</CardDescription>
            </div>
            <Button onClick={handleExport} disabled={records.length === 0}><Download className="mr-2 h-4 w-4" />Export History</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Status</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Quantity</TableHead><TableHead>User</TableHead><TableHead>Date Processed</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center">Loading history...</TableCell></TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{record.product.name}</TableCell>
                      <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full leading-none ${record.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{record.status}</span></TableCell>
                      <TableCell className="text-muted-foreground">{record.type}</TableCell>
                      <TableCell className="text-right font-mono">{record.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">{record.requester.name}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(record.updatedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}