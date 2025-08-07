'use client';

import React, { useState } from "react";

export const StockInForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  // Add other state if needed (e.g., supplier, handler)

  const handleAddStock = async () => {
    if (!name || !category || !quantity) {
      alert("Please fill in product name, category, and quantity.");
      return;
    }

    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    try {
      // We send productName and category. The API will find or create the product.
      const res = await fetch("/api/stock/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: name,
          category: category,
          quantity: Number(quantity),
          type: "IN", // 👈 This is important!
          notes: notes,
          // You could also send handler, supplier, etc.
        }),
      });

      if (res.ok) {
        alert("✅ Stock-in request sent for approval!");
        // Reset form
        setName("");
        setCategory("");
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
    <div className="space-y-5 px-4">
      <input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full h-12 px-4 border rounded-xl bg-[#fafbf8] border-[#dae6d1]"
      />
      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full h-12 px-4 border rounded-xl bg-[#fafbf8] border-[#dae6d1]"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full h-12 px-4 border rounded-xl bg-[#fafbf8] border-[#dae6d1]"
        min="1"
      />
      <textarea
        placeholder="Notes (e.g., Supplier, Handled By)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full h-24 px-4 py-2 border rounded-xl bg-[#fafbf8] border-[#dae6d1]"
      />
      <div className="flex justify-end">
        <button
          onClick={handleAddStock}
          className="bg-green-500 text-white px-4 py-2 rounded-full font-bold"
        >
          ➕ Request Stock In
        </button>
      </div>
    </div>
  );
};