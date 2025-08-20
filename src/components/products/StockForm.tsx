'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { StockItemWithRelations } from '@/app/(main)/products/page';
import { Loader2 } from 'lucide-react';

export function StockForm({
  item,
  onClose,
}: {
  item: StockItemWithRelations;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safety: reset submitting if component unmounts
  useEffect(() => {
    return () => setIsSubmitting(false);
  }, []);

  const handleReset = () => {
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // prevent double submit
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/stock/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          stockItemId: item.id,
          notes: notes,
        }),
      });

      if (res.ok) {
        toast.success(`Request submitted for ${item.serialNumber}!`);
        handleReset();

        // FIX: reset submitting *before* closing modal
        setIsSubmitting(false);
        onClose();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to submit request.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error('Failed to send request. Check your network or server status.');
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
