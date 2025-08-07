'use client';

import React, { useState } from "react";

export const StockInForm = () => {
  const [productId, setProductId] = useState(""); // Ideally select from real product list
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [location, setLocation] = useState("Warehouse A");
  const [time, setTime] = useState("");
  const [handler, setHandler] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddStock = async () => {
    if (!productId || !quantity) {
      alert("Please fill product and quantity");
      return;
    }

    try {
      const res = await fetch("/api/stock/in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: Number(quantity),
          type: "IN", // 👈 this helps the backend distinguish stock type
          supplier,
          location,
          time,
          handler,
          notes,
        }),
      });

      if (res.ok) {
        alert("✅ Stock-in request sent!");
        setProductId("");
        setQuantity("");
        setSupplier("");
        setLocation("Warehouse A");
        setTime("");
        setHandler("");
        setNotes("");
      } else {
        const { error } = await res.json();
        alert("❌ Failed: " + error);
      }
    } catch (err) {
      console.error("Failed to submit stock-in", err);
      alert("❌ Error occurred");
    }
  };

  return (
    <div className="space-y-5 px-4">
      <input
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="w-full h-12 px-4 border rounded-xl bg-[#fafbf8] border-[#dae6d1]"
      />
      <input
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full h-12 px-4 border rounded-xl bg-[#fafbf8] border-[#dae6d1]"
      />
      <input
        placeholder="Supplier"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        className="w-full h-12 px-4 border rounded-xl bg-[#fafbf8] border-[#dae6d1]"
      />
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full h-12 px-4 border rounded-xl bg-[#fafbf8] border-[#dae6d1]"
      >
        <option>Warehouse A</option>
        <option>Warehouse B</option>
      </select>
      <input
        placeholder="Date and Time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full h-12 px-4 border rounded-xl bg-[#fafbf8] border-[#dae6d1]"
      />
      <input
        placeholder="Handled By"
        value={handler}
        onChange={(e) => setHandler(e.target.value)}
        className="w-full h-12 px-4 border rounded-xl bg-[#fafbf8] border-[#dae6d1]"
      />
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full h-24 px-4 py-2 border rounded-xl bg-[#fafbf8] border-[#dae6d1]"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setProductId("");
            setQuantity("");
            setSupplier("");
            setLocation("Warehouse A");
            setTime("");
            setHandler("");
            setNotes("");
          }}
          className="bg-gray-200 px-4 py-2 rounded-full font-bold"
        >
          Reset Form
        </button>
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
