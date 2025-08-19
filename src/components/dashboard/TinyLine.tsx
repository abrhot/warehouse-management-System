'use client';

import { cn } from '@/lib/utils';

// A very small inline sparkline using SVG, sized to fit inside the KPI card without enlarging it
export function TinyLine({ values, color = '#1b4cff', className }: { values: number[]; color?: string; className?: string }) {
  const width = 180; // fit within card content area
  const height = 36;
  const padding = 4;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const step = (width - padding * 2) / Math.max(values.length - 1, 1);

  const points = values.map((v, i) => {
    const x = padding + i * step;
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className={cn('w-full h-9', className)} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      {/* subtle area fill */}
      <polyline fill="none" stroke={`${color}33`} strokeWidth="6" points={points} opacity={0.2} />
    </svg>
  );
}

export default TinyLine;


