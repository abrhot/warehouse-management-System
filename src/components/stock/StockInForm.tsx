'use client';

import React, { useState, useEffect } from "react";

// Define a type for the product data we fetch
interface Product {
  id: string;
  name: string;
  quantity: number;
}

export const StockInForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
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
    if (!selectedProductId || !quantity) {
      alert("Please select a product and enter a quantity.");
      return;
    }

    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    try {
      const res = await fetch("/api/stock/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId, // Send the ID of the selected product
          quantity: Number(quantity),
          type: "IN", // This is important!
          notes: notes,
        }),
      });

      if (res.ok) {
        alert("✅ Stock-in request sent for approval!");
        // Reset form
        setSelectedProductId('');
        setQuantity("");
        setNotes("");
      } else {
        const { error } = await res.json();
        alert("❌ Failed: " + error);
      }
    } catch (err) {
      console.error("Failed to submit stock-in", err);
      alert("❌ An error occurred.");
    }
  };

  return (
    <div className="space-y-5 px-4 max-w-lg mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full h-12 px-4 border rounded-xl bg-white"
          required
        >
          <option value="" disabled>Select a product to add stock...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (Current Stock: {product.quantity})
            </option>
          ))}
        </select>
      </div>

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
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          placeholder="Notes (e.g., Supplier, Condition)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-24 px-4 py-2 border rounded-xl"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleAddStock}
          className="bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600"
        >
          ➕ Request Stock In
        </button>
      </div>
    </div>
  );
};