// src/components/dashboard/KpiCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

export function KpiCard({ title, value, percentage, trend, Icon, children }: any) {
  return (
    <Card className="shadow-sm bg-white text-[#141b0e]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-[#6f9550]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {percentage} from last month
        </p>
        {children ? (
          <div className="mt-3">
            {children}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
