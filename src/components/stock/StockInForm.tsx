'use client';

import React, { useState, useEffect } from "react";

// The interface and all logic remain UNCHANGED.
interface Product {
  id: string;
  name: string;
  quantity: number;
}

export const StockInForm = () => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  // All of the logic functions (useEffect, handleAddStock) are unchanged.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch product list');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        alert("❌ Could not load product list.");
      }
    };
    fetchProducts();
  }, []);

  const handleAddStock = async () => {
    let body;
    if (isCreatingNew) {
      if (!newProductName || !newProductCategory || !quantity) {
        alert("Please fill in new product name, category, and quantity.");
        return;
      }
      body = {
        productName: newProductName,
        category: newProductCategory,
        quantity: Number(quantity),
        type: "IN",
        notes: notes,
      };
    } else {
      if (!selectedProductId || !quantity) {
        alert("Please select a product and enter a quantity.");
        return;
      }
      body = {
        productId: selectedProductId,
        quantity: Number(quantity),
        type: "IN",
        notes: notes,
      };
    }

    try {
      const res = await fetch("/api/stock/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("✅ Stock-in request sent for approval!");
        setSelectedProductId('');
        setNewProductName('');
        setNewProductCategory('');
        setQuantity("");
        setNotes("");
      } else {
        const { error } = await res.json();
        alert(`❌ Failed: ${error}`);
      }
    } catch (err) {
      console.error("Failed to submit stock-in", err);
      alert("❌ An error occurred.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg">
      {/* Form Header */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Record Stock In</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add stock to an existing product or create a new one.
        </p>
      </div>

      {/* Segmented Control Toggle */}
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setIsCreatingNew(false)}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
            !isCreatingNew ? 'bg-white shadow text-gray-800' : 'bg-transparent text-gray-500 hover:bg-gray-200'
          }`}
        >
          Existing Product
        </button>
        <button
          onClick={() => setIsCreatingNew(true)}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
            isCreatingNew ? 'bg-white shadow text-gray-800' : 'bg-transparent text-gray-500 hover:bg-gray-200'
          }`}
        >
          New Product
        </button>
      </div>

      <div className="space-y-6">
        {isCreatingNew ? (
          <div className="space-y-6">
            <div>
              <label htmlFor="newProductName" className="mb-2 block text-sm font-medium text-gray-700">New Product Name</label>
              <input id="newProductName" type="text" placeholder="e.g., Industrial Safety Helmet" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-800 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200"/>
            </div>
            <div>
              <label htmlFor="newProductCategory" className="mb-2 block text-sm font-medium text-gray-700">Category</label>
              <input id="newProductCategory" type="text" placeholder="e.g., Safety Equipment" value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)} className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-800 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200"/>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="selectProduct" className="mb-2 block text-sm font-medium text-gray-700">Select Existing Product</label>
            <select id="selectProduct" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-800 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200" required={!isCreatingNew}>
              <option value="" disabled>Select a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (In Stock: {product.quantity})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* --- Shared Fields --- */}
        <div>
          <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-gray-700">Quantity to Add</label>
          <input id="quantity" type="number" placeholder="e.g., 50" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-800 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200" min="1" required />
        </div>
        <div>
          <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-700">Notes (Optional)</label>
          <textarea id="notes" placeholder="e.g., From supplier 'Global Parts Inc.'" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-800 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200" rows={4} />
        </div>

        {/* --- Submit Button (Updated Size & Color) --- */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleAddStock}
            className="flex items-center justify-center rounded-lg bg-green-400 px-5 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            ➕ Request Stock In
          </button>
        </div>
      </div>
    </div>
  );
};