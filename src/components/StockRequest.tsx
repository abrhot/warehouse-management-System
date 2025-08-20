'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StockForm } from './StockForm';
import { StockItemWithRelations } from '@/app/(main)/products/page';

export function StockRequest({ item }: { item: StockItemWithRelations }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <Button onClick={() => setOpen(true)}>Request Stock</Button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Stock</DialogTitle>
          </DialogHeader>

          <StockForm
            item={item}
            onClose={() => setOpen(false)} // closes modal + unmounts
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
