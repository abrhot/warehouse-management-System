'use client';

import Link from "next/link";
import React from "react";

interface ProductHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  searchValue,
  onSearchChange,
}) => (
  <div className="flex flex-wrap justify-between gap-3 p-4">
    <p className="text-[#141b0e] tracking-light text-[32px] font-bold leading-tight min-w-72">
      Product Management
    </p>

  

   

    <div className="flex gap-3 p-3 flex-wrap pr-4">
      <button className="flex h-8 items-center gap-2 rounded-xl bg-[#edf3e8] pl-4 pr-2 text-sm text-[#141b0e] font-medium">
        Category ⌄
      </button>
      <button className="flex h-8 items-center gap-2 rounded-xl bg-[#edf3e8] pl-4 pr-2 text-sm text-[#141b0e] font-medium">
        Availability ⌄
      </button>
    </div>
  </div>
);
