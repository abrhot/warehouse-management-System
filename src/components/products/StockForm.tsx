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
    
    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast.error('Quantity must be a valid number greater than 0.');
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-[#f0fdf4]">
      {/* This div containing the title has been removed to prevent duplication. */}
      {/* The switch is now the only item at the top. */}
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
          step="0.01"
          placeholder="e.g., 50.5"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="bg-[#edf3e8] text-[#141b0e] border-[#dae6d1] placeholder-[#6f9550] focus:ring-[#98FB98]"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-[#edf3e8] text-[#141b0e] border-[#dae6d1] placeholder-[#6f9550] focus:ring-[#98FB98]"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
       <Button
  type="reset"
  variant="outline"
  onClick={handleReset}
  // Add these classes for a light blue outline effect
  className="text-white border-blue-500 hover:bg-blue-100 hover:text-black"
>
  Reset
</Button>

<Button
  type="submit"
  variant="default"
  // Add these classes for a light green background
  className="text-white border-blue-500 hover:bg-blue-100 hover:text-black"
>
  Submit
</Button>
      </div>
    </form>
  );
}