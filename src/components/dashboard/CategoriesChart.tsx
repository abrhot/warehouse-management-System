'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';

export interface CategoryChartDatum {
  name: string;
  value: number;
}

// A simple purple color for the cells
const CELL_COLOR = 'bg-blue-600 text-white';
const EMPTY_CELL_COLOR = 'bg-gray-100';

// Defines the number of blocks in the grid for the bar chart effect
const TOTAL_BLOCKS = 10;

export function CategoriesChart({ data }: { data: CategoryChartDatum[] }) {
  // Find the maximum value in the dataset to scale the bars correctly
  const maxValue = Math.max(...data.map(item => item.value), 0);

  const hasData = Array.isArray(data) && data.length > 0 && data.some(d => d.value > 0);

  return (
    <Card className="lg:col-span-1 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Category Stock Levels</CardTitle>
        <Layers size={16} className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-3 text-sm">
            {/* Map over the actual category data */}
            {data.map((category, rowIndex) => {
              // Calculate how many blocks should be filled based on the category's value
              const filledBlocks = maxValue > 0 ? Math.round((category.value / maxValue) * TOTAL_BLOCKS) : 0;

              return (
                <div key={rowIndex} className="grid grid-cols-12 gap-2 items-center">
                  {/* Category Name */}
                  <div className="col-span-4 text-xs text-gray-600 font-medium truncate pr-2">{category.name}</div>
                  
                  {/* Heatmap-style Bar */}
                  <div className="col-span-8 grid grid-cols-10 gap-1">
                    {Array.from({ length: TOTAL_BLOCKS }).map((_, colIndex) => (
                      <div
                        key={colIndex}
                        className={`
                          h-6 rounded
                          ${colIndex < filledBlocks ? CELL_COLOR : EMPTY_CELL_COLOR}
                        `}
                      >
                        {/* The first block shows the actual value */}
                        {colIndex === 0 && (
                           <span className="flex items-center justify-center h-full text-xs font-bold">
                             {category.value}
                           </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
           <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground py-10">
            No category data to display
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CategoriesChart;

