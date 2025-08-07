'use client';

import React, { useState, useEffect } from 'react';

// Define a type for the product data we fetch
interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
}

export default function StockOutForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  // Add other state for other form fields if needed

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Could not fetch products:", error);
        alert("❌ Could not load product list.");
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          productId: selectedProductId,
          quantity: Number(quantity),
          type: "OUT", // 👈 This is important!
          notes: notes, // You can send other data too
        }),
      });

      if (res.ok) {
        alert("✅ Stock-out request sent for approval!");
        // Reset form
        setSelectedProductId('');
        setQuantity('');
        setNotes('');
      } else {
        const { error } = await res.json();
        alert("❌ Error: " + error);
      }
    } catch (err) {
      console.error("Stock out error", err);
      alert("❌ Failed to send stock-out request");
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <form className="max-w-[480px] px-4 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-base font-medium text-[#141b0e] mb-2">Product</label>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full h-14 rounded-xl border border-[#dae7d0] bg-[#fafcf8] px-4"
          required
        >
          <option value="" disabled>Select a product...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (In Stock: {product.quantity})
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
         <div className="text-sm text-gray-500">
            Category: {selectedProduct.category}
         </div>
      )}

      <div>
        <label className="block text-base font-medium text-[#141b0e] mb-2">Quantity to Issue</label>
        <input
          type="number"
          placeholder="Enter Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full h-14 rounded-xl border border-[#dae7d0] bg-[#fafcf8] px-4"
          min="1"
          required
        />
      </div>
      
      {/* You can add more fields like "Issued To", "Reason", etc. here */}

      <div>
        <label className="block text-base font-medium text-[#141b0e] mb-2">Remarks / Notes</label>
        <textarea
            rows={3}
            placeholder="Additional Information"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-[#dae7d0] bg-[#fafcf8] p-4"
        />
      </div>

      <div className="flex justify-end gap-4 pt-3">
        <button
          type="submit"
          className="bg-[#78e61e] h-10 px-4 rounded-full font-bold text-sm text-[#141b0e]"
        >
          📥 Record Stock Out
        </button>
      </div>
    </form>
  );
}