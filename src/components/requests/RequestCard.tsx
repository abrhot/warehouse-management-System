'use client';

import { UserRequestWithRelations } from '@/app/(main)/my-requests/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';

interface RequestCardProps {
  request: UserRequestWithRelations;
}

export function RequestCard({ request }: RequestCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          {request.stockItem?.product.name}
        </CardTitle>
        <p className="text-xs text-gray-500 font-mono pt-1">
          {request.stockItem?.serialNumber}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-400 mb-3">
          {new Date(request.createdAt).toLocaleDateString()}
        </p>

        {/* NEW: Conditionally render the rejection reason */}
        {request.status === 'REJECTED' && request.reason && (
          <>
            <Separator className="my-2" />
            <div className="text-sm text-destructive flex items-start space-x-2 pt-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Reason:</p>
                <p className="text-xs text-gray-600 italic">"{request.reason}"</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}