'use client';

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PendingRequest {
  id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  createdAt: string;
  notes: string | null;
  serialNumber?: string; // ✅ added so we can show serial number
  product: {
    name: string;
    quantity: number;
  };
  requester: {
    name: string | null;
    email: string;
  };
}

export function PendingRequests() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectionRemark, setRejectionRemark] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stock/pending');
      if (!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleProcessRequest = async (requestId: string, newStatus: 'APPROVED' | 'REJECTED', remark?: string) => {
    try {
      const res = await fetch('/api/stock/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, newStatus, remark }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process request');
      }
      toast.success(`Request successfully ${newStatus.toLowerCase()}!`);
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
      setIsRejectDialogOpen(false);
      setRejectionRemark('');
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const openRejectDialog = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsRejectDialogOpen(true);
  };

  const handleRejectSubmit = () => {
    if (selectedRequestId && rejectionRemark) {
      handleProcessRequest(selectedRequestId, 'REJECTED', rejectionRemark);
    } else {
      toast.error('A rejection remark is required.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-200"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="rounded-lg bg-red-100 p-6 text-center shadow-sm">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Requests</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border-gray-200 bg-white min-w-[700px]">
      <Toaster position="bottom-right" />
      <CardHeader className="p-4 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          Pending Stock Requests
          <Badge variant="secondary" className="bg-blue-100 text-blue-600 hover:bg-blue-200">
            {requests.length} Total
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-500">
          Review and manage all incoming stock requests.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No pending requests at this time.</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-[calc(100vh-20rem)]">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[150px]">Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead className="w-[200px]">Requester</TableHead>
                  <TableHead className="w-[150px]">Requested On</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <Accordion type="single" collapsible key={req.id} asChild>
                    <AccordionItem value={req.id} className="border-b last:border-b-0">
                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">
                          <AccordionTrigger className="p-0 hover:no-underline">
                            <span className="truncate">{req.product.name}</span>
                          </AccordionTrigger>
                        </TableCell>
                        <TableCell>
                          <Badge className={`px-2 py-1 ${req.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {req.type === 'IN' ? 'Stock In' : 'Stock Out'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">{req.serialNumber || 'N/A'}</TableCell>
                        <TableCell className="text-gray-500">{req.requester.name || req.requester.email}</TableCell>
                        <TableCell className="text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right p-2">
                          <Button
                            onClick={() => openRejectDialog(req.id)}
                            variant="destructive"
                            size="sm"
                            className="mr-2"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleProcessRequest(req.id, 'APPROVED')}
                            variant="default"
                            size="sm"
                            className="bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <AccordionContent className="bg-gray-50 px-6 py-4 border-t">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <FileText className="w-4 h-4" />
                          <span className="font-semibold">Notes:</span>
                          <span className="text-sm">{req.notes || 'N/A'}</span>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Reject Remark Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this request.
            </AlertDialogDescription>
            <div className="mt-4 space-y-2">
              <Label htmlFor="rejection-remark">Rejection Remark</Label>
              <Textarea
                id="rejection-remark"
                value={rejectionRemark}
                onChange={(e) => setRejectionRemark(e.target.value)}
                placeholder="e.g., Not enough stock, incorrect quantity"
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectionRemark('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectSubmit} className="bg-red-600 text-white hover:bg-red-700">
              Submit Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
