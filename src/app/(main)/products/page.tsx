'use client';

import React, { useState, useEffect, useMemo } from "react";
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductTable } from '@/components/products/ProductTable';

// Define a type for the product data fetched from the API
interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  updatedAt: string;
}

export default function ProductsPage() {
  // State for the complete, unfiltered list of products
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  // State for each filter criteria
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");

  // State for loading and error handling during API fetch
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch all products from the API when the page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error('Failed to fetch product data from server');
        }
        const data: Product[] = await res.json();
        setAllProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Filter the products whenever a filter changes
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      
      const matchesAvailability = selectedAvailability === "All" ||
                                  (selectedAvailability === "In Stock" && product.quantity > 0) ||
                                  (selectedAvailability === "Out of Stock" && product.quantity === 0);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [allProducts, searchTerm, selectedCategory, selectedAvailability]);

  // 3. Get a unique list of categories for the filter dropdown
  const uniqueCategories = useMemo(() => {
    const categories = new Set(allProducts.map(p => p.category));
    return ["All", ...Array.from(categories)];
  }, [allProducts]);

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
          isLoading={loading}
          error={error}
        />
      </div>
    </div>
  );
}