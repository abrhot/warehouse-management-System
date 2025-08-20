'use client';

import React, { useState, useMemo } from "react";
import { useRouter } from 'next/navigation'; // NEW: Import the router
import { ProductTable } from './ProductTable';
import { ProductHeader } from './ProductHeader';
import { Button } from '@/components/ui/button';
import { StockItemWithRelations } from '@/app/(main)/products/page';

const ITEMS_PER_PAGE = 20;

export function ProductsPageContent({ initialItems }: { initialItems: StockItemWithRelations[] }) {
  const router = useRouter(); // NEW: Initialize the router
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // NEW: This function tells Next.js to re-fetch the data for the page
  const handleRequestSuccess = () => {
    router.refresh();
  };

  const filteredItems = useMemo(() => {
    return initialItems.filter(item => {
      const matchesSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || item.product.category.name === selectedCategory;
      
      const matchesAvailability = selectedAvailability === "All" ||
                                  (selectedAvailability === "In Stock" && item.status === 'IN_STOCK') ||
                                  (selectedAvailability === "Out of Stock" && item.status !== 'IN_STOCK');
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [initialItems, searchTerm, selectedCategory, selectedAvailability]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(initialItems.map(item => item.product.category.name));
    return ["All", ...Array.from(categories)];
  }, [initialItems]);

  return (
    <div className="px-40 flex flex-1 justify-center py-5 bg-[#fafbf8]">
      <div className="max-w-[960px] w-full flex flex-col space-y-4">
        <ProductHeader
          categories={uniqueCategories}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onAvailabilityChange={setSelectedAvailability}
        />
        <ProductTable
          items={paginatedItems}
          onSuccess={handleRequestSuccess} // --- FIX: Pass the refresh function to the table ---
        />
        <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
      </div>
    </div>
  );
}
