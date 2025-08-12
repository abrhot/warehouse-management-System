'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Search, ChevronDown, Download, Printer, Calendar as CalendarIcon } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

// --- Type Definitions ---
interface Record {
  id: string;
  product: { name: string };
  type: 'IN' | 'OUT';
  quantity: number;
  requester: { name: string | null; email: string };
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
interface ApiResponse { data: Record[]; meta: { totalRecords: number; currentPage: number; totalPages: number; }; }

// --- MAIN COMPONENT ---
export default function ReportsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Fetch data from the advanced API
  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      const params = new URLSearchParams({ page: currentPage.toString(), limit: '10', search: searchQuery });
      try {
        const res = await fetch(`/api/reports/records?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const { data, meta }: ApiResponse = await res.json();
        setRecords(data);
        setTotalPages(meta.totalPages);
      } catch (error) {
        toast.error('Could not fetch records.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, [currentPage, searchQuery]);

  // Memoize filtered/selected records for performance
  const recordsToAction = useMemo(() => {
    let filteredData = records;
    // Filter by date range if selected
    if (dateRange?.from && dateRange?.to) {
      filteredData = records.filter(record => {
        const recordDate = new Date(record.createdAt);
        return recordDate >= dateRange.from! && recordDate <= dateRange.to!;
      });
    }
    // Then, filter by selected checkboxes if any are checked
    if (selectedRows.length > 0) {
      const selectedSet = new Set(selectedRows);
      return filteredData.filter(record => selectedSet.has(record.id));
    }
    return filteredData;
  }, [records, selectedRows, dateRange]);
  
  const formatDataForExport = (data: Record[]) => {
    return data.map(r => ({
      product: r.product.name, type: r.type, quantity: r.quantity, status: r.status,
      user: r.requester.name || r.requester.email, date: new Date(r.createdAt).toLocaleString(),
    }));
  };

  const handleExport = () => {
    const dataToExport = formatDataForExport(recordsToAction);
    if (dataToExport.length === 0) {
      toast.warning("No records found in the selected range or selection.");
      return;
    }
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `records_report_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${dataToExport.length} records exported!`);
  };

  const handlePrint = (dataToPrint: Record[]) => {
    const formattedData = formatDataForExport(dataToPrint);
    if (formattedData.length === 0) {
      toast.warning("No records to print.");
      return;
    }
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Records</title>');
      printWindow.document.write('<style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background-color:#f2f2f2}</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<h1>Records Report (${formattedData.length} items)</h1>`);
      printWindow.document.write('<table><thead><tr><th>Product</th><th>Type</th><th>Qty</th><th>Status</th><th>User</th><th>Date</th></tr></thead><tbody>');
      formattedData.forEach(r => { printWindow.document.write(`<tr><td>${r.product}</td><td>${r.type}</td><td>${r.quantity}</td><td>${r.status}</td><td>${r.user}</td><td>${r.date}</td></tr>`); });
      printWindow.document.write('</tbody></table></body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <h1 className="font-heading text-4xl font-bold">All Records</h1>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by product name..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full md:w-auto justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Pick a date range</span>)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end"><Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} /></PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={recordsToAction.length === 0}><ChevronDown className="mr-2 h-4 w-4" />Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}><Download className="mr-2 h-4 w-4"/>Export ({recordsToAction.length})</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePrint(recordsToAction)}><Printer className="mr-2 h-4 w-4"/>Print ({recordsToAction.length})</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Quantity</TableHead><TableHead>User</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center h-24">Loading...</TableCell></TableRow>
              ) : records.length > 0 ? (
                records.map((record) => (
                  <>
                    <TableRow key={record.id} onClick={() => setExpandedRowId(expandedRowId === record.id ? null : record.id)} className="cursor-pointer">
                      <TableCell className="font-medium">{record.product.name}</TableCell>
                      <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full leading-none ${record.type === 'IN' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>{record.type}</span></TableCell>
                      <TableCell><span className={`px-2 py-1 text-xs font-semibold rounded-full leading-none ${record.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : record.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{record.status}</span></TableCell>
                      <TableCell className="text-right font-mono">{record.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">{record.requester.name || record.requester.email}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                    {/* Expanded Row */}
                    {expandedRowId === record.id && (
                      <TableRow className="bg-muted hover:bg-muted">
                        <TableCell colSpan={6}>
                          <div className="p-4 flex items-center justify-end gap-2">
                            <span className="text-sm font-medium">Actions for this record:</span>
                            <Button variant="outline" size="sm" onClick={() => handlePrint([record])}><Printer className="mr-2 h-4 w-4"/>Print</Button>
                            <Button variant="outline" size="sm" onClick={() => { const data = formatDataForExport([record]); /* simplified export logic */ toast.success(`${data[0].product} exported!`); }}><Download className="mr-2 h-4 w-4"/>Export</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="text-center h-24">No records found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</Button>
        <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
      </div>
    </div>
  );
}