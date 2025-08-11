// src/components/products/ProductsPageContent.tsx
'use client';

import React, { useState, useMemo } from "react";
import { ProductTable } from './ProductTable';
import { ProductHeader } from './ProductHeader';
import { ProductWithRelations } from '@/app/(main)/products/page';

export function ProductsPageContent({ initialProducts }: { initialProducts: ProductWithRelations[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (product.sku?.toLowerCase().includes(searchTerm.toLowerCase())); // Use optional chaining for sku
      
      const matchesCategory = selectedCategory === "All" || product.category.name === selectedCategory;
      
      const matchesAvailability = selectedAvailability === "All" ||
                                  (selectedAvailability === "In Stock" && product.quantity > 0) ||
                                  (selectedAvailability === "Out of Stock" && product.quantity === 0);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [initialProducts, searchTerm, selectedCategory, selectedAvailability]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(initialProducts.map(p => p.category.name));
    return ["All", ...Array.from(categories)];
  }, [initialProducts]);

  return (
    <div className="px-40 flex flex-1 justify-center py-5 bg-[#fafbf8]">
      <div className="max-w-[960px] w-full flex flex-col">
        <ProductHeader
          categories={uniqueCategories}
          onCategoryChange={setSelectedCategory}
          onAvailabilityChange={setSelectedAvailability}
        />
        <ProductTable
          products={filteredProducts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </div>
  );
}