'use client';

import Link from "next/link";
import React, { useState } from "react";

interface ProductHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onAvailabilityChange: (availability: string) => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  searchValue,
  onSearchChange,
  onCategoryChange,
  onAvailabilityChange,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const categories = ["All", "Electronics", "Clothing", "Food"];
  const availabilityOptions = ["All", "In Stock", "Out of Stock"];

  return (
    <div className="flex flex-wrap justify-between gap-3 p-4 relative">
      <p className="text-[#141b0e] tracking-light text-[32px] font-bold leading-tight min-w-72">
        Product Management
      </p>

      <div className="flex gap-3 p-3 flex-wrap pr-4 relative z-10">
        {/* Category Button */}
        <div className="relative">
          <button
            onClick={() => {
              setCategoryOpen((prev) => !prev);
              setAvailabilityOpen(false);
            }}
            className="flex h-8 items-center gap-2 rounded-xl bg-[#edf3e8] pl-4 pr-2 text-sm text-[#141b0e] font-medium"
          >
            Category ⌄
          </button>
          {categoryOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-xl shadow-md w-40 text-sm">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onCategoryChange(cat);
                    setCategoryOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#edf3e8] text-[#141b0e]"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Availability Button */}
        <div className="relative">
          <button
            onClick={() => {
              setAvailabilityOpen((prev) => !prev);
              setCategoryOpen(false);
            }}
            className="flex h-8 items-center gap-2 rounded-xl bg-[#edf3e8] pl-4 pr-2 text-sm text-[#141b0e] font-medium"
          >
            Availability ⌄
          </button>
          {availabilityOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-xl shadow-md w-40 text-sm">
              {availabilityOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onAvailabilityChange(status);
                    setAvailabilityOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#edf3e8] text-[#141b0e]"
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
