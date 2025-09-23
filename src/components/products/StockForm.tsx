// src/components/products/StockForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { StockItemWithRelations } from '@/app/(main)/products/page';
import { Loader2 } from 'lucide-react';

export function StockForm({
  item,
  onSuccess,
  type, // Added type prop
}: {
  item: StockItemWithRelations;
  onSuccess: () => void;
  type: 'IN' | 'OUT'; // Added type prop
}) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/stock/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          stockItemId: item.id,
          notes: notes,
          type: type, // Pass the type in the body
        }),
      });

      if (res.ok) {
        toast.success(`Request submitted for ${item.serialNumber}!`);
        handleReset();
        onSuccess(); // ✅ let parent handle sheet close + refresh
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to submit request.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error('Failed to send request. Check your network or server status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 bg-blue-50 rounded-lg shadow-md"
    >
      <div>
        <Label htmlFor="serial-number">Serial Number</Label>
        <p id="serial-number" className="font-bold text-lg">
          {item.serialNumber}
        </p>
      </div>

      <div>
        <Label htmlFor="notes">Remark / Reason</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-white border-gray-300"
          placeholder="e.g., For project X, client delivery, etc."
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="bg-white text-black border border-gray-300 hover:bg-blue-500 hover:text-white"
          disabled={isSubmitting}
        >
          Reset
        </Button>

        <Button
          type="submit"
          variant="default"
          className="bg-blue-500 text-white hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </Button>
      </div>
    </form>
  );
}