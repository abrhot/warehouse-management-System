'use client';

import { cn } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar } from 'recharts';

export function TinyBar({ values, color = '#1b4cff', className }: { values: number[]; color?: string; className?: string }) {
  const data = values.map((v, i) => ({ x: i, y: v }));
  return (
    <div className={cn('w-full h-12', className)}>
      <ResponsiveContainer width="100%" height={48}>
        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Bar dataKey="y" fill={color} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TinyBar;


