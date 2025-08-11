// src/components/products/StockForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Toaster, toast } from 'sonner';
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
  const router = useRouter();
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0.');
      return;
    }

    const res = await fetch('/api/stock/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        quantity: quantity,
        type: type,
        notes: notes,
      }),
    });

    if (res.ok) {
      toast.success(`Stock update successful for ${product.name}!`);
      onClose();
      router.refresh();
    } else {
      toast.error('Failed to update stock.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <Toaster position="bottom-right" />
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  );
}