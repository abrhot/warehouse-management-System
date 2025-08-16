// src/components/products/ProductsPageContent.tsx
'use client';

import React, { useState, useMemo } from "react";
import { ProductTable } from './ProductTable';
import { ProductHeader } from './ProductHeader';
// Import the new type for individual stock items
import { StockItemWithRelations } from '@/app/(main)/products/page';

// The component now expects 'initialItems' with the new data structure
export function ProductsPageContent({ initialItems }: { initialItems: StockItemWithRelations[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");

  // The filtering logic is updated to use the new nested structure
  const filteredItems = useMemo(() => {
    return initialItems.filter(item => {
      // Search matches the product name OR the unique serial number
      const matchesSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category is checked via item.product.category.name
      const matchesCategory = selectedCategory === "All" || item.product.category.name === selectedCategory;
      
      // Availability is now based on the item's status
      const matchesAvailability = selectedAvailability === "All" ||
                                  (selectedAvailability === "In Stock" && item.status === 'IN_STOCK') ||
                                  (selectedAvailability === "Out of Stock" && item.status !== 'IN_STOCK');
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [initialItems, searchTerm, selectedCategory, selectedAvailability]);

  // The category list is generated from the new data structure
  const uniqueCategories = useMemo(() => {
    const categories = new Set(initialItems.map(item => item.product.category.name));
    return ["All", ...Array.from(categories)];
  }, [initialItems]);

  return (
    <div className="px-40 flex flex-1 justify-center py-5 bg-[#fafbf8]">
      <div className="max-w-[960px] w-full flex flex-col">
        <ProductHeader
          categories={uniqueCategories}
          onSearchChange={setSearchTerm} // Assuming ProductHeader has the search input
          onCategoryChange={setSelectedCategory}
          onAvailabilityChange={setSelectedAvailability}
        />
        {/* Pass the corrected prop 'items' to ProductTable */}
        <ProductTable
          items={filteredItems}
        />
      </div>
    </div>
  );
}