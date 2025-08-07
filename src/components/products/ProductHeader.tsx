'use client';

import React, { useState } from "react";

interface ProductHeaderProps {
  categories: string[];
  onCategoryChange: (category: string) => void;
  onAvailabilityChange: (availability: string) => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  categories,
  onCategoryChange,
  onAvailabilityChange,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const availabilityOptions = ["All", "In Stock", "Out of Stock"];

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 p-4 relative mb-4">
      <p className="text-[#141b0e] tracking-light text-[32px] font-bold leading-tight min-w-72">
        Product Management
      </p>

      <div className="flex gap-3 flex-wrap relative z-10">
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
            <div className="absolute top-full right-0 mt-1 bg-white border rounded-xl shadow-md w-48 text-sm">
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
            <div className="absolute top-full right-0 mt-1 bg-white border rounded-xl shadow-md w-40 text-sm">
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