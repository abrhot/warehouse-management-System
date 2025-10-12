'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package, 
  FolderOpen,
  Loader2,
  Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PendingProduct {
  id: string;
  sku: string;
  name: string;
  location: string | null;
  reorderLevel: number;
  weight: number | null;
  dimensions: string | null;
  costPrice: string;
  sellingPrice: string | null;
  quantity: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
    description: string | null;
  };
  supplier: {
    id: number;
    name: string;
    contactInfo: string | null;
  } | null;
  submitter: {
    id: string;
    name: string | null;
    email: string;
  };
  reviewer: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface PendingCategory {
  id: string;
  name: string;
  description: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  submitter: {
    id: string;
    name: string | null;
    email: string;
  };
  reviewer: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export function ApprovalsPageContent() {
  const router = useRouter();
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [pendingCategories, setPendingCategories] = useState<PendingCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PendingProduct | PendingCategory | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    try {
      setIsLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/pending-products', { credentials: 'include' }),
        fetch('/api/pending-categories', { credentials: 'include' }),
      ]);

      if (productsResponse.ok) {
        const products = await productsResponse.json();
        setPendingProducts(products);
      }

      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();
        setPendingCategories(categories);
      }
    } catch (error) {
      console.error('Error fetching pending items:', error);
      toast.error('Failed to load pending items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = (item: PendingProduct | PendingCategory, action: 'approve' | 'reject') => {
    setSelectedItem(item);
    setReviewAction(action);
    setReviewNotes('');
    setShowReviewDialog(true);
  };

  const submitReview = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      const isProduct = 'sku' in selectedItem;
      const endpoint = isProduct 
        ? `/api/pending-products/${selectedItem.id}/${reviewAction}`
        : `/api/pending-categories/${selectedItem.id}/${reviewAction}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          notes: reviewNotes || undefined,
        }),
      });

      if (response.ok) {
        toast.success(`${isProduct ? 'Product' : 'Category'} ${reviewAction}d successfully!`);
        setShowReviewDialog(false);
        fetchPendingItems();
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to ${reviewAction} item`);
      }
    } catch (error) {
      console.error(`Error ${reviewAction}ing item:`, error);
      toast.error(`Failed to ${reviewAction} item`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pending Approvals</h1>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            {pendingProducts.filter(p => p.status === 'PENDING').length} Products
          </span>
          <span className="flex items-center gap-1">
            <FolderOpen className="h-4 w-4" />
            {pendingCategories.filter(c => c.status === 'PENDING').length} Categories
          </span>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products ({pendingProducts.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Categories ({pendingCategories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Pending Products</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending products to review.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category.name}</TableCell>
                        <TableCell>{product.submitter.email}</TableCell>
                        <TableCell>{formatDate(product.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {product.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReview(product, 'approve')}
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                >
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReview(product, 'reject')}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Pending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingCategories.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending categories to review.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell>{category.submitter.email}</TableCell>
                        <TableCell>{formatDate(category.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(category.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {category.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReview(category, 'approve')}
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                >
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReview(category, 'reject')}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} {selectedItem && 'sku' in selectedItem ? 'Product' : 'Category'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <div className="space-y-2 mt-4">
                  <p><strong>Name:</strong> {'sku' in selectedItem ? selectedItem.name : selectedItem.name}</p>
                  {'sku' in selectedItem && <p><strong>SKU:</strong> {selectedItem.sku}</p>}
                  <p><strong>Submitted by:</strong> {selectedItem.submitter.email}</p>
                  <p><strong>Date:</strong> {formatDate(selectedItem.createdAt)}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">
                {reviewAction === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason *'}
              </Label>
              <Textarea
                id="notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={
                  reviewAction === 'approve' 
                    ? 'Add any notes about the approval...' 
                    : 'Please provide a reason for rejection...'
                }
                rows={3}
                required={reviewAction === 'reject'}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              disabled={isSubmitting || (reviewAction === 'reject' && !reviewNotes.trim())}
              className={reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {reviewAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
