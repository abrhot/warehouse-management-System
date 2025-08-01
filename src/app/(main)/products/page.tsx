'use client';

import { useState } from "react";
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductTable } from '@/components/products/ProductTable';

export default function ProductsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");

  // You can apply your filtering logic here or inside ProductTable
  const handleSearchChange = (value: string) => setSearchValue(value);
  const handleCategoryChange = (value: string) => setCategory(value);
  const handleAvailabilityChange = (value: string) => setAvailability(value);

  return (
    <div className="px-40 flex flex-1 justify-center py-5 bg-[#fafbf8]">
      <div className="max-w-[960px] w-full flex flex-col">
        <ProductHeader
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onAvailabilityChange={handleAvailabilityChange}
        />
        <ProductTable
          searchValue={searchValue}
          category={category}
          availability={availability}
        />
      </div>
    </div>
  );
}
