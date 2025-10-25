'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function FixStockItemsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<any>(null);

  const checkStockItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/fix-stock-items', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCheckResult(data);
        toast.success('Stock items check completed');
      } else {
        toast.error('Failed to check stock items');
      }
    } catch (error) {
      toast.error('Error checking stock items');
    } finally {
      setIsLoading(false);
    }
  };

  const fixStockItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/fix-stock-items', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Fixed ${data.totalProductsFixed} products with ${data.totalStockItemsCreated} stock items`);
        // Refresh the check
        await checkStockItems();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to fix stock items');
      }
    } catch (error) {
      toast.error('Error fixing stock items');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Fix Stock Items</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Stock Items Diagnostic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={checkStockItems} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Checking...' : 'Check Stock Items'}
            </Button>
            
            <Button 
              onClick={fixStockItems} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Fixing...' : 'Fix Missing Stock Items'}
            </Button>
          </div>

          {checkResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Diagnostic Results:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Total Products:</strong> {checkResult.totalProducts}
                </div>
                <div>
                  <strong>Total Stock Items:</strong> {checkResult.totalStockItems}
                </div>
                <div>
                  <strong>Products Without Stock Items:</strong> {checkResult.productsWithoutStockItems}
                </div>
              </div>

              {checkResult.details && checkResult.details.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Products Missing Stock Items:</h4>
                  <div className="max-h-40 overflow-y-auto">
                    {checkResult.details.map((product: any) => (
                      <div key={product.id} className="text-xs p-2 border-b">
                        <strong>{product.name}</strong> (SKU: {product.sku}) - Quantity: {product.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Check Stock Items" to see which products are missing stock items</li>
            <li>Click "Fix Missing Stock Items" to automatically create stock items for products that don't have them</li>
            <li>After fixing, go to the Products page to see if the stock items appear</li>
            <li>Try creating a stock request - the "stock ID not found" error should be resolved</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
