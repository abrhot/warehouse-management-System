'use client';

import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export function TinyArea({ values, color = '#1b4cff', className }: { values: number[]; color?: string; className?: string }) {
  const data = values.map((v, i) => ({ x: i, y: v }));
  return (
    <div className={cn('w-full h-12', className)}>
      <ResponsiveContainer width="100%" height={48}>
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Area type="monotone" dataKey="y" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.15} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TinyArea;


