'use client';

import React, { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { ProductTable } from './ProductTable';
import { ProductHeader } from './ProductHeader';
import { NewProductForm } from './NewProductForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SerializableStockItem } from '@/app/(main)/products/page';
import { useAuth } from '@/context/AuthContext';

interface ProductsPageContentProps {
  initialItems: SerializableStockItem[];
}

export function ProductsPageContent({ initialItems }: ProductsPageContentProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const ITEMS_PER_PAGE = 20;

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
        <div className="flex justify-between items-center">
          <ProductHeader
            categories={uniqueCategories}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onAvailabilityChange={setSelectedAvailability}
          />
          <Button
            onClick={() => setShowNewProductForm(true)}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
        <ProductTable
          items={paginatedItems}
          onSuccess={handleRequestSuccess}
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
      
      <NewProductForm
        open={showNewProductForm}
        onOpenChange={setShowNewProductForm}
        onSuccess={handleRequestSuccess}
        userRole={user?.role}
      />
    </div>
  );
}
