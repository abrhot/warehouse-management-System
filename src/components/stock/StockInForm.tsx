'use client';

import React, { useState, useEffect } from "react";

// Define a type for the product data we fetch
interface Product {
  id: string;
  name: string;
  quantity: number;
}

export const StockInForm = () => {
  // State to manage which mode we're in
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // State for adding stock to an EXISTING product
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  // State for creating a NEW product
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');

  // Shared state
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch the list of existing products when the component loads
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

    // --- Logic for Creating a NEW Product ---
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
    } 
    // --- Logic for Adding to an EXISTING Product ---
    else {
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

    // --- Submit to API ---
    try {
      const res = await fetch("/api/stock/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("✅ Stock-in request sent for approval!");
        // Reset form
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
    <div className="space-y-5 px-4 max-w-lg mx-auto">
      {/* --- The TOGGLE to switch between modes --- */}
      <div className="flex items-center">
        <input
          id="createNew"
          type="checkbox"
          checked={isCreatingNew}
          onChange={(e) => setIsCreatingNew(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="createNew" className="ml-2 block text-sm font-medium text-gray-900">
          Create a new product
        </label>
      </div>

      {/* --- Conditional UI based on the toggle --- */}
      {isCreatingNew ? (
        // UI for CREATING a new product
        <div className="space-y-4 animate-fade-in">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Product Name</label>
              <input
                type="text"
                placeholder="e.g., Industrial Safety Helmet"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-full h-12 px-4 border rounded-xl"
              />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g., Safety Equipment"
                value={newProductCategory}
                onChange={(e) => setNewProductCategory(e.target.value)}
                className="w-full h-12 px-4 border rounded-xl"
              />
          </div>
        </div>
      ) : (
        // UI for selecting an EXISTING product
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Existing Product</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full h-12 px-4 border rounded-xl bg-white"
            required={!isCreatingNew}
          >
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add</label>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full h-12 px-4 border rounded-xl"
          min="1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          placeholder="e.g., From supplier 'Global Parts Inc.'"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-24 px-4 py-2 border rounded-xl"
        />
      </div>

      {/* --- Submit Button --- */}
      <div className="flex justify-end">
        <button
          onClick={handleAddStock}
          className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700"
        >
          ➕ Request Stock In
        </button>
      </div>
    </div>
  );
};