// src/components/products/ProductHeader.tsx
'use client';

import React from "react";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ProductHeaderProps {
  categories: string[];
  onCategoryChange: (category: string) => void;
  onAvailabilityChange: (availability: string) => void;
  onSearchChange: (value: string) => void;
  searchTerm: string;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  categories,
  onCategoryChange,
  onAvailabilityChange,
  onSearchChange,
  searchTerm,
}) => {
  const availabilityOptions = ["All", "In Stock", "Out of Stock"];

  return (
    <div className="flex justify-between items-center gap-4 mb-4">
      {/* Left-side Search Input */}
      <div className="flex justify-start">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs bg-[#edf3e8] text-[#141b0e] border-[#dae6d1] placeholder-[#6f9550] focus:ring-[#98FB98]"
        />
      </div>

      {/* Right-side Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Category Filter */}
        <Select onValueChange={onCategoryChange}> {/* Removed defaultValue */}
          <SelectTrigger className="w-[180px] bg-[#edf3e8] text-[#141b0e] border-[#dae6d1] focus:ring-[#98FB98]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-[#edf3e8] border-[#dae6d1]">
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Availability Filter */}
        <Select onValueChange={onAvailabilityChange}> {/* Removed defaultValue */}
          <SelectTrigger className="w-[180px] bg-[#edf3e8] text-[#141b0e] border-[#dae6d1] focus:ring-[#98FB98]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent className="bg-[#edf3e8] border-[#dae6d1]">
            {availabilityOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};