'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ProductWithRelations } from '@/app/(main)/products/page';

export function StockForm({
  product,
  type,
  onClose,
}: {
  product: ProductWithRelations;
  type: 'IN' | 'OUT';
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [isMultipleMode, setIsMultipleMode] = useState(false);

  const handleReset = () => {
    setQuantity('');
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation 1: Check for decimals in the input string
    if (quantity.includes('.')) {
      toast.error('Quantity must be a whole number.');
      return;
    }
    
    // Validation 2: Parse as an integer and check if it's a valid number
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast.error('Quantity must be a valid whole number greater than 0.');
      return;
    }

    try {
      const res = await fetch('/api/stock/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: product.id,
          quantity: parsedQuantity,
          type: type,
          notes: notes,
        }),
      });

      if (res.ok) {
        toast.success(`Request submitted for ${product.name}!`);
        
        if (isMultipleMode) {
          handleReset();
        } else {
          onClose();
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to submit request.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error('Failed to send request. Check your network or server status.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-blue-50">
      <div className="flex justify-end items-center">
        <div className="flex items-center space-x-2">
          <Label htmlFor="multiple-mode" className="text-sm">Multiple</Label>
          <Switch
            id="multiple-mode"
            checked={isMultipleMode}
            onCheckedChange={setIsMultipleMode}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          step="1"
          placeholder="e.g., 50"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="bg-white border-gray-300"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-white border-gray-300"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="reset"
          variant="outline"
          onClick={handleReset}
          className="bg-white text-black border border-gray-300 hover:bg-blue-500 hover:text-white"
        >
          Reset
        </Button>

        <Button
          type="submit"
          variant="default"
          className="bg-white text-black border border-gray-300 hover:bg-blue-500 hover:text-white"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}